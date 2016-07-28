# Hi-List
An extensible Hi-Framework UI component for data listing - easy pagination, filtering and ordering

## Why use Hi-List?
* Extensible
* Configurable
* Uses bootstrap components
* Add and use


# Getting the Hi-List component
## Maven
### The repository
```xml
<repository>
   <id>talk-code</id>
   <name>maven-repo</name>
   <url>https://github.com/talk-code/maven-repo/raw/master</url>
</repository>
```
### The dependency
```xml
<dependency>
   <groupId>mz.talkcode.components</groupId>
   <artifactId>HiList</artifactId>
   <version>1.0-SNAPSHOT</version>
</dependency>
```

## Jar
Get the jar file Here

# Using Hi-List
## A simple list
```javascript
<list name="list1" each="row" src="SomeFrontier.methodName" 
        repeat-element=".myElement">

           <item class="myElement">
                 {{row.attribute}}   
           </item>

</list>
```

### Examplaining the attributes
#### name
This is a mandatory attribute. It defines the name of your list instance and you can use such name
to access the list public API from your view. Checkout the following example:

```javascript
//some code here
  $scope.list1.publicMethod(params);
//some code here
```

#### each
Defines the variable name that is used within the repeatable element to access the row's attributes.

#### src 
Defines the frontier method that should be used as data source.

#### repeat-element
Defines the element that should be repeated for each row. Receives a jquery selector.

### The Frontier method
A valid frontier method to be used as a list data source should receive 4 arguments: the desired page, the maximum items per page, the filter details and the ordering settings. 

```java

@Frontier
@ApplicationScoped
public class SomeFrontier{

    public Map methodName(int pageNumber, int itemsPerPage, Map filter, Map ordering){
          
          int totalMatchedPages;
          Object[] rows;
          int totalMachedRows;
          
          //Consult your database here and set the variables above
          return HiList.listEncode(rows, totalMachedRows, pageNumber, totalMatchedPages)
    
    }

}
```

## Options

## The public API

### refresh();
### goToPage(number);
### goToLastPage();
### gotToFirstPage();
### getCurrentPage();
### getTotalPages();
### goToNextPage();
### goToPreviousPage();

# Extensions
## Enabling an extension
## Creating your own extension

