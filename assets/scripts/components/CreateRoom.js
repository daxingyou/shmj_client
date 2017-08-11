
cc.Class({
    extends: cc.Component,

    properties: {
        _gamenum: null,
        _maxfan: null,
        _flowers: 0,
        _maima: null,
        _allpairs: null,
        _bao: null,
		slider: cc.Slider,		
    },

    onLoad: function() {
        this._gamenum = [];
		var t = this.node.getChildByName('game_num');
        for (var i = 0; i < t.childrenCount; i++) {
            var n = t.children[i].getComponent("RadioButton");
            if (n != null) {
                this._gamenum.push(n);
            }
        }

        this._maxfan = [];
		var t = this.node.getChildByName('maxfan');
        for (var i = 0; i < t.childrenCount; i++) {
            var n = t.children[i].getComponent("RadioButton");
            if (n != null) {
                this._maxfan.push(n);
            }
        }

		this._maima = cc.find('wanfa/horse', this.node);
		this._allpairs = cc.find('wanfa/allpairs', this.node);
		this._bao = cc.find('wanfa/bao', this.node);
		
		var score = this.slider;

		score.node.on('slide', this.onScoreChanged, this);
	},

	onScoreChanged: function(event) {
		var slide = event.detail;
		var flower = cc.find('base/flower', this.node).getComponent(cc.Label);
		var range = [1, 5, 10, 20, 30, 50, 100, 200, 300];
		var id = Math.round(slide.progress * (range.length - 1));

		flower.string = range[id];
		this._flowers = range[id];
	},

    onBtnClose:function() {
        cc.vv.audioMgr.playButtonClicked();
		this.node.active = false;
    },

    onBtnOK:function() {
        cc.vv.audioMgr.playButtonClicked();

		this.node.active = false;
        this.createRoom();
    },

    createRoom: function() {
        var self = this;

        var gamenum = 0;
		var gamenums = [ 4, 8, 16 ];
        for (var i = 0; i < self._gamenum.length; ++i) {
            if (self._gamenum[i].checked) {
                gamenum = gamenums[i];
                break;
            }
        }

        var maxfan = 0;
        var maxfans = [ 2, 3, 4, 100 ];
        for (var i = 0; i < self._maxfan.length; ++i) {
            if (self._maxfan[i].checked) {
                maxfan = maxfans[i];
                break;
            }
        }

		var flowers = this._flowers;
		var maima = this._maima.getComponent('CheckBox').checked;
		var allpairs = this._allpairs.getComponent('CheckBox').checked;
		var bao = this._bao.getComponent('CheckBox').checked;

        var conf = {
            type: 'shmj',
            gamenum: gamenum,
            maxfan: maxfan,
            huafen: flowers,
            playernum: bao ? 2 : 4,
            maima: maima,
            qidui: allpairs
        };

		var pc = cc.vv.pclient;

        cc.vv.wc.show(2);
        pc.request_connector('create_private_room', { conf: conf }, function(ret) {
            if (ret.errcode !== 0) {
                cc.vv.wc.hide();
                if (ret.errcode == 2222) {
                    cc.vv.alert.show("房卡不足，创建房间失败!");
                } else {
                    cc.vv.alert.show("创建房间失败,错误码:" + ret.errcode);
                }
            } else {
                var sd = {
                    roomid: ret.data.roomid,
                    userName : cc.vv.userMgr.userName
                };

                pc.request_connector('enter_private_room', sd, function(ret2) {
                    console.log("return from enter_private_room=");
                    if (ret2.errcode != cc.vv.global.const_code.OK)
                    {
                        console.log("enter room failed,code=" + ret2.errcode);
                        cc.vv.wc.hide();
                    } else {
                        cc.vv.gameNetMgr.connectGameServer(ret.data);
                    }
                });
            }
        });
    }
});

