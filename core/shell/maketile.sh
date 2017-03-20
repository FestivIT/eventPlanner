#!/bin/bash

# $1: eventId
# $2: lng 0 0
# $3: lat 0 0
# $4: lng lMax 0
# $5: lat lMax 0
# $6: lng lMax hMax
# $7: lat lMax hMax
# $8: HD Density
#
# ex: maketile.sh '-3.791152' '48.587196' '-3.789349' '48.584301' '-3.792740' '48.583108' 1230

# Repertoire du script:
BASEDIR=$(dirname $0)/../../ressources/eventPlan/$1
DIR=$(dirname $0)

clear
echo "Création des tuiles pour eventId: $1"
echo "------------------------------------"
echo "Début: $(date +"%d-%m-%Y %H:%M")"
echo " Informations:"
echo "  Point [0,0]: $2 , $3"
echo "  Point [0,y]: $4 , $5"
echo "  Point [x,0]: $6 , $7"
echo "  Densité HD : $8"
echo " "
echo "Création de l image haute résolution"
echo "------------------------------------"
gs -q -dQUIET -dSAFER -dBATCH -dNOPAUSE -dNOPROMPT -dMaxBitmap=500000000 -dAlignToPixels=0 -dGridFitTT=2 -sDEVICE=jpeg -dTextAlphaBits=4 -dGraphicsAlphaBits=4 -dJPEGQ=95 -sOutputFile=$BASEDIR/planHD.jpg -r$8 $BASEDIR/plan.pdf
echo "OK"
echo "Taille de l image:"
HDSIZE=$(file $BASEDIR/planHD.jpg | grep -o ", [0-9]*x[0-9]*" | grep -o "[0-9]*x[0-9]*")
HDW=$(echo $HDSIZE | cut -f1 -dx)
HDH=$(echo $HDSIZE | cut -f2 -dx)
echo "Largeur: $HDW"
echo "Hauteur: $HDH"
echo " "
echo "Suppression des anciennes tuiles"
echo "------------------------------------"
rm -rf $BASEDIR/tiles
echo "OK"
echo " "
echo "Géolocalisation de l image:"
gdal_translate -of GTiff -a_srs EPSG:4326 -gcp 0 0 $2 $3 -gcp $HDW 0 $4 $5 -gcp 0 $HDH $6 $7 $BASEDIR/planHD.jpg $BASEDIR/tmp.tif
echo "OK"
echo " "
echo "Transformation géographique de l image:"
echo "------------------------------------"
echo " "
gdalwarp -dstnodata -srcnodata -dstalpha -s_srs EPSG:4326 -t_srs EPSG:3857 $BASEDIR/tmp.tif $BASEDIR/tmpWrap.tif
echo "OK"
echo " "
echo "Création des tuiles:"
echo "------------------------------------"
echo " "
python $DIR/gdal2tiles-multiprocess.py -z 14-21 $BASEDIR/tmpWrap.tif $BASEDIR/tiles
echo "OK"
echo " "
echo "Suppression des fichiers temporaires"
echo "------------------------------------"
rm -f $BASEDIR/tmp.tif $BASEDIR/tmpWrap.tif $BASEDIR/planHD.jpg
echo "OK"
echo " "
echo "------------------------------------"
echo "Terminé: $(date +"%d-%m-%Y %H:%M")"
echo "------------------------------------"
exit 0
