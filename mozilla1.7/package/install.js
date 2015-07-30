// ***** BEGIN LICENSE BLOCK *****
// Version: MPL 1.1/GPL 2.0/LGPL 2.1
//
// The contents of this file are subject to the Mozilla Public License Version
// 1.1 (the "License"); you may not use this file except in compliance with
// the License. You may obtain a copy of the License at
// http://www.mozilla.org/MPL/
//
// Software distributed under the License is distributed on an "AS IS" basis,
// WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
// for the specific language governing rights and limitations under the
// License.
//
// The Original Code is mozilla.org code.
//
// The Initial Developer of the Original Code is
// the Mozilla Organization.
// Portions created by the Initial Developer are Copyright (C) 1998-2001
// the Initial Developer. All Rights Reserved.
//
// Contributor(s):
//   Robert Kaiser <KaiRo@KaiRo.at>
//   Henrik Lynggaard <admin@mozillatranslator.org>
//
// Alternatively, the contents of this file may be used under the terms of
// either the GNU General Public License Version 2 or later (the "GPL"), or
// the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
// in which case the provisions of the GPL or the LGPL are applicable instead
// of those above. If you wish to allow use of your version of this file only
// under the terms of either the GPL or the LGPL, and not to allow others to
// use your version of this file under the terms of the MPL, indicate your
// decision by deleting the provisions above and replace them with the notice
// and other provisions required by the GPL or the LGPL. If you do not delete
// the provisions above, a recipient may use your version of this file under
// the terms of any one of the MPL, the GPL or the LGPL.
//
// ***** END LICENSE BLOCK *****
// this function verifies disk space in kilobyes
function verifyDiskSpace(dirPath, spaceRequired)
{
    var spaceAvailable;

    // Get the available disk space on the given path
    spaceAvailable = fileGetDiskSpaceAvailable(dirPath);

    // Convert the available disk space into kilobytes
    spaceAvailable = parseInt(spaceAvailable / 1024);
    if(spaceAvailable < spaceRequired)
    {
        logComment("Insufficient disk space: " + dirPath);
        logComment("  required : " + spaceRequired + " K");
        logComment("  available: " + spaceAvailable + " K");
        return(false);
    }
    return(true);
}
// OS type detection
// which platform?
function getPlatform()
{
    var platformStr;
    var platformNode;

    if('platform' in Install)
    {
        platformStr = new String(Install.platform);

        if (!platformStr.search(/^Macintosh/))
            platformNode = 'mac';
        else if (!platformStr.search(/^Win/))
            platformNode = 'win';
        else
            platformNode = 'unix';
    }
    else
    {
        var fOSMac  = getFolder("Mac System");
        var fOSWin  = getFolder("Win System");

        logComment("fOSMac: "  + fOSMac);
        logComment("fOSWin: "  + fOSWin);

        if(fOSMac != null)
            platformNode = 'mac';
        else if(fOSWin != null)
            platformNode = 'win';
        else
            platformNode = 'unix';
    }

    return platformNode;
}
var srDest = 600;
var err;
var fProgram;
var platformNode;
platformNode = getPlatform();
logComment("initInstall: platformNode=" + platformNode);
// --- LOCALIZATION NOTE: translate only these ---
var prettyName ="Dzongkha(BT)";
var langcode = "dz";
var regioncode = "BT";
var chromeNode = langcode + "-" + regioncode;
// --- END LOCALIZABLE RESOURCES ---
var regName    = "locales/mozilla/" + chromeNode;
var chromeName = chromeNode + ".jar";
var regionFile = regioncode + ".jar";
var platformName = langcode + "-" + platformNode + ".jar";
var localeName = "locale/" + chromeNode + "/";
var regionName = "locale/" + regioncode + "/";

err = initInstall(prettyName, regName, "1.7");
logComment("initInstall: " + err);

fProgram = getFolder("Program");
logComment("fProgram: " + fProgram);

