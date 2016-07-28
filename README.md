# Hi-List
An extensible Hi-Framework UI component for data listing - easy pagination, filtering and ordering



# Get Hi-List
## Maven
## Jar

# Using Hi-List
## Adding the list
```javascript
<list name="list1" each="row" src="SomeFrontier.methodWithParams()" 
        persist-state="true" preFetch="method1(filter)" delay="400"
        repeat-element=".myElement" postFetch="method2(result)" 
        per-page="24" extensions="extension1 extension2 extension3">

           <item class="myElement">
                 {{row.attribute}}   
           </item>


</list>
```
