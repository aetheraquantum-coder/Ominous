Unicode true
!include "MUI2.nsh"
!include "x64.nsh"
Name "Ominous"
OutFile "${OUTPUT}"
InstallDir "$LOCALAPPDATA\Programs\Ominous"
RequestExecutionLevel user
SetCompressor /SOLID lzma
SetCompressorDictSize 64
ShowInstDetails show
ShowUninstDetails show
VIProductVersion "1.0.0.0"
VIAddVersionKey /LANG=1033 "ProductName" "Ominous"
VIAddVersionKey /LANG=1033 "FileDescription" "Ominous per-user installer"
VIAddVersionKey /LANG=1033 "FileVersion" "1.0.0"
VIAddVersionKey /LANG=1033 "ProductVersion" "1.0.0"
VIAddVersionKey /LANG=1033 "LegalCopyright" "Aethera Quantum Technologies"
!define MUI_ICON "${ICON}"
!define MUI_UNICON "${ICON}"
!define MUI_FINISHPAGE_RUN "$INSTDIR\Ominous.exe"
!define MUI_FINISHPAGE_RUN_TEXT "Open Ominous"
!define MUI_FINISHPAGE_TITLE "Your studio is ready."
!define MUI_FINISHPAGE_TEXT "Ominous is installed for your Windows account. Open it from your desktop or Start menu. No developer tools or account are required."
!insertmacro MUI_PAGE_INSTFILES
!insertmacro MUI_PAGE_FINISH
!insertmacro MUI_UNPAGE_CONFIRM
!insertmacro MUI_UNPAGE_INSTFILES
!insertmacro MUI_LANGUAGE "English"
Function .onInit
  SetShellVarContext current
  ${IfNot} ${RunningX64}
    MessageBox MB_OK|MB_ICONSTOP "This installer requires 64-bit Windows." /SD IDOK
    Abort
  ${EndIf}
  FindWindow $0 "Chrome_WidgetWin_1" "Ominous"
  ${If} $0 != 0
    MessageBox MB_OK|MB_ICONINFORMATION "Close Ominous before installing this version." /SD IDOK
    Abort
  ${EndIf}
FunctionEnd
Section "Ominous"
  SetShellVarContext current
  SetOutPath "$INSTDIR"
  File /r "${PAYLOAD}\*"
  WriteUninstaller "$INSTDIR\Uninstall Ominous.exe"
  CreateShortcut "$SMPROGRAMS\Ominous.lnk" "$INSTDIR\Ominous.exe" "" "$INSTDIR\Ominous.exe" 0
  CreateShortcut "$DESKTOP\Ominous.lnk" "$INSTDIR\Ominous.exe" "" "$INSTDIR\Ominous.exe" 0
  WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\Ominous" "DisplayName" "Ominous"
  WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\Ominous" "DisplayVersion" "1.0.0"
  WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\Ominous" "Publisher" "Aethera Quantum Technologies"
  WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\Ominous" "InstallLocation" "$INSTDIR"
  WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\Ominous" "DisplayIcon" "$INSTDIR\Ominous.exe,0"
  WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\Ominous" "UninstallString" '"$INSTDIR\Uninstall Ominous.exe"'
  WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\Ominous" "QuietUninstallString" '"$INSTDIR\Uninstall Ominous.exe" /S'
  WriteRegDWORD HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\Ominous" "NoModify" 1
  WriteRegDWORD HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\Ominous" "NoRepair" 1
  WriteRegDWORD HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\Ominous" "EstimatedSize" ${INSTALLED_KB}
SectionEnd
Function un.onInit
  SetShellVarContext current
  FindWindow $0 "Chrome_WidgetWin_1" "Ominous"
  ${If} $0 != 0
    MessageBox MB_OK|MB_ICONINFORMATION "Close Ominous before uninstalling it." /SD IDOK
    Abort
  ${EndIf}
FunctionEnd
Section "Uninstall"
  SetShellVarContext current
  !include "${UNINSTALL_FILES}"
  Delete "$INSTDIR\Uninstall Ominous.exe"
  RMDir "$INSTDIR"
  Delete "$SMPROGRAMS\Ominous.lnk"
  Delete "$DESKTOP\Ominous.lnk"
  DeleteRegKey HKCU "Software\Microsoft\Windows\CurrentVersion\Uninstall\Ominous"
  ; User drafts in APPDATA are intentionally preserved. Unknown installation files are also retained.
SectionEnd
