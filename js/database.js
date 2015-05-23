/**
 * Database Object
 */
if (!window.database) {
    window.database = {

        IS_DATABASE_PRESENT: "is_db_present",

        CONTENT_DATA: "content_data",

        REG_ID_KEY: "reg_id",

        notesDataArray: {
            data: []
        },

        noteDataFormat: {
            id: null,
            timeStamp: null,
            title: null,
            notes: null
        },

        init: function() {
            var that = this;
            if (that.getLocalItem(that.IS_DATABASE_PRESENT)) {
                that.notesDataArray = that.getLocalItem(that.CONTENT_DATA);
            }
        },

        storeRegId: function(id) {
            var that = this;
            var fetchedId = that.getLocalItem(that.REG_ID_KEY);
            if (fetchedId) {
                config.appId = fetchedId;
            } else {
                that.setLocalItem(that.REG_ID_KEY, id);
                config.appId = id;
            }
        },

        saveData: function() {
            var that = this;
            that.setLocalItem(that.CONTENT_DATA, that.notesDataArray);
            orgaApi.updateSyncStatus(orgaApi.SYNC_STATUS_LOCAL);
        },

        saveNewNote: function(timeStamp, title, notes, previousId) {
            var that = this;
            var note = (JSON.parse(JSON.stringify(that.noteDataFormat)));
            note.id = new Date().getTime();
            note.timeStamp = timeStamp;
            note.title = title;
            note.notes = notes;

            if (previousId == undefined) {
                that.notesDataArray.data.push(note);
                logger.log(note.id, "new");
            } else {
                //old entry so update it
                note.id = previousId;
                that.notesDataArray.data[that.getItemIndex(previousId)] = note;
                logger.log(note.id, "update");
            }


            //Save data
            that.saveData();
        },

        clearSavedNotes: function() {
            var that = this;
            that.notesDataArray.data = [];
            that.setLocalItem(that.IS_DATABASE_PRESENT, false);
            //Save data
            that.saveData();
        },

        getLocalItem: function(key) {
            var that = this;
            if (key === that.IS_DATABASE_PRESENT || key === that.REG_ID_KEY) {
                return window.localStorage.getItem(key, false);
            } else {
                return JSON.parse(window.localStorage.getItem(key));
            }

        },

        setLocalItem: function(key, value) {
            var that = this;
            try {
                if (key === that.CONTENT_DATA) {
                    window.localStorage.setItem(that.IS_DATABASE_PRESENT, true);
                    window.localStorage.setItem(key, JSON.stringify(value));
                } else {
                    window.localStorage.setItem(key, value);
                }
            } catch (e) {
                alert("We had an issue saving the data locally..");
            }

        },

        getItemIndex: function(id) {
            var that = this;
            for (i = 0; i < that.notesDataArray.data.length; i++) {
                if (that.notesDataArray.data[i]['id'] == id) { //DO not use === as local store saved everything as strings
                    return i;
                }
            }
            return -1;
        },

    };
};
