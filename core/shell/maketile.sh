#!/bin/bash

# $1: eventId
# $2: largeur de l'image (px)
# $3: hauteur de l'image (px)
# $4: lng 0 0
# $5: lat 0 0
# $6: lng lMax 0
# $7: lat lMax 0
# $8: lng lMax hMax
# $9: lat lMax hMax
#
# ex: maketile.sh 16542 11694 '-3.791152' '48.587196' '-3.789349' '48.584301' '-3.792740' '48.583108'

# Repertoire du script:
BASEDIR=$(dirname $0)/../../ressources/eventPlan/$1
DIR=$(dirname $0)

clear

echo Création des tuiles pour eventId: $1
echo ------------------------------------
echo  
echo Création de l image haute résolution
echo ------------------------------------
gs -q -dQUIET -dSAFER -dBATCH -dNOPAUSE -dNOPROMPT -dMaxBitmap=500000000 -dAlignToPixels=0 -dGridFitTT=2 -sDEVICE=jpeg -dTextAlphaBits=4 -dGraphicsAlphaBits=4 -dJPEGQ=95 -sOutputFile=$BASEDIR/planHD.jpg -r$10 $BASEDIR/planHD.pdf
echo OK
echo  
echo Suppression des anciennes tuiles
echo ------------------------------------
rm -rf $BASEDIR/tiles
echo OK
echo  
echo Géolocalisation de l image:
gdal_translate -of GTiff -a_srs EPSG:4326 -gcp 0 0 $4 $5 -gcp $2 0 $6 $7 -gcp $2 $3 $8 $9 $BASEDIR/planHD.jpg $BASEDIR/tmp.tif
echo OK
echo  
echo Transformation géographique de l image:
echo ------------------------------------
echo  
gdalwarp -dstnodata -srcnodata -dstalpha -s_srs EPSG:4326 -t_srs EPSG:3857 $BASEDIR/tmp.tif $BASEDIR/tmpWrap.tif
echo OK
echo  
echo Création des tuiles:
echo ------------------------------------
echo  
python $DIR/gdal2tiles-multiprocess.py -z 12-20 $BASEDIR/tmpWrap.tif $BASEDIR/tiles
echo OK
echo  
echo Suppression des fichiers temporaires
echo ------------------------------------
echo  
rm -f $BASEDIR/tmp.tif $BASEDIR/tmpWrap.tif
echo  
echo ------------------------------------
echo  TERMINE
echo ------------------------------------
exit 0
