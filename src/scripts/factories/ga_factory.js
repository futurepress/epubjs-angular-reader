'use strict';

angular.module('Reader')
    .factory('gAnalytics', function(){
        
        var getPathname = function(href) {
            var l = document.createElement("a");
            l.href = href;
            return l.pathname;
        };

        function TrackTiming(category, variable, page_path, opt_label) {
            this.category = category;
            this.variable = variable;
            this.page_path = page_path
            this.label = opt_label ? opt_label : undefined;
            this.startTime;
            this.endTime;
            return this;
        }

        TrackTiming.prototype.startTime = function() {
            this.startTime = new Date().getTime();
            return this;
        }

        TrackTiming.prototype.endTime = function() {
            this.endTime = new Date().getTime();
            return this;
        }

        TrackTiming.prototype.send = function() {
            var timeSpent = this.endTime - this.startTime;
            //console.log(parseInt(timeSpent) / 1000.0)

            ga('send', {
                'hitType': 'timing',
                'timingCategory': this.category,
                'timingVar': this.variable,
                'timingValue': timeSpent,
                'timingLabel': this.label,
                'page': this.page_path
            });
            return this;
        }
        
        this.currentChapterId = '';
        
        return {
            init: function(gaPropertyId) {
            
                (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
                (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
                m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
                })(window,document,'script','//www.google-analytics.com/analytics.js','ga');
            
                ga('create', gaPropertyId, {
                    'cookieDomain' : 'none'  // cookieDomain 'none' for localhost
                });
            },
            setBookVersion: function(book_version) {
                ga('set', 'dimension2', book_version);
            },
            trackChapterChange: function(event) {
            // Track chapter change as pageviews (in TDO this is fired by chapters and sections
            // eg chapter 1 and section 1.2) Track time in section with TrackTiming

                var page_href = event.href;
                var page_path = getPathname(event.href);
                var title = this.currentChapterId = event.id;

                ga('send', 'pageview', {
                        'location': page_href,
                        'page': page_path,
                        'title': title,
                        'dimension1': 'section_load'
                });

                if(typeof section_time != 'undefined'){ // section_time exisits
                    section_time.endTime().send();
                    section_time = new TrackTiming('ReadingTimes', 'SectionTime', page_path, title);
                    section_time.startTime();
                } else {
                    // section_time does not exist, create with global scope
                    window.section_time = new TrackTiming('ReadingTimes', 'SectionTime', page_path, title);
                    section_time.startTime();
                }
            },
            trackLinkFollows: function(event) {
                var links = $('#area').find('iframe').contents().find('a');
                if(links.length != 0) {
                    $.each(links, function(i, link){
                        $(link).on('click', function(){

                            var page_href = this.href
                            var page_path = this.pathname
                            var title = this.text

                            ga('send', 'pageview', {
                                'location': page_href,
                                'page': page_path,
                                'title': title,
                                'dimension1': 'internal_link'
                            });
                        });
                    });
                }
            },
            trackAnnotations: function() {
                var title = this.currentChapterId;
                
                window.annotator.on('annotationCreated', function(){
                    ga('send', 'event', 'annotation', title)
                })
            }
        }

    });
