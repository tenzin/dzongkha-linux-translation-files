This directory contains the POT files for the various Drupal core modules.

Translation
===========

Translators should start by getting all of them and translate them to their
language of choice.

The translated files should be stored in contrib-cvs/translations/<id>,
where <id> is the ISO 639 language code. If you don't know your code, ask
on the translation mailing list (translations at drupal.org).

You should only put the individual translated files in that directory.
A script will generate a merged <id>.po file. There is also an installer.pot
file which will not get merged into the <id>.po file. This is used by the
installer, and should not be imported to the Drupal database. Make sure to 
fill out the header section of each file and rename them to .po from .pot.

Contrib modules should offer a POT file, too. It should be distributed in
their own subdirectory in contrib-cvs/modules.


Creation
========

The POT files are created by running the extractor.php script (also in this
directory) on all source files that contain translatable strings.

You can run the extractor script from command line, or copy it into a web
accessible folder, from where you would like to extract strings. Note that
by using extractor with your browser, you are opening security holes on 
your system, since you need to give rights to PHP to create and write 
files in the folder where your Drupal website code resides. Only do this 
on a development system! You have been warned!

Examples:

 Extract all Drupal strings:
 ---------------------------
 
  1. Copy the extractor.php to the Drupal website root.
  2. Access http://example.com/drupal/extractor.php with your browser
     (if your website root is example.com/drupal).
  3. Translation templates are generated in this folder, if you
     have the proper rights to create files here.

 Extract strings for a module:
 -----------------------------     

  1. Copy the extractor.php to the Drupal module folder,
     eg. to modules/bbcode/extractor.php if you have bbcode
     installed and are interested in a translation template.
  2. Access http://example.com/drupal/modules/bbcode/extractor.php 
     with your browser (if your website root is example.com/drupal).
  3. Translation templates are generated in this folder, if you
     have the proper rights to create files here.

 Generate templates on the command line:
 ---------------------------------------
 
  1. Copy the extactor.php to whatever folder you would like
     to generate template files in.
  2. Run 'php extactor.php' and the script will autodiscover
     all possible files to generate templates for.
  3. Translation templates are generated in this folder, if you
     have the proper rights to create files here.
     
  Alternatively you can run 'php extractor.php --help' to get
  a list of more options.
  
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


$Id: README.txt,v 1.1.1.1 2006-12-25 12:43:43 root Exp $