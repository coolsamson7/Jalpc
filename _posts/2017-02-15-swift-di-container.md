---
layout: post
title:  "A dependency injection container in swift"
date:   2017-02-15
desc: "A dependency injection container in swift"
keywords: "swift,dependency injection"
categories: [Blog]
tags: [swift,dependency injection]
icon: icon-html
---

As i started to look at swift, i needed some project to start with, so i picked to implement a dependency 
injection container. 
* the topic makes sense since i did not find ready to use code with the quality and completeness i would expect.
* the internals are interesting - e.g. the dependency resolution - and promise some fun :-)
* i was always wondering, why the spring solution looks so damn complex.

So, after two weeks the final result was more or less done and can be found [here](https://github.com/coolsamson7/inject).

The following core features have been implemented

* specification of beans via a fluent interface or xml
* full dependency management including cycle detection
* all definitions are checked for type safeness
* integrated management of configuration values
* injections resembling the spring `@Inject autowiring mechanism
* support for different scopes including singleton and protoype as builtin flavors
* support for lazy initialized beans
* support for bean templates
* lifecycle methods ( e.g. `postConstruct`)
* `BeanPostProcessor`'s
* `FactoryBean`'s
* support for hierarchical containers, that inherit beans ( and post processors )
* support for placeholder resolution ( e.g. `${property=<default>}` ) in xml
* support for custom namespace handlers in xml
* automatic type conversions and number coercions in xml

To get a quick impression, what you can do with it, here is some sample code:

{% highlight swift %}
let environment = try! Environment(name: "my first environment")

try! environment
   // a bar created by the default constructor

   .define(environment.bean(Bar.self, factory: Bar.init))

   // a foo that depends on bar

   .define(environment.bean(Foo.self, factory: {
            return Foo(bar: try! environment.getBean(Bar.self))
        }).requires(class: Bar.self))

   // get goin'

   .startup();
   
let foo = environment.getBean(Foo.self)
{% endhighlight %}

While this approach relies on closure functions, it is also possible to make use of reflection, setting specific properties individually.

{% highlight swift %}
try! environment
   .define(environment.bean(Foo.self)
      .property("name", value: "foo")
      .property("number", value: 7))

   // get goin'

   .startup();
{% endhighlight %}

This feels more like the Spring approach in java but suffers from the lack of reflection features in swift (e.g. classes must inherit from `NSObject`, ...).


Some thoughts on the swift programming language.
----

Is swift fast as always spread? No, why should it? The compiler team has trouble getting close to ObjectiveC speed, so this is clearly a myth.

Is it pretty?
---

I liked it since through type inference and syntactical sugar ( no need for `;`) it is pretty compact. On the other hand it does not provide any features that havn't been around for years.

Missing features
---
At least in the version i worked with, a number of features as found for example in Java are either completely missing or only implemented rudimentary.
* dynamic proxies are _not_ available at all. Major components such as a service framework cannot be implemented.
* reflection is only possible with major restrictions (e.g. `NSObject` base class).
* a complete typesystem that let's you introspect types is missing. Some of it can be done manually but usually relies on already instanciated object instead of the class reference.