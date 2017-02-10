---
layout: post
title:  "Lets get ready"
date:   2017-01-31
desc: "Lets get ready"
keywords: "blog,stuff"
categories: [Blog]
tags: [Stuff]
icon: icon-html
---

Cool stuff!

{% highlight swift %}
import {Injectable} from "@angular/core";
import {Http, Response} from "@angular/http";
import {Observable} from "rxjs";

@Injectable()
export class AuthenticationService {
    // constructor
    
    constructor(private http : Http) {
    }

    // private

    private buildParameters(parameters) : string {
        var attribute;

        var attributeSuffix = '';
        var first = true;

        for (attribute in parameters) {
            if (parameters.hasOwnProperty(attribute) && parameters[attribute] !== undefined && parameters[attribute] !== null) {
                if (first) {
                    attributeSuffix += ('?' + attribute + '=' + parameters[attribute]);

                    first = false;
                }
                else {
                    attributeSuffix += ('&' + attribute + '=' + parameters[attribute]);
                }
            }
        } // for

        return attributeSuffix;
    };

    // public methods

    public logout() : Observable<Response> {
        let contextPath = '/portal'; // ??

        return this.http.post(contextPath + '/logout', '');
    }

    public login(user : string, password : string) : Observable<Response> {
        let contextPath = '/portal';

        return this.http.post(contextPath + '/authenticate' + this.buildParameters({username: user, password: password, rememberme: false}), '');
    }
}
{% endhighlight %}

{% highlight typescript %}
class Foo {
}
{% endhighlight %}

