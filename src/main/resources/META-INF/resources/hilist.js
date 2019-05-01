/**
 * Hi list component
 * @author The Hi Framework Team
 */

var hiList =  {};


/**
 * The extensions should override methods of this class.
 */
hiList.baseExtension = function(){


    /**
     * Transform the hiList HTML before it gets compiled.
     * @param html the hiList HTML
     * @param scope the hiList angular scope
     */
    this.$preTransform = function(html,scope){


    };


    /**
     * Notifies the extension before filtering is executed.
     * @param scope the angular scope
     * @param DOM element of the hiList instance
     * @param filter the filter properties
     * @param ordering the data ordering properties
     * */
    this.$beforeFilter = function(scope,element, filter,ordering){



    };

    /**
     *
     * @param scope
     * @param element
     * @param display
     */
    this.$beforeDisplay = function(scope,element,display){



    };

    this.$startup = function(){



    };


};

hiList.extensions = {};
hiList.extend = function(factory){

    var extInstance = new hiList.baseExtension();
    var extension = factory.call({},extInstance);

    if(!(extension.hasOwnProperty("build")&&extension.hasOwnProperty("name")))
        throw new Error("A hiList extension should contains at least the name property and the build function");


    extension.$newInstance = function(){

        //use dependency injection
        if(extension.hasOwnProperty("inject")) {


            var fn =  extension.build;
            fn["$inject"] = extension.inject;

            return angular.injector().invoke(fn);

        }


        //Just call the damm function
        return extension.build.call({});


    };

    hiList.extensions[extension.name] = extension;

};

hiList.getExtension = function(name){

    if(!hiList.extensions.hasOwnProperty(name))
        throw new Error("Extension not encountered : "+name);


    var extension = hiList.extensions[name];

    //There is a single instance if the extension in the entire application
    if(extension.hasOwnProperty("singleton")){

        if(extension.hasOwnProperty("instance")){

            return extension.instance;

        }

        extension.instance = extension.$newInstance();
        extension.instance.$startup();
        hiList[name] = extension;
        return extension.instance;

    }

    //The extension supports multiple instances : one instance per hiList
    var extension = extension.$newInstance();
    extension.$startup();
    return extension;


};


//---Extension sample begins here---
hiList.extend(function(extension){

    return {

        name:"name1",
        singleton:false,
        //inject : ['$compile'],
        build: function(){

            //Override the instance methods here
            extension.$startup = function(html){

                console.log("I'm just a stupid extension");

            };

            extension.transformRepeatable = function($scope,attrs,transformable){

                /*
                 console.log("About to transform the repeatable from extension");
                 console.log(transformable.repeatable);
                 var jqElement = $(transformable.repeatable).append($("<h6>").html("Another {{row.age}}"));
                 transformable.repeatable = jqElement;
                 */

            };

            extension.transformHtml = function($scope,attrs,transformable){

                //console.log("About to transform the HTML from extension");
                //transformable.html = $("<div>").html("<h3>Dummy</h3>");

            };

            extension.preFetch = function($scope, filter){

                //console.log("Pre fetching from extension");

            };

            extension.postFetch = function($scope, result){

                //console.log("Post fetching from extension");

            };


            extension.fetchFail = function($scope, filter, ordering){

                //console.log("Fetch failed from extension");

            };

            extension.fetchFinished = function($scope){

                //Doesn't matter if succeeded or not
                //console.log("Fetch finished");

            };

            extension.invalidResult = function($scope){

                //console.log("Invalid result from extension");

            };

            extension.apiSetup = function($scope, attrs){

                //Add API methods

            };


            return extension;

        }

    };

});
//---Extension sample ends here---*/

hiList.html = {};
hiList.html.header ='<div></div>';

