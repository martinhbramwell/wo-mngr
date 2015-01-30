## leaflet-parties


Execellent example of an upgraded Parties example, using Leaflet.

[Realtime Maps With Meteor and Leaflet - Part One](http://asynchrotron.com/blog/2013/12/27/realtime-maps-with-meteor-and-leaflet/)  
[Realtime Maps With Meteor and Leaflet - Part Two](http://asynchrotron.com/blog/2013/12/28/realtime-maps-with-meteor-and-leaflet-part-2//)  



============================
#### Meteor Version  

1.0

============================
#### Installation  


````sh
# Should be as simple as cloning the repository...  
git clone https://github.com/awatson1978/leaflet-parties.git

# And then running it...
meteor
````


============================
#### Additional Notes


For more details on using github auth with Meteor, see:
http://www.eventedmind.com/posts/meteor-customizing-login


============================
#### Running Acceptance Tests  



````sh
# optional:  you may want to reset your application data
terminal-a$ meteor reset

# run your application as usual
terminal-a$ meteor

# install the nightwatch script (you should only need to do this once)
terminal-b$ cp .meteor/local/build/programs/server/assets/packages/clinical_nightwatch/launch_nightwatch_from_app_root.sh run_nightwatch.sh
terminal-b$ sudo chmod +x run_nightwatch.sh

# run nightwatch
terminal-b$ sudo ./run_nightwatch.sh

# you might want to do something clever like pass in arguments and run specific tests
terminal-b$ sudo ./run_nightwatch.sh -t tests/nightwatch/leaderboard.js
````

============================
#### Licensing

MIT License. Use as you wish, including for commercial purposes.
