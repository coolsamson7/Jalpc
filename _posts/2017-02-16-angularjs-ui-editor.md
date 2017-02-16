---
layout: post
title:  "A wisiwyg ui editor in angular 2"
date:   2017-02-16
desc: "A wisiwyg ui editor in angular 2"
keywords: "angular,ui editor,form editor"
categories: [Blog]
tags: [angular,ui editor]
icon: icon-html
---

After having spent the last 3 years with Angular 1.x it was time to explore Angular 2. I picked i use case - a wisiwyg ui editor based on bootstrap - that i already implemented, and rewrote it from scratch with Angular 2.

A project containing core features can be found [here](https://github.com/coolsamson7/ui-editor).

Some impressions on Angular
---

First of all, the move to 2.x war pretty bold, since some major mechanisms - e.g. the change detection, missing $compile, etc.  - have been changed.
As an effect, migration of existing code is pretty time consuming, which will most likely not be reasonable for legacy applications with a significant size.
 
On the other hand, enhancements have been made, that  will allow for better coding and better runtime behavior, like:

* module concept 
* aot compiler
* separation of rendering engine allowing for native rendering

The language itself - typescript - well....Not a big deal. I guess, they missed the opportunity the deliver a real step forward.

Libaries and tooling
---
 
This is still far from acceptable. Even the simplest ui libraries are still evolving - e.g. bootstrap ui or material - leaving programmers with looking up for solutions in the web.

Also build support is not production ready yet. The CLI for example still has errors and is missing major features such as support for libraries or a combination of internal libraries and a main application. 

Hmm...
 