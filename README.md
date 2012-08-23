Sourcemint Node
===============

*Status: ALPHA*

The sourcemint networkable node daemon to be installed on all systems.

  * Copyright: 2012 [Christoph Dorn](http://www.christophdorn.com/)
  * Code License: [MIT License](http://www.opensource.org/licenses/mit-license.php)
  * Docs License: [Creative Commons Attribution-NonCommercial-ShareAlike 3.0](http://creativecommons.org/licenses/by-nc-sa/3.0/)
  * Sponsor: [Sourcemint](http://sourcemint.com/)
  * Mailing list: [groups.google.com/group/sourcemint](http://groups.google.com/group/sourcemint)


Usage
=====

Exposes API:

  * `http://<hostname>:9999/api/github.com/post-receive` - Set this up as a
    [github.com Post-Receive WebHook URL](https://help.github.com/articles/post-receive-hooks).

    Will trigger all scripts configured with:

    	/pinf/programs/<programId>/program.json ~ {
		    "config": {
		        "github.com/sourcemint/node/0": {
		            "on": {
		                "RepositoryNewTag": {
		                    "match": {
		                        "repository": "<github hostname><github pathname>"
		                    },
		                    "do": "<shell command (cwd: /pinf/programs/<programId>)>"
		                }
		            }
		        }
		    }
		}
