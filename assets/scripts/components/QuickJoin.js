
cc.Class({
    extends: cc.Component,

    properties: {

    },

    onLoad: function () {

    },

	onBtnClose:function() {
        cc.vv.audioMgr.playButtonClicked();
		this.node.active = false;
    },

    onBtnQuickJoinClicked: function() {
        var edtRoom = this.node.getChildByName('edt_room').getComponent(cc.EditBox);

        var roomId = edtRoom.string;
        var self = this;

        cc.vv.userMgr.enterRoom(roomId, function(ret) {
            if (ret.errcode == 0) {
                self.node.active = false;
            }
            else {
                var content = "����["+ roomId +"]�����ڣ�����������!";
                if(ret.errcode == 4){
                    content = "����["+ roomId + "]����!";
                }
                cc.vv.alert.show(content);
            }
        });
    },
});

