/*
 * possible uses of dropdown: sort: $.editableTableWidget.dropdownSort.ID
 */

/*global $, window*/
$.fn.editableTableWidget = function (options) {
    'use strict';
    var DATE_FORMAT = 'DD MMM YYYY',
        ARROW_LEFT = 37,
        ARROW_UP = 38,
        ARROW_RIGHT = 39,
        ARROW_DOWN = 40,
        ENTER = 13,
        ESC = 27,
        TAB = 9,
        DEL = 46,
        EMPTY_STRING = '';

    return $(this).each(function () {
        var buildDefaultOptions = function () {
            var opts = $.extend({}, $.fn.editableTableWidget.defaultOptions);
            opts.editor = opts.editor.clone();
            return opts;
        },
	        activeOptions = $.extend(buildDefaultOptions(), options),
	        element = $(this),
	        editor,
	        active,
	        setActiveText = function (deleteValue = false) {
	        	if(deleteValue){
	        		var currentValue = '';
	        	}else{
	        		var currentValue = editor.val();
	        	}
	            var initalValue = active.attr('data-original-value'),
                    originalContent = active.html(),
                    originalValue = active.text().trim(),
                    originalAndCurrent = [currentValue, originalValue],
                    evt = $.Event('change', {
                    	originalAndCurrent: originalAndCurrent,
                    	activeCell: active
                    	});
				
	            if (originalValue === currentValue || editor.hasClass('error')) {
                    return true;
	            };

                /*
                if(editor.hasClass('error')){
                    if (activeOptions.showEditedCell) {
                        active.removeClass('success');
                    }
                    else if (activeOptions.showEditedRow) {
                        active.parents('tr').each(function () {
                            $(this).removeClass('success');
                        });
                    };

                    return true;
                }
                */

	            // if empty overwrite all text, otherwise update only the text content (node type = 3) and not any hidden elements
	            if (originalValue === EMPTY_STRING) {
	                active.text(currentValue);
	            } else {
	                active.contents().filter(function () {
	                    return this.nodeType === 3;
	                }).last().replaceWith(currentValue);
	            }

	            active.trigger(evt, originalAndCurrent);
	            if (evt.result === false) {
	                active.html(originalContent);
	            }
	            else if (activeOptions.url) {
	                var cellValue = {};
	                cellValue[active.attr('name')] = active.text().trim();

	                //serialize to get hidden inputs
	                var cellObject = $.extend({}, active.data(), cellValue);

	                $.ajax({
	                    type: 'POST',
	                    url: activeOptions.url,
	                    dataType: 'json',
	                    data: { 'postObject': cellObject },
	                    success: function () {
	                        active.removeClass('error blank danger').addClass('success');
	                        if (typeof activeOptions.callback === "function") {
	                            activeOptions.callback();
	                        }
	                    },
	                    error: function () {
	                        active.removeClass('success').addClass('danger');
	                        active.html(originalContent);
	                        active.trigger(evt, originalAndCurrent);
	                    }
	                });
	            }else if(initalValue != currentValue){
                    if (activeOptions.showEditedCell) {
                        active.addClass('success');
                    }
                    else if (activeOptions.showEditedRow) {
                        active.parents('tr').each(function () {
                            $(this).addClass('success');
                        });
                    }
                }else{
                    if (activeOptions.showEditedCell) {
                        active.removeClass('success');
                    }
                    else if (activeOptions.showEditedRow) {
                        active.parents('tr').each(function () {
                            $(this).removeClass('success');
                        });
                    };
                };
	            return true;
	        },
            movement = function (cell, keycode) {
                if (keycode === ARROW_RIGHT) {
                    return cell.nextAll('td:visible').first();
                } else if (keycode === ARROW_LEFT) {
                    return cell.prevAll('td:visible').first();
                } else if (keycode === ARROW_UP) {
                    return cell.parent().prevAll(':visible').first().children().eq(cell.index());
                } else if (keycode === ARROW_DOWN) {
                    return cell.parent().nextAll(':visible').first().children().eq(cell.index());
                }
                return [];
            },
            columnIsReadOnly = function (activeCell) {
                var colIndex = activeCell.parent().children().index(activeCell);
                var colHeader = activeCell
                    .parents('table')
                    .find('thead tr th:eq(' + colIndex + ')');
                return colHeader.attr('readonly') && !colHeader.is('[readonly="false"]');
            },
	        cellIsReadOnly = function (activeCell) {
	            return activeCell.attr('readonly') && !activeCell.is('[readonly="false"]');
	        },
            buildEditors = function () {
                var eds = { 'default': activeOptions.editor };
                if (options && options.types) {
                    $.each(options.types, function (index, obj) {
                        if (obj) {
                            switch (obj.type) {
                                case 'dropdown':
                                    // construct select list
                                    var sel = $('<select>').attr('id', index);

									if(typeof obj.source === 'function'){
										eds[index] = sel;
										eds[index].updateList = function(active){
											var newList = obj.source(active);
											sel.empty();
											
											$.each(newList, function (sourceIndex, sourceVal) {
		                                        if (sourceVal !== '') {
		                                            if (typeof (sourceVal) === 'object') {
		                                                sel.append($('<option>').attr('value', sourceVal.Key).text(sourceVal.Value));
		                                            } else {
		                                                sel.append($('<option>').attr('value', sourceIndex).text(sourceVal));
		                                            }
		                                        }
		                                    });
										}
										
										// override existing val function
	                                    eds[index].originalVal = eds[index].val;
	                                    eds[index].val = function (value) {
	                                        // getter
	                                        if (typeof value == 'undefined') {
	                                            if (active) {
	                                                // may want to move this to part of setActiveText - after success - although the update url will need this to be set so might be ok here!?
	                                                active.attr('data-val', this.originalVal());
	                                            }
	
	                                            // return Text
	                                            return this.find('option:selected').text();
	                                        }
	                                            // setter
	                                        else {
	                                            var id = this.find('option').filter(function () {
	                                                return $.trim($(this).text()) === value;
	                                            }).attr('value');
	
	                                            return this.originalVal(id);
	                                        }
	                                    };
									}else{
	                                    // Sorting of Dropdown [NONE | ID | TEXT]
	                                    var sortable;
	                                    if (obj.sort !== $.editableTableWidget.dropdownSort.NONE) {
	                                        // sort object list  --> array 
	                                        sortable = [];
	                                        for (var key in obj.source) {
	                                            if (obj.source.hasOwnProperty(key)) {
	                                                var item = {};
	                                                item.Key = key;
	                                                item.Value = obj.source[key];
	                                                sortable.push(item);
	                                            }
	                                        }
	
	                                        if (typeof sortable.sort === 'function') {
	                                            sortable.sort(function (item1, item2) {
	                                                if (typeof (item1) === 'object' && typeof (item2) === 'object') {
	                                                    if (obj.sort === $.editableTableWidget.dropdownSort.ID) {
	                                                        return item1.Key - item2.Key;
	                                                    } else { // Default - sort by TEXT Value
	                                                        if (typeof item1.Value === 'string' && typeof item2.Value === 'string') {
	                                                            return item1.Value.localeCompare(item2.Value);
	                                                        }
	                                                        return item1 - item2;
	                                                    }
	                                                } else if (typeof (item1) === 'string' && typeof (item2) === 'string') {
	                                                    return item1.localeCompare(item2);
	                                                } else {
	                                                    return item1 - item2;
	                                                }
	                                            });
	                                        }
	                                    } else {
	                                        sortable = obj.source;
	                                    }
	
	                                    $.each(sortable, function (sourceIndex, sourceVal) {
	                                        if (sourceVal !== '') {
	                                            if (typeof (sourceVal) === 'object') {
	                                                sel.append($('<option>').attr('value', sourceVal.Key).text(sourceVal.Value));
	                                            } else {
	                                                sel.append($('<option>').attr('value', sourceIndex).text(sourceVal));
	                                            }
	                                        }
	                                    });
	                                    eds[index] = sel;
	
	                                    // override existing val function
	                                    eds[index].originalVal = eds[index].val;
	                                    eds[index].val = function (value) {
	                                        // getter
	                                        if (typeof value == 'undefined') {
	                                            if (active) {
	                                                // may want to move this to part of setActiveText - after success - although the update url will need this to be set so might be ok here!?
	                                                active.attr('data-val', this.originalVal());
	                                            }
	
	                                            // return Text
	                                            return this.find('option:selected').text();
	                                        }
	                                            // setter
	                                        else {
	                                            var id = this.find('option').filter(function () {
	                                                return $.trim($(this).text()) === value;
	                                            }).attr('value');
	
	                                            return this.originalVal(id);
	                                        }
	                                    };
									}
                                    break;
                                case 'date':
                                    eds[index] = activeOptions.editor.clone();
                                    eds[index].isDate = true;
                            }

                            // append properties in obj
                            if (eds[index]) {
                                $.each(obj, function (property, value) {
                                    eds[index][property] = value;
                                });
                            }
                        }
                    });
                };

                $.each(eds, function (index, obj) {
                    obj.css('position', 'absolute')
                        .hide()
                        .appendTo(element.parent())
                        .blur(function () {
                            setActiveText();
                            editor.hide();
                        }).keydown(function (e) {
                            if (e.which === ENTER) {
                                //setActiveText();
                                editor.hide();
                                active.focus();
                                e.preventDefault();
                                e.stopPropagation();
                            } else if (e.which === ESC) {
                                editor.val(active.text().trim());
                                e.preventDefault();
                                e.stopPropagation();
                                editor.hide();
                                active.focus();
                            } else if (e.which === TAB) {
                                active.focus();
                            } else if (this.selectionEnd - this.selectionStart === this.value.length) {
                                var possibleMove = movement(active, e.which);
                                if (possibleMove.length > 0) {
                                    possibleMove.focus();
                                    e.preventDefault();
                                    e.stopPropagation();
                                }
                            }
                        })
                        .on('input paste', function () {
                            var evt = $.Event('validate');
                            active.trigger(evt, editor.val());
                            if (evt.result === false) {
                                editor.addClass('error');
                            } else {
                                editor.removeClass('error');
                            }
                        });
                });
                return eds;
            },
            editors = buildEditors(),
            getEditor = function (activeCell) {
                var colIndex = activeCell.parent().children().index(activeCell);
                var colName = activeCell
                                .parents('table')
                                .find('thead tr th:eq(' + colIndex + ')')
                                .attr('name');

                var col = activeOptions.columns ? activeOptions.columns[colName] : null;

				var ed = col ? editors[col] : editors['default'];
				
				if(ed.hasOwnProperty('updateList')){
					ed.updateList(activeCell);
				}
				
                return ed;
            },
	        showEditor = function (select) {
	            active = element.find('tbody td:focus');
	            if (active.length
                    && !cellIsReadOnly(active)
                    && !columnIsReadOnly(active)
                    && active.children().not('[type="hidden"]').length === 0) {
	                editor = getEditor(active);
	                editor.val(active.text().trim())
                        .removeClass('error')
                        .show()
                        .offset(active.offset())
                        .css(active.css(activeOptions.cloneProperties))
                        .width(active.width())
                        .height(active.height())
                        .focus();
	                if (select) {
	                    editor.select();

	                    if (editor.isDate === true && typeof $(editor).datepicker === 'function') {
	                        $(editor).datepicker({
	                            'onClose': function (dateText, instance) {
	                                if (editor.fixedDayOfMonth && typeof moment === 'function') {
	                                    dateText = moment(dateText)
                                                    .date(editor.fixedDayOfMonth)
                                                    .format(editor.dateFormat || DATE_FORMAT);
	                                }

	                                if (new Date(active.text()).setHours(0, 0, 0, 0) !== new Date(dateText).setHours(0, 0, 0, 0)) {
	                                    $(active).text(dateText);
	                                    $(active).trigger('change');
	                                }
	                            }
	                        });
	                        $(editor).datepicker('show');
	                    }
	                }
	            }
	        };

        element.find('tbody').delegate('td', 'click keypress dblclick', showEditor)
                .css('cursor', 'pointer')
                .keydown(function (e) {
                    var prevent = true,
                        possibleMove = movement($(e.target), e.which);
                    if (possibleMove.length > 0) {
                        possibleMove.focus();
                    } else if (e.which === ENTER) {
                        showEditor(false);
                    } else if (e.which === DEL) {
                    	active = element.find('tbody td:focus');
			            if (active.length
		                    && !cellIsReadOnly(active)
		                    && !columnIsReadOnly(active)
		                    && active.children().not('[type="hidden"]').length === 0) {
                        		setActiveText(true); // Delete value
		                    }
		                active.focus();
                    } else if (e.which === 17 || e.which === 91 || e.which === 93) {
                        showEditor(true);
                        prevent = false;
                    } else {
                        prevent = false;
                    }
                    if (prevent) {
                        e.stopPropagation();
                        e.preventDefault();
                    }
                });

        element.find('tbody td').prop('tabindex', 1);

        $(window).on('resize', function () {
            if (editor && editor.is(':visible')) {
                editor.offset(active.offset())
                .width(active.width())
                .height(active.height());
            }
        });

        // Datatable integration - if editor is active and user scrolls - hide editor
        $('div.dataTables_scrollBody').scroll(function () {
            if (editor) {
                editor.hide();
            }
        });
    });
};

$.editableTableWidget = {};
$.editableTableWidget.dropdownSort = {
    NONE: 'NONE',
    TEXT: 'TEXT',
    ID: 'ID'
};

$.fn.editableTableWidget.defaultOptions = {
    cloneProperties: ['padding', 'padding-top', 'padding-bottom', 'padding-left', 'padding-right',
                      'text-align', 'font', 'font-size', 'font-family', 'font-weight',
                      'border', 'border-top', 'border-bottom', 'border-left', 'border-right'],
    editor: $('<input>')
};