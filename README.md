# Hi-List
An extensible Hi-Framework UI component for data listing - easy pagination, filtering and ordering



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
   <groupId>mz.hi.framework</groupId>
   <artifactId>hi-web</artifactId>
   <version>1.0-beta-SNAPSHOT</version>
</dependency>
```

## Jar
Get the jar file Here

# Using Hi-List
## A simple list
```javascript
<list name="list1" each="row" src="SomeFrontier.methodWithParams()" 
        repeat-element=".myElement">

           <item class="myElement">
                 {{row.attribute}}   
           </item>

</list>
```

## Options

# Extensions

