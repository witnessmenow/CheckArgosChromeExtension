function getAllArgosLinks()
{
	if (document.URL.indexOf("argos.ie"))
	{
		console.log("CheckArgos Extension: On Argos page, will do something else in the future");
		//TODO on argos' page, do something else
		return;
	}
	
	if(document.URL.indexOf("checkargos.com"))
	{
		console.log("CheckArgos Extension: On checkargos already!");
		//Cant change links on checkargos, how would users get to argos!
		return;
	}
	
	var linksFound = false;
	var links = document.getElementsByTagName("a");
	for(var i=0; i<links.length; i++) {
		if(links[i].href.indexOf("argos.ie") != -1)
		{
			linksFound = true;
			processArgosLinks(links[i]);
		}
	}
	
	if(linksFound)
	{
		//Cant use chrome.tabs here
		//displayBrowserAction();
	}
}

function displayBrowserAction()
{
	chrome.tabs.getCurrent(function(tab){
		
		chrome.browserAction.setTitle({title : 'Argos links were replaced on this page', tabId: tab.id});
		chrome.browserAction.setIcon({path: 'Logo38.png', tabId: tab.id});
	})
}

function processArgosLinks(linkElement)
{
	//Any links that get here are argos.ie links
	var partNumberRegex = /partNumber\/([0-9]{7})/g;
	var match = partNumberRegex.exec(linkElement.href);
	
	if(match != null && match.length > 1)
	{
		//Got a product number!
		replaceLinkElement(linkElement, generateCheckArgosProductIdLink(match[1]));
		return;
	}
	else
	{
		//no product number in the url
		//unfortunatly doesn't mean its not a valid url!
		//Argos return a product page if you run a search query
		//that only returns one item
		//need to extend checkargos to handle this
		
		var searchTermRegex = /searchTerms=([^&]*)&/g;
		match = searchTermRegex.exec(linkElement.href);
		if(match != null && match.length > 1)
		{
			console.log("CheckArgos currently cant handle this link");
			return;
		}
	}
	
	//If we get here it was an argos link that didnt match anything
	
}

function replaceLinkElement(currentElement, newUrl)
{
	var newLink = document.createElement("a");
	newLink.href = newUrl;
	newLink.innerHTML = currentElement.innerHTML;
	newLink.target = currentElement.target;
	//replace old element with new one
	currentElement.parentNode.replaceChild(newLink, currentElement); 
}

function generateCheckArgosProductIdLink(productId)
{
	return 'http://www.checkargos.com/StockCheckPage.php?productId=' + productId;
}

getAllArgosLinks();