# spollm-web-bot

## Summary

A sample to demonstrate how to implement [Retrieval Augmented Generation (RAG) in Azure AI Search](https://learn.microsoft.com/en-us/azure/search/retrieval-augmented-generation-overview) with [Azure OpenAI On Your Data](https://learn.microsoft.com/en-us/azure/ai-services/openai/references/on-your-data?tabs=python). This sample requires to setup a Azure AI search to index content from a SPO site collection document library. 

## Features: 

## Configuration debug steps
when run the code from developer machine, you can run ```gulp serve``` to check out the result from a registered site collection. Please also update config\serve.json file to include the following values: 
```JSON
            "customActions": {
                "96093d6d-e83a-4991-a0ba-c465d9cf71ea": {
                    "location": "ClientSideExtension.ApplicationCustomizer",
                    "properties": {
                        "spoSiteUrl": "[spo-sitecollection]",
                        "spoDocLib": "[spo-documentlibrary]",
                        "enabled": true,
                        "selectedDocuments": [
                            "Power Platform product licensing FAQ.docx"
                        ],
                        "aiServiceKey": "[azure-openai-key]",
                        "aiServiceUrl": "[azure-openai-url]",
                        "aiSearchUrl": "[ai-search-url]",
                        "aiSearchIndex": "[ai-search-index]",
                        "aiSearchConfig": "[ai-search-config]",
                        "aiSearchKey": "[ai-search-key]"
                    }
                }
            }
```

## publish
SPFx application customizer relied on SPO feature to deliver. please update ```sharepoint\assets\elements.xml``` and ```sharepoint\assets\ClientSideInstance.xml```

```XML
<?xml version="1.0" encoding="utf-8"?>
<Elements xmlns="http://schemas.microsoft.com/sharepoint/">
    <ClientSideComponentInstance
        Title="SpollmWebBot"
        Location="ClientSideExtension.ApplicationCustomizer"
        ComponentId="96093d6d-e83a-4991-a0ba-c465d9cf71ea"
        Properties="{&quot;spoSiteUrl&quot;: &quot;[spo-sitecollection]&quot;,&quot;spoDocLib&quot;: &quot;[spo-documentlibrary]&quot;,&quot;enabled&quot;: true,&quot;selectedDocuments&quot;: [&quot;Power Platform product licensing FAQ.docx&quot;],&quot;aiServiceKey&quot;: &quot;[azure-openai-key]&quot;,&quot;aiServiceUrl&quot;: &quot;[azure-openai-url]&quot;,&quot;aiSearchUrl&quot;: &quot;[ai-search-url]&quot;,&quot;aiSearchIndex&quot;: &quot;[ai-search-index]&quot;,&quot;aiSearchConfig&quot;: &quot;[ai-search-config]&quot;,&quot;aiSearchKey&quot;: &quot;[ai-search-key]&quot;}">
    </ClientSideComponentInstance>
</Elements>
```

## Reference
* [Retrieval Augmented Generation (RAG) in Azure AI Search](https://learn.microsoft.com/en-us/azure/search/retrieval-augmented-generation-overview)
* [Azure OpenAI On Your Data](https://learn.microsoft.com/en-us/azure/ai-services/openai/references/on-your-data?tabs=python)

## Version history

| Version | Date             | Comments        |
| ------- | ---------------- | --------------- |
| 1.1     | March 10, 2021   | Update comment  |
| 1.0     | January 29, 2021 | Initial release |

## Used SharePoint Framework Version

![version](https://img.shields.io/badge/version-1.19.0-green.svg)

## Disclaimer

**THIS CODE IS PROVIDED _AS IS_ WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING ANY IMPLIED WARRANTIES OF FITNESS FOR A PARTICULAR PURPOSE, MERCHANTABILITY, OR NON-INFRINGEMENT.**

---

