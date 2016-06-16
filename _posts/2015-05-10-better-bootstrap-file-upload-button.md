---
id: 2725
title: Better Bootstrap File Upload Button
date: 2015-05-10T16:06:31+00:00
author: n8henrie
excerpt: "Here's how to make an attractive file upload button for Bootstrap."
layout: post
guid: http://n8henrie.com/?p=2725
permalink: /2015/05/better-bootstrap-file-upload-button/
yourls_shorturl:
  - http://n8henrie.com/n8urls/6x
dsq_thread_id:
  - 3752897026
---
**Bottom Line:** Here&#8217;s how to make an attractive file upload button for Bootstrap.<!--more-->

I put a lot of work into the new version of icsConverterWebapp. Here&#8217;s how my file upload buttons turned out:


![My Bootstrap file upload button](http://n8henrie.com/wp-content/uploads/2015/05/20150510_20150510-ScreenShot-479.jpg) 

[See it live.](http://icw.n8henrie.com)

I&#8217;ve been learning to use <a href="http://getbootstrap.com/" target="_blank">Bootstrap</a> for a few <a href="http://flask.pocoo.org/" target="_blank">Flask</a> projects I&#8217;ve been working on lately. I was surprised to see that the <a href="http://getbootstrap.com/css/#forms" target="_blank">default Bootstrap file upload buttons</a> are _pretty ugly_: 


![Default Bootstrap file upload button](http://n8henrie.com/wp-content/uploads/2015/05/20150510_20150510-ScreenShot-480.jpg) 

To cut to the chase, I did **tons** of Googling, and this is the most satisfying solution I came up with. It is a combination of <a href="http://www.abeautifulsite.net/whipping-file-inputs-into-shape-with-bootstrap-3" target="_blank">this popular solution</a> by Cory LaViska, and <a href="http://stackoverflow.com/a/25053973/1588795" target="_blank">this stackoverflow answer</a> by Kirill Fuchs.

Further, I&#8217;m using Flask with <a href="https://github.com/wtforms/wtforms" target="_blank">wtforms</a>, <a href="https://flask-wtf.readthedocs.org/" target="_blank">Flask-wtf</a>, and <a href="http://pythonhosted.org/Flask-Bootstrap/" target="_blank" title="Flask-Bootstrap — Flask-Bootstrap 3.3.4.1 documentation">Flask-bootstrap</a>, so my solution uses code from all of these. If you&#8217;re not using these, skip to the bottom for a HTML and JS solution, and a link to a demo.

The basic idea is this:

  1. Use a basic file input element in a WTF form (the input element is ugly: ).
  2. Add a pretty Bootstrap `label` (basically a clickable descriptive item for a button) as an `input-group-addon` to the input.
  3. Hide the input, leaving only the pretty label.
  4. Add a place to display the uploaded filename for user feedback.
  5. Use some javascript to display the filename once uploaded (for user feedback).
  6. Add just a touch of CSS.

## #1 &#8211; 4

Relevant part of `index.html` (a Jinja2 template)

    {% block content %}
    <div class="row">
        <form class="form-inline center-block" action="/" method="POST" enctype="multipart/form-data">
            {{ form.hidden_tag() }}
            <div class="input-group">
                <label id="browsebutton" class="btn btn-default input-group-addon" for="my-file-selector">
                    {{ form.input_file(id="my-file-selector") }}
                    Browse...
                </label>
                <input type="text" class="form-control" readonly>
            </div>
            {{ form.submit(class_="btn btn-primary") }}         
        </form>
    </div>
    {% endblock %}
    {% block scripts %}
    {{ super() }}
    <script src="{{ url_for('.static', filename='js/inputFileButton.js') }}" ></script>
    {% endblock %}
    

Note that the pretty label is `for` the ID of the (ugly) input button.

Relevant part of `views.py`: 

<pre><code class="python">from forms import UploadForm
from flask import request


@app.route('/', methods=['GET', 'POST'])
def index():
    form = UploadForm()
        if request.method == 'POST' and form.validate_on_submit():
            input_file = request.files['input_file']
            # Do stuff
        else:
            return render_template('index.html', form=form)
</code></pre>

Not a whole lot of surprises here, a `GET` request returns the form, a `POST` to the same URL gets the uploaded file for processing.

`forms.py`:

<pre><code class="python">from flask_wtf import Form
from flask_wtf.file import FileField, FileAllowed, FileRequired
from wtforms import SubmitField


class UploadForm(Form):

    validators = [
        FileRequired(message='There was no file!'),
        FileAllowed(['txt'], message='Must be a txt file!')
    ]

    input_file = FileField('', validators=validators)
    submit = SubmitField(label="Upload")
</code></pre>

## #5

And `inputFileButton.js` (taken directly from Cory LaViska at the link above):

<pre><code class="javascript">$(document).on('change', '#browsebutton :file', function() {
  var input = $(this),
      numFiles = input.get(0).files ? input.get(0).files.length : 1,
      label = input.val().replace(/\\/g, '/').replace(/.*\//, '');
  input.trigger('fileselect', [numFiles, label]);
});

$(document).ready( function() {
    $('#browsebutton :file').on('fileselect', function(event, numFiles, label) {
        var input = $(this).parents('.input-group').find(':text'),
            log = numFiles &gt; 1 ? numFiles + ' files selected' : label;

        if( input.length ) {
            input.val(log);
        } else {
            if( log ) alert(log);
        }

    });
});
</code></pre>

## #6

Now we just use some CSS (SCSS in my case) to hide the ugly input button and give its new `Browse...` button the nice white color of Bootstrap&#8217;s `btn-default` in `style.css`:

<pre><code class="CSS">#browsebutton {
  background-color: white;
}

#my-file-selector {
    display: none;
}
</code></pre>

That&#8217;s all there is to it! I found <a href="http://www.bootply.com/" target="_blank">Bootply</a> _really_ helpful in getting this all figured out. For those of you not using Flask, below is a simplified version using just Bootstrap, HTML, and the same JS as above, and <a href="http://www.bootply.com/gLB1lB2Ad8" target="_blank">here&#8217;s a link</a> to a runnable demo at Bootply.

<pre><code class="html">&lt;form class="form-inline center-block" action="/" method="POST" enctype="multipart/form-data"&gt;
    &lt;div class="input-group"&gt;
        &lt;label id="browsebutton" class="btn btn-default input-group-addon" for="my-file-selector" style="background-color:white"&gt;
            &lt;input id="my-file-selector" type="file" style="display:none;"&gt;
            Browse...
        &lt;/label&gt;
        &lt;input type="text" class="form-control" readonly=""&gt;
    &lt;/div&gt;
  &lt;button type="submit" class="btn btn-primary"&gt;Convert&lt;/button&gt;
&lt;/form&gt;
</code></pre>