if (verifyDiskSpace(fProgram, srDest)) {
    var chromeType = LOCALE;
    var tellRestart = 0;
    if (platformNode == 'unix') {
        // DELAYED_CHROME is still needed on many unix systems for bug 109044; this needs a Mozilla restart!
        logComment("detected a unix system: using DELAYED_CHROME for registerChrome because of bug 109044");
        chromeType |= DELAYED_CHROME;
        tellRestart = 1;
    }
    err = addDirectory("","bin",fProgram,"");
    logComment("addDirectory() returned: " + err);

    if (err != SUCCESS) {
        logComment("addDirectory() to " + fProgram + "failed!");

        if (platformNode != 'unix') {
            // couldn't install globally, try installing to the profile
            // does not work with DELAYED_CHROME !!! (see comment above - bug 109044)
            resetError();
            chromeType |= PROFILE_CHROME;
            fProgram = getFolder("Profile");
            logComment("try installing to the user profile:" + fProgram);
            err = addDirectory("","bin/chrome",fProgram,"chrome");
        }
        else {
            logComment("can't use user profile due to bug 109044");
        }
    }

    setPackageFolder(fProgram);

    // check return value
    if ((err == 0) || (err == 999)) {
        var tellReboot = 0;
        if (err == 999) {
            tellReboot = 1;
            resetError();
        }
        // register chrome
        var cf = getFolder(fProgram, "chrome/"+chromeName);
        var pf = getFolder(fProgram, "chrome/"+platformName);
        var rf = getFolder(fProgram, "chrome/"+regionFile);
registerChrome(chromeType, cf , localeName + "global/");
registerChrome(chromeType, cf , localeName + "necko/");
registerChrome(chromeType, cf , localeName + "communicator/");
registerChrome(chromeType, cf , localeName + "editor/");
registerChrome(chromeType, cf , localeName + "mozldap/");
registerChrome(chromeType, cf , localeName + "pipnss/");
registerChrome(chromeType, cf , localeName + "pippki/");
registerChrome(chromeType, cf , localeName + "navigator/");
registerChrome(chromeType, cf , localeName + "cookie/");
registerChrome(chromeType, cf , localeName + "wallet/");
registerChrome(chromeType, cf , localeName + "content-packs/");
registerChrome(chromeType, cf , localeName + "help/");
registerChrome(chromeType, cf , localeName + "p3p/");
registerChrome(chromeType, cf , localeName + "autoconfig/");
registerChrome(chromeType, cf , localeName + "messenger/");
registerChrome(chromeType, cf , localeName + "messenger-smime/");
if (platformNode == "win") {
registerChrome(chromeType, pf , localeName + "global-platform/");
registerChrome(chromeType, pf , localeName + "navigator-platform/");
registerChrome(chromeType, pf , localeName + "communicator-platform/");
registerChrome(chromeType, pf , localeName + "messenger-mapi/");
}
if (platformNode == "mac") {
registerChrome(chromeType, pf , localeName + "global-platform/");
registerChrome(chromeType, pf , localeName + "navigator-platform/");
registerChrome(chromeType, pf , localeName + "communicator-platform/");
}
if (platformNode == "unix") {
registerChrome(chromeType, pf , localeName + "global-platform/");
registerChrome(chromeType, pf , localeName + "navigator-platform/");
registerChrome(chromeType, pf , localeName + "communicator-platform/");
}
registerChrome(chromeType, rf , regionName + "editor-region/");
registerChrome(chromeType, rf , regionName + "navigator-region/");
registerChrome(chromeType, rf , regionName + "communicator-region/");
registerChrome(chromeType, rf , regionName + "global-region/");
registerChrome(chromeType, rf , regionName + "messenger-region/");
        err = performInstall();
        logComment("performInstall() returned: " + err);
        if (err == 999)
        {
            tellReboot = 1;
            resetError();
        }
        if (err == 0) {
            if (tellReboot == 1) {
                alert("Installation finished. You need to REBOOT your system before you are able to select to use this locale via Edit > Preferences (Category: Appearance > Languages/Content).");
                logComment("REBOOT_NEEDED (999): warning user that he needs to reboot his system.");
            }
            else {
                if (tellRestart == 1) {
                    alert("Installation finished. After a BROWSER RESTART, you should be able to select to use this locale via Edit > Preferences (Category: Appearance > Languages/Content).");
                logComment("we were using DELAYED_CHROME: warning user that he needs to restart Mozilla.");
                }
                else  {
                    alert("Installation finished. You should be able to select to use this locale via Edit > Preferences (Category: Appearance > Languages/Content).");
                }
            }
        }
        else {
            alert("Installation failed. Error code was " + err);
        }
    }
    else {
        cancelInstall(err);
        logComment("cancelInstall due to error: " + err);
        if (err == -202) {
            alert("Installation canceled with error " + err +". It seems you have no write permission to the Mozilla 'chrome' directory. Please install as root / system administrator.");
        }
        else {
            alert("Installation canceled. Error code was " + err);
        }
    }
}
else
cancelInstall(INSUFFICIENT_DISK_SPACE);