hiList.html.footer =
    '<nav class="col-md-12 col-lg-12 col-sm-12 text-center" ng-show="!$empty&&!$failed&&pagesVisible.length>0">'+
    '<ul class="pagination">'+
    '<li>'+
    '<a  ng-click="goToPreviousPage()" href="javascript:void(0)" aria-label="Previous">'+
    '<span aria-hidden="true"><b translate>Previous</b></span>'+
    '</a>'+
    '</li>'+
    '<li ng-class=\'{"active":activePage==page}\' ng-click="activatePage(page)" ng-repeat="page in pagesVisible"><a href="javascript:void(0)">{{page}}</a></li>'+
    '<li>'+
    '<a ng-click="goToNextPage()" href="javascript:void(0)" aria-label="Next">'+
    '<span aria-hidden="true"><b translate>Next</b></span>'+
    '</a>'+
    '</li>'+
    '</ul>'+
    '</nav>';

hiList.html.empty =
    '<h3>The list is empty for now</h3>';

hiList.html.fail =
    '<h4>The list request failed</h4>';

hiList.html.delaying =
    '<h5>The server is delaying</h5>';

hiList.utils = {};
hiList.utils.getFrontierAction = function(url){
    var dotIndex = url.indexOf('.');
    if(dotIndex==-1)
        return undefined;
    var controller = url.substr(0,dotIndex);
    var action = url.substr(dotIndex+1,url.length);

    try {

        var functionResolved = eval(controller + "." + action);
        if(typeof functionResolved !="function")
            return false;
        return functionResolved;

    }catch(err){

        return false;

    }


};

hiList.utils.generatePagesSequence = function(total){

    var array = [];
    var val = 1;

    while(val<=total){

        array.push(val);
        val++;

    }

    return array;

};

