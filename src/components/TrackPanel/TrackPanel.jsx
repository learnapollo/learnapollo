"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require('react');
var Icon_1 = require('../Icon/Icon');
var content_1 = require('../../utils/content');
var classNames = require('classnames');
var styles = require('./SetTrack.module.styl');
var react_router_1 = require('react-router');
var TrackPanel = (function (_super) {
    __extends(TrackPanel, _super);
    function TrackPanel() {
        _super.apply(this, arguments);
    }
    TrackPanel.prototype.render = function () {
        var _this = this;
        var t = this.props.track;
        return (<div className='pv4 pa1'>
        <div key={t.alias} className='pv4 flex flex-row'>
          <Icon_1.default width={60} height={60} src={require('../../assets/icons/logo-react.svg')}/>
          <div className='ph4'>
            <h2 className='mt0 accent' style={{ border: 'none' }}>{t.title}</h2>
            <p>I have hinted that I would often jerk poor
                   Queequeg from between the whale and the ship —
                  where he would occasionally fall.</p>
            <div className={classNames(styles.button, 'pa3', 'pointer')} onClick={function () { return _this.clickHandler(t); }}>
              <span>Get started with {t.title} track</span>
            </div>
          </div>
        </div>
      </div>);
    };
    TrackPanel.prototype.clickHandler = function (selectedTrack) {
        var selectedChapter = content_1.chapters.find((function (c) { return c.alias === selectedTrack.alias; }));
        this.props.router.replace("/" + selectedChapter.alias + "/" + selectedChapter.subchapters[0].alias);
    };
    return TrackPanel;
}(React.Component));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = react_router_1.withRouter(TrackPanel);
