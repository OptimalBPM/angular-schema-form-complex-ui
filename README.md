
Complex UI add-on
=================
### About

This is an Angular-Schema-Form UI add-on that provides a way to implement advanced user interfaces for a properties.
For example, some properties are actually not simple strings, but settings structures and need more customization that
what is readily implemented in ASF.

# Features

## Modal mode
In Modal mode, a modal is displayed instead of displaying the UI in the form. 
This is enabled by setting "options.modal" to true.

## Normal mode
The UI is displayed in the form as it where part of the 

It it is dependent on `bootstrap/js/modal.js` being loaded. 

## Custom UI
If options.includeURI is set, the system will load the HTML it points to.

## Nested Angular-Schema-Form
If no

### Installation
To use the example, enter the examples/camelcase folder and run
    
    sudo npm install bower
    node_modules/bower/bin/bower install
    
This will first locally install bower, and then used that bower to install the project dependencies. 


### Running

You should now be able to open the example.html in the browser.


### Building

First, install all build tools, in the examples/camelcase folder, run

    sudo npm install


The cycle for development is change and then build. 
If you want to make any changes, you should make them in the /src-files and then build, otherwise your changes
will not be included in the example. 

From the installation, gulp should be installed, so therefore, in the examples/camelcase folder, just run: 
   
    gulp default
   
This starts a build and generates examples/basic/angular-schema-form-camelcase.js and examples/basic/angular-schema-form-camelcase.min.js.
To observe your changes, just refresh the example.html-page.