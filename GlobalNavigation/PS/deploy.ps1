$siteUrl="https://dev.sp2019.ezcode.org/sites/HYCHHC-Dev"

Connect-PnPOnline -url $siteUrl -Credentials (Get-Credential)


function ProvisionLists() {
    Write-Host ""
    Write-Host "Provisioning Site Columns, Content Types, & Lists" -ForegroundColor Yellow
    Write-Host "-------------------------------------------------" -ForegroundColor Yellow
    Write-Host "Global Nav List" -ForegroundColor Green
    Apply-PnPProvisioningTemplate ".\GlobalNavList\definition.xml"
    Write-Host "Provisioning done" -ForegroundColor Blue
}

function ConfigureLookupField() {
    Write-Host "Adding Lookup Field" -ForegroundColor Green
    $globalNavList = Get-PnPList -Identity "Lists/GlobalNavList"
    
    if(!$globalNavList) {
        Write-Host "Could not find the list to connect the lookup field. Check that the Global Nav list exists.";
        return;
    }
    else {
        $fieldXml = "<Field ID='{068992B0-C110-411E-A152-4C17E17E43DE}' Name='GlobalNavParent' StaticName='GlobalNavParent' DisplayName='Parent' Group='Global Nav Site Columns' Required='false' Type='Lookup' List='"+ $globalNavList.Id +"' ShowField='Title' Overwrite='TRUE' OverwriteInChildScopes='TRUE' />"
        Add-PnPFieldFromXml -List "Global Nav List" -FieldXml $fieldXml | Out-Null
    }
}

function ExitScript() {
    Write-Host "`n`nPress any key to exit ..."
    $x = $host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    exit 0
}

function TerminatingError($msg) {
    Write-Host "`nError: $msg"
    ExitScript
}

ProvisionLists
ConfigureLookupField
ExitScript