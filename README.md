This is DEV.BY web-companies parser.  
To run code clone this repo, then write in console: 'node nodej', wait few minutes.  
You will get first 50 filtered by 'WEB' sphere and parsed companies.  
Because of server response-problem, it is more effective to parse 100 companies per 12 hours.  
To parse next 50 companies you should change variables 'from' and 'to'.  
After you get a list of companies with emails, you should use 'upgrade.js' node server  
to re-request companies emails , which server has not response correctly first time.  
Write 'node upgrade' to run updater of our finally list. And use it until all companies emails  
will be filled. As default 'upgrade.js' looks for 20 undefined emails per one session.
 