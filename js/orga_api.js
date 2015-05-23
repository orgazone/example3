/**
 * Sync section to interact with web services
 */
if (!window.orgaApi) {
    window.orgaApi = {

        SYNC_STATUS_REMOTE: "sync_status_key_remote",

        SYNC_STATUS_LOCAL: "sync_status_key_local",

        getStatus: function(doPull, doPush) {
            var url = config.baseUrl + "?appaction=status&appname=" + config.appName + "&appid=" + config.appId;
            
            $.ajax({
                url: url,
                type: 'GET',
                crossDomain: true, // enable this
                dataType: 'json',
                success: function(response) {
                    
                    if (response.data.OZINDEX != undefined) {

                        var value = response.data.OZINDEX.split("-")[0];
                        orgaApi.setLocalItem(orgaApi.SYNC_STATUS_REMOTE, value);

                        if (doPull == undefined && doPush == undefined) {
                            alert(JSON.stringify(response));
                        } else {
                            if (doPull != undefined) {
                                orgaApi.getData();
                            } else if (doPush != undefined) {
                                orgaApi.pushData(database.notesDataArray);
                            }
                        }
                    }else{
                        if (doPull == undefined && doPush == undefined) {
                            alert(JSON.stringify(response));
                        } else {
                            if (doPull != undefined) {
                                orgaApi.getData();
                            } else if (doPush != undefined) {
                                orgaApi.pushData(database.notesDataArray);
                            }
                        }
                    }
                },
                error: function() {
                    alert('Failed!');
                }
            });
        },

        updateSyncStatus: function(key, value) {
            var that = this;
            if (value == undefined) {
                var date = new Date();
                var uniqueId = date.getFullYear() + "" + date.getMonth() + "" + date.getDate() + "" + date.getHours();
                uniqueId += date.getMinutes() + "" + date.getSeconds();
                that.setLocalItem(key, uniqueId);
            } else {
                that.setLocalItem(key, value);
            }
        },

        getData: function() {
            var url = config.baseUrl + "?appaction=request&appname=" + config.appName + "&appid=" + config.appId;
            
            $.ajax({
                url: url,
                type: 'GET',
                crossDomain: true, // enable this
                dataType: 'json',
                success: function(response) {
                    orgaApi.checkLocalData(response);
                    alert(JSON.stringify(response));
                },
                error: function() {
                    alert('Failed!');
                }
            });
        },

        pushData: function(appData) {
            var url = config.baseUrl + "?appaction=push&appname=" + config.appName + "&appid=" + config.appId;
            url += "&appdata=" + encodeURIComponent(JSON.stringify(appData));

            
            //{"data":"PUSHED","success":1}

            $.ajax({
                url: url,
                type: 'GET',
                crossDomain: true, // enable this
                dataType: 'json',
                success: function(response) {
                    orgaApi.updateSyncStatus(orgaApi.SYNC_STATUS_REMOTE);
                    alert(JSON.stringify(response));
                },
                error: function() {
                    alert('Failed!');
                }
            });
        },

        checkLocalData: function(data) {
            var that = this;
            var localStatus = that.getLocalItem(that.SYNC_STATUS_LOCAL);
            var remoteStatus = that.getLocalItem(that.SYNC_STATUS_REMOTE);

            //console.log(localStatus);
            //console.log(remoteStatus);
            if (remoteStatus > localStatus) {
                //Update local data
                database.notesDataArray = JSON.parse(orgaApi.extractDataFromPull(remoteStatus, data.data.lines));
                database.saveData();
            }
        },

        extractDataFromPull: function(key, data) {
            for (i = 0; i < data.length; i++) {
                var objKey = data[i].OZINDEX.split("-")[0];
                if (objKey == key) {
                    return data[i].OZAPPDATA;
                }
            }
        },

        getLocalItem: function(key) {
            return window.localStorage.getItem(key, null);
        },

        setLocalItem: function(key, value) {
            var that = this;

            try {
                window.localStorage.setItem(key, value);
            } catch (e) {
                alert("We had an issue saving the data locally..");
            }
        }
    };
};