hiList.directive = function($compile,$parse){

    var directive = {};
    directive.restrict='E';
    directive.scope = true;
    directive.link = function($scope,element,attributes) {

        $scope.autoload = true;
        $scope.maxItemsOptions=[25,50,150,200];
        $scope.show ={maxItems:25};
        $scope.activePage = 1;
        $scope.ordering = {empty:true};

        $scope.activePageIndex = 0;
        $scope.maxVisiblePages = 6;
        $scope.pages = [];
        $scope.pagesVisible = [];


        $scope.activatePage = function(page){

            $scope.activePage = page;
            //here
            var pNumber = $scope.activePage;
            if(pNumber>1){
                var pageIndex = $scope.pagesVisible.indexOf(pNumber);
                if(pageIndex==-1){
                    //Page is not visible
                    $scope.$pages.notVisible(pNumber);
                }else {
                    //Page is visible
                    //Apply the pages shift effect
                    var lastVisiblePageIndex = $scope.pagesVisible.indexOf($scope.pagesVisible[$scope.pagesVisible.length - 1]);
                    var lastVisiblePageGlobalIndex = $scope.pages.indexOf($scope.pagesVisible[$scope.pagesVisible.length - 1]);
                    var firstVisiblePageGlobalIndex = $scope.pages.indexOf($scope.pagesVisible[0]);
                    var lastGlobalPageIndex = $scope.pages.length - 1;
                    var middleIndex = lastVisiblePageIndex / 2;
                    if (pageIndex > middleIndex) {
                        //Scroll left
                        $scope.$pages.left(pageIndex, lastVisiblePageIndex, lastGlobalPageIndex, lastVisiblePageGlobalIndex);
                    } else if (pageIndex < middleIndex) {
                        //Scroll right
                        $scope.$pages.right(pageIndex, lastVisiblePageIndex, firstVisiblePageGlobalIndex);
                    } else {

                        //Dont move

                    }

                }

            }//-end here

            $scope.$doFilter(page);

        };


        $scope.$hide = {};
        $scope.$show = {};
        $scope.show.maxItemsOptions = true;

        $scope.$elements = {};

        $scope.$failed = false;
        $scope.$empty = false;
        $scope.$delaying = false;

        $scope.$filterInProgress = false;

        $scope.$pages = {};
        $scope.callExtensions = function(method,params){
            for(var extensionName in $scope.$extensions){
                var extension = $scope.$extensions[extensionName];
                if(typeof extension!="object")
                    continue;
                if(extension.hasOwnProperty(method)){
                    extension[method].apply(extension,params)
                }
            }
        };

        $scope.$pages.createPagesList = function(totalPages){
            //Generate the pages list
            $scope.pages = hiList.utils.generatePagesSequence(totalPages);
            var pageCount = 0;
            var visiblePages = [];
            $scope.pages.forEach(function(item,index){
                if(pageCount==$scope.maxVisiblePages)
                    return;
                visiblePages.push(item);
                pageCount++;
            });
            $scope.pagesVisible = visiblePages;
            $scope.activePage = 1;
        };
        $scope.$pages.right = function(pageIndex, lastVisiblePageIndex, firstVisiblePageGlobalIndex){

            //Move to right

            if (pageIndex == lastVisiblePageIndex) {

                //TODO: Move right completely

            }

            var previousPageIndex = firstVisiblePageGlobalIndex - 1;

            if (firstVisiblePageGlobalIndex == 0) {

                //First page already visible. Don't move

            }else{


                if (firstVisiblePageGlobalIndex != 0) {

                    var previousPage = $scope.pages[previousPageIndex];

                    var newVisiblePages = angular.copy($scope.pagesVisible);
                    newVisiblePages.splice(newVisiblePages.length-1, 1);
                    newVisiblePages.unshift(previousPage);
                    $scope.pagesVisible = newVisiblePages;

                }

            }




        };
        $scope.$pages.left = function(pageIndex, lastVisiblePageIndex, lastGlobalPageIndex, lastVisiblePageGlobalIndex){

            //Move to left
            if (pageIndex == lastVisiblePageIndex) {

                //TODO: Move left completely

            }

            var nextPageIndex = lastVisiblePageGlobalIndex + 1;

            if (lastGlobalPageIndex == lastVisiblePageGlobalIndex) {

                //Last page already visible. Don't move

            }else{

                if (lastVisiblePageGlobalIndex != lastGlobalPageIndex) {

                    var nextPage = $scope.pages[nextPageIndex];

                    var newVisiblePages = angular.copy($scope.pagesVisible);
                    newVisiblePages.splice(0, 1);
                    newVisiblePages.push(nextPage);
                    $scope.pagesVisible = newVisiblePages;

                }

            }



        };

        $scope.$pages.notVisible = function(number){

            var startIndex = 0;
            var direction = 1;
            var reverse = false;


            var pageIndex = $scope.pages.indexOf(number);
            var lastPageIndex = $scope.pages.length-1;
            var maxTotalPages = $scope.maxVisiblePages;

            if(pageIndex==0){

                //First page : find the pages on its right
                startIndex = pageIndex;
                direction = 1;

            }else{

                if(pageIndex==lastPageIndex){

                    //Last page : find the pages on its left
                    startIndex = pageIndex;
                    direction = 0;
                    reverse = true;

                }else{

                    //A page in the middle

                    //Pattern 1 : one page from the right and other from left
                    if($scope.pages.indexOf(lastPageIndex)==-1){

                        startIndex = pageIndex+1;
                        direction = 0;
                        reverse = true;

                    }else{

                        //Pattern 2 : one page from the left and others from the right
                        startIndex = pageIndex-1;
                        direction = 1;

                    }

                }

            }


            var totalPages = 0;
            var thePages = [];
            var currentPageIndex = startIndex;

            while(totalPages<maxTotalPages){

                if(currentPageIndex>lastPageIndex||currentPageIndex<0)
                    break;

                thePages.push($scope.pages[currentPageIndex]);

                if(direction>0)
                    currentPageIndex++;
                else
                    currentPageIndex--;

                totalPages++;
            }

            if(reverse)
                thePages.reverse();

            $scope.pagesVisible = thePages;
            $scope.$applyAsync();

        };

        $scope.$processResult = function(result){

            if(typeof result!="object") {

                $scope.pagesVisible = [];//No visible pages
                //Warn all the extensions
                $scope.callExtensions("invalidResult",[$scope]);
                console.error("Invalid result returned by " + $scope.$attributes.name + " data source");
                return

            }


            if(!(result.hasOwnProperty("data")
                &&result.hasOwnProperty("totalRowsMatch")
                &&result.hasOwnProperty("pageNumber")
                &&result.hasOwnProperty("totalPagesMatch"))){

                $scope.pagesVisible = [];//No visible pages

                //Warn all the extensions
                $scope.callExtensions("invalidResult",[$scope]);
                console.error("Invalid result returned by "+$scope.$attributes.name+" data source");
                return;

            }


            if(result.data.length==0||result.totalPagesMatch==0){

                //No result returned
                $scope.$empty = true;
                $scope.pagesVisible = [];
                $scope.rows = [];

            }else{

                $scope.$empty = false;

            }

            //Tell the extension that rows were received
            if($scope.$handlers.postFetch)
                $scope.$handlers.postFetch($scope,{result:result});
            $scope.callExtensions("postFetch",[$scope,result]);

            $scope.rows = result.data;
            $scope.previousPage = $scope.activePage;
            $scope.activePage = result.pageNumber;
            $scope.totalPages = result.totalPagesMatch;
            $scope.totalRowsMatch = result.totalRowsMatch;

            var pNumber = $scope.activePage;
            $scope.$pages.createPagesList(result.totalPagesMatch);
            $scope.activePage = pNumber;

        };


        $scope.$delay = 300;
        $scope.$delayTimeout = false;

        //Filter data and update the list
        $scope.$doFilter = function(p){

            if($scope.$delayTimeout)
                clearTimeout($scope.$delayTimeout);

            $scope.$delayTimeout = setTimeout(function(){
                $scope.$delaying = true;
                $scope.$applyAsync();
            },$scope.$delay);

            $scope.$failed = false;

            if(typeof $scope.$ds!="function"){

                console.error("Cant proceed with filtering : invalid list data-source");

            }

            if(!$scope.$filterInProgress){

                $scope.$filterInProgress = true;

            }

            var page = $scope.activePage;

            if(typeof p!="undefined")
                page = p;

            var itemsPerPage = $scope.show.maxItems;

            var ordering = $scope.ordering;

            //Tell the status handler and all extensions that the filtering is about to start
            if($scope.$handlers.preFetch)
                $scope.$handlers.preFetch($scope,{filter:$scope.filter});
            $scope.callExtensions("preFetch",[$scope,$scope.filter]);

            $scope.$ds.call({},page,itemsPerPage,$scope.filter,ordering)

                .try(function(result){

                    $scope.$processResult(result);
                    $scope.activePage = page;
                    if($scope.ready)
                        $scope.publishStatus();

                }).catch(function(err){

                    if(err==452)//Call interrupted
                        return;

                    if($scope.$handlers.onFail)
                        $scope.$handlers.onFail($scope, {err: err});

                    //Tell the extensions that the fetch failed
                    $scope.callExtensions("fetchFail",[$scope]);
                    $scope.pagesVisible = [];//No visible pages
                    $scope.$failed = true;
                    $scope.rows=[];
                    console.error("Datasource frontier request failed for [" + $scope.$attributes.name + "] List.");
                    console.error(err);


            }).finally(function(){


                $scope.callExtensions("fetchFinished",[$scope]);
                $scope.$delaying = false;
                clearTimeout($scope.$delayTimeout);

                if($scope.$filterInProgress){

                    $scope.$filterInProgress = false

                }

                $scope.$applyAsync(function(){

                    setTimeout(function(){

                        if(!$scope.ready){
                            if(typeof $scope.$readinessCallback !="undefined")
                                $scope.$readinessCallback.apply();
                            $scope.ready = true;
                        }

                    },50);

                });


            });


        };


        //The public method

        $scope.refresh = function(samePage){
            if(samePage)
                return $scope.activatePage($scope.activePage);

            return $scope.activatePage(1);

        };

        $scope.goToPage = function(number){


            var pageIndex = $scope.pages.indexOf(number);

            //Page is unknown
            if(pageIndex==-1) {

                throw new Error("Invalid page number : " + number + ".");
            }

            $scope.activatePage(number);

        };

        $scope.goToLastPage = function() {

            if($scope.pages.length==0)
                return;

            this.goToPage($scope.pages[$scope.pages.length-1]);

        };

        $scope.goToFirstPage = function(){

            if($scope.pages.length>0){

                $scope.goToPage($scope.pages[0]);

            }

        };

        $scope.getCurrentPage = function(){

            return $scope.activePage;

        };

        $scope.goToNextPage = function(){

            var nextPage = $scope.activePage+1;
            if($scope.pages.indexOf(nextPage)==-1)
                return;

            $scope.goToPage(nextPage);

        };

        $scope.goToPreviousPage = function(){

            var previousPage = $scope.activePage-1;
            if($scope.pages.indexOf(previousPage)==-1)
                return;

            $scope.goToPage(previousPage);

        };


        //Extension instances for this particular List
        $scope.$extensions = {};
        $scope.$extensionList = [];

        $scope.$bootExtensions = function(){

            //Load the extensions for this hiList instance
            //var activatedExtensions = Hi.$util.getKidProperties('plug',attributes['$attr']);
            var activatedExtensions = [];
            if(attributes.hasOwnProperty("extensions")){

                var extensionsText = attributes["extensions"];
                activatedExtensions = extensionsText.split(" ");

            }

            if(activatedExtensions.length>0){

                $scope.$extensionList = activatedExtensions;

                for(var index in activatedExtensions){

                    var item = activatedExtensions[index];
                    if(typeof item=="string"){

                        var extension  = hiList.getExtension(item);
                        $scope.$extensions[item] = extension;

                    }

                }

            }

        };



        $scope.$bootExtensions();

        //Name
        if(!attributes.hasOwnProperty("name"))
            throw new Error("The list element should have a <name> attribute");

        //Repeatale
        if(!attributes.hasOwnProperty("repeatElement"))
            throw new Error("The list element should have a <repeat-element> attribute that specifies the element that should be repeated.");


        //Item name
        if(!attributes.hasOwnProperty("each"))
            throw new Error("The list element should have a <item> attribute that specifies the name to repeat");

        //Data source
        if(!attributes.hasOwnProperty("src"))
            throw new Error("The list element should have a <src> attribute that specifies the data source.");



        //Items per page
        if(attributes.hasOwnProperty("perPage")){

            var itemsPerPage = parseInt(attributes.perPage);
            if(!isNaN(itemsPerPage)){

                if(itemsPerPage<=1){

                    throw new Error("Invalid max items per page. Should be higher than 1");

                }

                if($scope.maxItemsOptions.indexOf(itemsPerPage)==-1) {

                    //Add the option at the beginning of the list
                    $scope.maxItemsOptions.unshift(itemsPerPage);

                }

                $scope.show.maxItems = itemsPerPage;

            }

        }

        var dataSource = attributes.src;
        var frontierMethod = hiList.utils.getFrontierAction(dataSource);
        if(typeof frontierMethod=="undefined")
            throw new Error("Invalid list data source value format : "+dataSource);
        else{

            if(!frontierMethod){

                throw new Error("Data source could not be found. Make sure it was properly created and is available : "+dataSource);

            }

        }

        //Set the data source function
        $scope.$ds = frontierMethod;

        var eachItem = attributes.each;
        var scopeParent = $scope.$parent;
        var listName = attributes.name;
        var listRepeatElement = attributes["repeatElement"];


        var jqRepeatable = element.find(listRepeatElement);

        if(jqRepeatable.length==0)
            throw new Error("Repeatable element could not be found using the specifiend jQuery selector : "+listRepeatElement);



        if(scopeParent.hasOwnProperty(listName))
            console.warn("The list name <"+listName+"> is already in use on its parent scope");


        //The attributes of the element
        $scope.$attributes = attributes;



        if(attributes.hasOwnProperty("delay")){

            var delayValue = attributes["delay"];

            try{

                $scope.$delay = parseInt(delayValue);

            }catch(err){

                throw new Error("Invalid delay detect time : "+delayValue);

            }

        }


        $scope.publishStatus = function(){

            if(typeof $scope.$listWatcher == "undefined")
                return;

            var listStatus = {};
            listStatus.page = $scope.activePage;
            listStatus.filter = $scope.filter;
            listStatus.pageSize = $scope.show.maxItems;
            $scope.$listWatcher($scope,{status:listStatus});

        };


        $scope.filter = {};
        $scope.$handlers = {};
        $scope.$listWatcher = undefined;
        $scope.$listInitializer = undefined;
        $scope.$readinessCallback = undefined;

        $scope.$initialize = function(){

            if(typeof $scope.$listInitializer=="undefined"){
                $scope.$doFilter(1);
                return;
            }

            var init = {page:1,pageSize:$scope.show.maxItems,filter:$scope.filter};
            init.ready = function(callback){
                if(typeof callback!="function")
                    throw new Error("ready callback must be a function");
                $scope.$readinessCallback = callback;
            };

            $scope.$listInitializer($scope,{context:init});
            $scope.show.maxItems = init.pageSize;
            $scope.filter = init.filter;
            $scope.$doFilter(init.page);

        };

        if(attributes.hasOwnProperty("watcher")){
            var watcherName = attributes["watcher"];
            $scope.$listWatcher = $parse(watcherName);
        }


        if(attributes.hasOwnProperty("transformer")){
            var transformerName = attributes["transformer"];
            $scope.$listTransformer = $parse(transformerName);
        }

        if(attributes.hasOwnProperty("initializer")){
            var initializerName = attributes["initializer"];
            $scope.$listInitializer = $parse(initializerName);
        }

        if(attributes.hasOwnProperty("prefetch")){
            var prefetchName = attributes["prefetch"];
            $scope.$handlers.preFetch = $parse(prefetchName);
        }

        if(attributes.hasOwnProperty("onfail")){
            var failName = attributes["onfail"];
            var parsed = $parse(failName);
            $scope.$handlers.onFail = parsed;
        }

        if(attributes.hasOwnProperty("postfetch")){
            var pfetchFname = attributes["postfetch"];
            var parsed = $parse(pfetchFname);
            $scope.$handlers.postFetch = parsed;
        }

        if(attributes.hasOwnProperty("autoload")){
            var autoload = JSON.parse(attributes["autoload"]);
            $scope.$autoload = autoload;
            console.log("autoload = ")
        }

        console.log("autoload = "+$scope.$autoload)

        //Tell extensions to transform the repeatable item
        var transformable = {repeatable: jqRepeatable};
        $scope.callExtensions("transformRepeatable",[$scope,attributes,transformable]);
        jqRepeatable = transformable.repeatable;

        //Add the ng-repeat
        jqRepeatable.attr("ng-repeat",eachItem+" in rows");

        var header = $("<header>").addClass("row hilist-header").html(hiList.html.header);
        $(element).prepend(header);

        if(!attributes.hasOwnProperty("noFooter")){
           var footer = $("<footer>").addClass("row hilist-footer").html(hiList.html.footer);
           $(element).append(footer);
        }

        var html = $(element).html();

        if(typeof $scope.$listTransformer !="undefined"){
            var arg = {element:html};
            html = $scope.$listTransformer($scope,arg);
        }



        //Call plugins to transform the markup
        transformable = {html:html};
        $scope.callExtensions("transformHtml",[$scope,attributes,transformable]);
        html = transformable.html;


        var angularElement = angular.element(html);

        var compile = $compile(angularElement,function(){

        });


        $scope.load = function(){
            element.html(angularElement);
            $scope.$initialize();
        }


        $scope.callExtensions("apiSetup",[$scope,attributes]);

        //Add the scope object to the its parent
        scopeParent[listName] = $scope;
        compile($scope);
    };

    directive["$inject"] = ["$scope","element","attributes"];
    return directive;

};

hiList.directive["$inject"] = ["$compile","$parse"];
Hi.$ui.js.component("list",hiList.directive);