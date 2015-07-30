This directory contains the POT files for the various Drupal core modules.

Translation
===========

Translators should start by getting all of them and translate them to their
language of choice.

The translated files should be stored in contrib-cvs/translations/<id>,
where <id> is the ISO 639 language code. If you don't know your code, ask
on the translation mailing list (translations at drupal.org).

You should only put the individual translated files in that directory.
A script will generate a merged <id>.po file. Make sure to fill out the
header section of each file and rename them to .po from .pot.

Contrib modules should offer a POT file, too. It should be distributed in
their own subdirectory in contrib-cvs/modules.


Creation
========

The POT files are created by running the extractor.php script (also in this
directory) on all source files that contain translatable strings.
An example if you are in the Drupal root folder:

  php extractor.php
  
This does an automatic scanning for all files in the current folder and
subfolders and excludes the extractor, so that only real Drupal source
files are parsed. If you need to parse a contrib module for strings, you
can either start the automatic scan from that folder, or specify the
filenames to look for:
   
  php extractor.php --files *.module *.inc *.php

All files get their own POT file unless they contain less than ten strings,
which will be merged in the general.pot file. This special POT file also
contains all strings that occur more than once in the Drupal source files.
This will help translators to maintain a single translation for them. 


Updating
========

Once in a while we will create new POT files in this subdirectory as
sometimes strings get added or changed. Translators should then run
msgmerge on their auto-generated <id>.po file against each new POT file
and put the resulting PO file back in their subdirectory.


$Id: README.txt,v 1.1.1.1 2006-09-13 13:11:05 root Exp $

Gerhard Killesreiter
