Whisper
=======

This repository contains the required submodules to stream audio from the browser to the server.

###Definition

*Streaming* media is [multimedia](http://www.answers.com/topic/multimedia) that is constantly received by and presented to an [end-user](http://en.wikipedia.org/wiki/End-user_(computer_science)) while being delivered by a provider.

- http://en.wikipedia.org/wiki/Streaming_media

**Note:** the end-user in context of streaming audio would be the Server hosting this application, and the provider would be the clients browser.

*WebSocket* is a protocol providing [full-duplex](http://en.wikipedia.org/wiki/Full-duplex) communications channels over a single [TCP](http://en.wikipedia.org/wiki/Transmission_Control_Protocol) connection.  It is designed to be implemented in [web browsers](http://en.wikipedia.org/wiki/Web_browser) and [web servers](http://en.wikipedia.org/wiki/Web_server), but it can be used by any client or server application.

- http://en.wikipedia.org/wiki/WebSocket

###Overview

This project utilizes the [*WebSocket Protocol*](https://developer.mozilla.org/en-US/docs/WebSockets).  Some configurations need to be made at each end, in order for WebSocket to be able to communicate from the browser to the server (and vice versa):

First, a WebSocket server needs to be defined.  Since [*AutobahnPython*](https://github.com/tavendo/AutobahnPython) is the chosen server-side implementation, the corresponding [`server.py`](https://github.com/jeff1evesque/whisper/blob/master/websocket/server.py) will need to utilize the respective [interfaces](https://github.com/tavendo/AutobahnPython/blob/master/autobahn/autobahn/websocket/interfaces.py).

Once the server has been created, the client-side implementation needs to be defined.  This project chooses to use the javascript [*WebSocket Protocols*](https://developer.mozilla.org/en-US/docs/WebSockets/Writing_WebSocket_client_applications).  However, other client-side schemes are possible, for example, [*AutobahnJS*](https://github.com/tavendo/AutobahnJS).  Implementing *AutobahnJS* on the client-side, would require the use of the [*WAMP Protocol*](http://wamp.ws/) on the server-side (provided in AutobahnPython) as well.  The change from [*WebSockets*](https://developer.mozilla.org/en-US/docs/WebSockets), to the *WAMP Protocol* would change [`server.py`](https://github.com/jeff1evesque/whisper/blob/master/websocket/server.py), respectively.

**Note:** The *WebSocket* protocol is [supported](http://caniuse.com/websockets) by all major browsers, except:

- IE 9-
- Opera Mini 5-7
- Android Browser 4.3-

After the WebSocket protocol has been defined, this application is able to stream to the server using the HTML5 [`getUserMedia`](https://developer.mozilla.org/en-US/docs/NavigatorUserMedia.getUserMedia) object. This object first prompts permission to access the microphone. Once granted, an audio stream object is created.  The stream is sent to the [`server.py`](https://github.com/jeff1evesque/whisper/blob/master/websocket/server.py), where it can be accessed, and modified.

Unfortunately, not all browsers (Internet Explorer, Safari, and mobile devices) support the  `getUserMedia` object.  In particular, Internet Explorer claims to [support](http://status.modern.ie/mediacaptureandstreams?term=getUser) this feature in later releases, while Safari supports its own [streaming API](https://developer.apple.com/streaming/).  Mobile devices will need to incorporate a framework such as [Cordova](http://cordova.apache.org/), or [Phonegap](http://phonegap.com/) in order to support audio streaming.

Since `getUserMedia` has not been adopted by all browser, a fallback is required.  In this project, a basic flash fallback has been implemented.  This implementation requires users to start, then stop recording an audio, and click upload, before the entire audio recording is saved to the server.  Later releases for this project, may incorporate a flash fallback [implementation](https://github.com/jeff1evesque/whisper/issues/71) that streams audio from the browser to server, along with a mobile device [polyfill](https://github.com/jeff1evesque/whisper/issues/165).

**Note:** to see a working example of this project, refer to [`test.php`](https://github.com/jeff1evesque/whisper/blob/master/tests/php/test.php).

##Installation

###Linux Packages

The following packages need to be installed through terminal in Ubuntu:

```
sudo apt-get install libappindicator1
sudo apt-get install libindicator7
```

###Google Chrome

This project requires testing the functionality of [`getUserMedia`](https://developer.mozilla.org/en-US/docs/Web/API/Navigator.getUserMedia).  The [Google Chrome](https://www.google.com/intl/en_us/chrome/browser/) browser, ensures, and provides this functionality.

```
wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | sudo apt-key add -
sudo sh -c 'echo "deb http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google-chrome.list'
sudo apt-get update
sudo apt-get install google-chrome-stable
```

**Note:** This project assumes [Ubuntu Server 14.04](http://www.ubuntu.com/download/server) as the operating system.

##Configuration

###GIT

Fork this project in your GitHub account, then clone your repository:

```
cd /var/www/html/
sudo git clone https://[YOUR-USERNAME]@github.com/[YOUR-USERNAME]/whisper.git whisper
```

Then, add the *Remote Upstream*, this way we can pull any merged pull-requests:

```
cd /var/www/html/whisper/
git remote add upstream https://github.com/[YOUR-USERNAME]/whisper.git
```

####GIT Submodule

We need to initialize our git *submodules*:

```
sudo git submodule init
sudo git submodule update
```

**Note:** We have to use the *sudo* prefix, since we haven't taken care of file permissions yet.

The above two commands will update submodules.  If they are already initialized, then the latter command will suffice. Then, we need to pull the code-base into the initialized submodule directory:

```
cd /var/www/html/whisper/
git checkout -b NEW_BRANCH master
cd [YOUR_SUBMODULE]/
git checkout master
git pull
cd ../
git status
```

Now, commit and merge the submodule changes.

###File Permission

Change the file permission for the entire project by issuing the command:

```
cd /var/www/html/
sudo chown -R jeffrey:sudo whisper
```

**Note:** change 'jeffrey' to the user account YOU use.

###AutobahnPython

Provides an open-source, real-time framework implementation for the following protocols:

- [WebSocket Protocol](http://tools.ietf.org/html/rfc6455)
- [Web Application Messaging Protocol](http://wamp.ws/) (WAMP)

Either protocols, excel at [pushing data](http://autobahn.ws/python/#what-can-i-do-with-this-stuff) asynchronously between the client, and server in real-time.  In order to use the [*AutobahnPython*](https://github.com/tavendo/AutobahnPython) framework, it must first be installed:

```
cd /var/www/html/whisper/AutobahnPython/autobahn/
sudo python setup.py install
```

###Twisted

AutobahnPython [requires](http://autobahn.ws/python/installation.html#requirements) a networking framework, which must be either [Twisted](https://github.com/twisted/twisted), or [asyncio](https://docs.python.org/3.4/library/asyncio.html).  This project implements the *Twisted* framework:

```
cd /var/www/html/whisper/twisted
sudo python setup.py install
```

**Note:** Generally, *Twisted* is the framework of choice if the environment only provides python 2.x (will [support](http://twistedmatrix.com/trac/milestone/Python-3.x) python 3.x).  Whereas, *asyncio* is generally preferred if the environment is python 3.x ([included](https://docs.python.org/3/whatsnew/3.4.html) in python 3.4+).

##WebSocket Execution

###Start Server

In order for the browser to be able to connect to the [AutobahnPython](https://github.com/tavendo/AutobahnPython) Webserver, [`server.py`](https://github.com/jeff1evesque/whisper/blob/master/websocket/server.py) needs to be executed:

```
cd /var/www/html/whisper/websocket/
python server.py
```

This will *dedicate* the terminal window tab specifically to the server, and unresponsive to other commands.

###Stop Server

The *WebSocket Server* can be *stopped* within the *dedicated* terminal console by pressing `ctrl-c`.

###Server Echo

Periodically, *print* statements within the *dedicated terminal* will display the status of certain actions.  For example, when a [*WebSocket Server*](http://www.html5rocks.com/en/tutorials/websockets/basics/) is connected, then started:

```
sending echo: CONNECTED TO YOU
sending echo: start
```

Likewise, when the *WebSocket Server* is stopped:

```
sending echo: stop
```

Other *print* statements may appear in the *dedicated* terminal console, and will vary accordingly. 
