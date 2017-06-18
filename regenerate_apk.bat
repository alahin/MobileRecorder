REM Atencion, NO debe tener instalado el plugin crosswalk
REM
del RecognizeVoice.apk
del android-release-unsigned.apk
call ionic cordova build android --release 
copy .\platforms\android\build\outputs\apk\android-release-unsigned.apk .
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore proservice.keystore android-release-unsigned.apk imaginae -storepass imaginae
zipalign -v 4 android-release-unsigned.apk RecognizeVoice.apk
REM
REM Atencion: Se ha generado la version sin crosswalk. Asi que NO deberia tener instalado el plugin.