var N = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function m(t) {
  return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t;
}
var O = {}, c = {}, L = {}, T = {};
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.ErrorCode = void 0;
  var s;
  (function(e) {
    e[e.SUCCESS = 0] = "SUCCESS", e[e.MESSAGE_NOT_DEFINED = 1] = "MESSAGE_NOT_DEFINED", e[e.CONNECTION_NOT_ESTABLISHED = 2] = "CONNECTION_NOT_ESTABLISHED", e[e.FAILED_TO_SEND_MESSAGE = 3] = "FAILED_TO_SEND_MESSAGE", e[e.MESSAGE_INVALID = 4] = "MESSAGE_INVALID", e[e.MESSAGE_INVALID_DURATION_MILLIS = 5] = "MESSAGE_INVALID_DURATION_MILLIS", e[e.MESSAGE_INVALID_DOT_INDEX_HEAD = 6] = "MESSAGE_INVALID_DOT_INDEX_HEAD", e[e.MESSAGE_INVALID_DOT_INDEX_ARM = 7] = "MESSAGE_INVALID_DOT_INDEX_ARM", e[e.MESSAGE_INVALID_DOT_INDEX_VEST = 8] = "MESSAGE_INVALID_DOT_INDEX_VEST", e[e.MESSAGE_INVALID_INTENSITY = 9] = "MESSAGE_INVALID_INTENSITY", e[e.MESSAGE_INVALID_X = 10] = "MESSAGE_INVALID_X", e[e.MESSAGE_INVALID_Y = 11] = "MESSAGE_INVALID_Y", e[e.MESSAGE_INVALID_ROTATION_X = 12] = "MESSAGE_INVALID_ROTATION_X", e[e.MESSAGE_INVALID_ROTATION_Y = 13] = "MESSAGE_INVALID_ROTATION_Y", e[e.MESSAGE_INVALID_SCALE_INTENSITY_RATIO = 14] = "MESSAGE_INVALID_SCALE_INTENSITY_RATIO", e[e.MESSAGE_INVALID_SCALE_DURATION_RATIO = 15] = "MESSAGE_INVALID_SCALE_DURATION_RATIO", e[e.MESSAGE_NOT_REGISTERED_KEY = 16] = "MESSAGE_NOT_REGISTERED_KEY", e[e.MESSAGE_NOT_INITIALIZED = 17] = "MESSAGE_NOT_INITIALIZED";
  })(s = t.ErrorCode || (t.ErrorCode = {})), t.default = s;
})(T);
(function(t) {
  var s = N && N.__importDefault || function(r) {
    return r && r.__esModule ? r : { default: r };
  };
  Object.defineProperty(t, "__esModule", { value: !0 }), t.STATUS = void 0;
  const e = s(T), S = "ws://127.0.0.1:15881/v2/feedbacks?";
  var I;
  (function(r) {
    r.CONNECTING = "Connecting", r.CONNECTED = "Connected", r.DISCONNECT = "Disconnected";
  })(I = t.STATUS || (t.STATUS = {}));
  const u = 5e3;
  class _ {
    constructor(h = "yourAppId", y = "yourAppName", G = u) {
      this.handlers = [], this.isTriggered = !1, this.addListener = (E) => {
        this.handlers.push(E);
      }, this.emit = (E) => {
        this.handlers.forEach((D) => {
          D(E);
        });
      }, this.connect = () => {
        try {
          this.websocketClient = new WebSocket(`${S}app_id=${this.appId}&app_name=${this.appName}`);
        } catch (E) {
          console.log("PlayerSocket", E);
          return;
        }
        this.websocketClient.onopen = () => {
          this.currentStatus = I.CONNECTED, this.emit({
            status: this.currentStatus,
            message: this.message
          });
        }, this.websocketClient.onmessage = (E) => {
          JSON.stringify(this.message) !== E.data && (this.message = JSON.parse(E.data), this.emit({
            status: this.currentStatus,
            message: this.message
          }));
        }, this.websocketClient.onclose = (E) => {
          this.currentStatus = I.DISCONNECT, this.emit({
            status: this.currentStatus,
            message: this.message
          }), setTimeout(() => {
            this.connect();
          }, this.retryConnectTime);
        }, this.websocketClient.onerror = (E) => {
          this.currentStatus = I.DISCONNECT, this.emit({
            status: this.currentStatus,
            message: E.message
          });
        }, this.currentStatus = I.CONNECTING, this.emit({
          status: this.currentStatus,
          message: this.message
        });
      }, this.send = (E) => {
        if (E === void 0)
          return e.default.CONNECTION_NOT_ESTABLISHED;
        if (!this.isTriggered)
          return this.isTriggered = !0, this.connect(), e.default.CONNECTION_NOT_ESTABLISHED;
        if (this.websocketClient === void 0 || this.currentStatus !== I.CONNECTED)
          return e.default.CONNECTION_NOT_ESTABLISHED;
        try {
          return this.websocketClient.send(E), e.default.SUCCESS;
        } catch {
          return e.default.FAILED_TO_SEND_MESSAGE;
        }
      }, this.appName = y, this.appId = h, this.message = {}, this.retryConnectTime = G, this.currentStatus = I.DISCONNECT;
    }
  }
  t.default = _;
})(L);
var l = {};
(function(t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.PositionType = void 0, function(s) {
    s.VestFront = "VestFront", s.VestBack = "VestBack", s.Head = "Head", s.ForearmL = "ForearmL", s.ForearmR = "ForearmR", s.GloveL = "GloveL", s.GloveR = "GloveR";
  }(t.PositionType || (t.PositionType = {}));
})(l);
var M = N && N.__importDefault || function(t) {
  return t && t.__esModule ? t : { default: t };
}, n;
Object.defineProperty(c, "__esModule", { value: !0 });
const g = M(L), f = l, i = M(T);
class a {
}
n = a;
a.registeredKeys = [];
a.addListener = (t) => {
  if (!n.socket) {
    console.log("BhapticsSdk not initialized");
    return;
  }
  n.socket.addListener(t);
};
a.initialize = (t, s) => {
  if (n.socket) {
    console.log("initialize called twice");
    return;
  }
  n.socket = new g.default(t, s), n.addListener((e) => {
    var S;
    !((S = e.message) === null || S === void 0) && S.RegisteredKeys && (n.registeredKeys = e.message.RegisteredKeys);
  });
};
a.turnOff = (t) => {
  const s = {
    Submit: [{
      Type: "turnOff",
      Key: t
    }]
  };
  return n.socket ? n.socket.send(JSON.stringify(s)) : i.default.MESSAGE_NOT_INITIALIZED;
};
a.turnOffAll = () => {
  const t = {
    Submit: [{
      Type: "turnOffAll"
    }]
  };
  return n.socket ? n.socket.send(JSON.stringify(t)) : i.default.MESSAGE_NOT_INITIALIZED;
};
a.submitDot = (t, s, e, S) => {
  if (!n.socket)
    return i.default.MESSAGE_NOT_INITIALIZED;
  if (S < 20 || S > 1e5)
    return i.default.MESSAGE_INVALID_DURATION_MILLIS;
  if (e === void 0)
    return i.default.MESSAGE_INVALID;
  for (let u = 0; u < e.length; u++) {
    const _ = e[u];
    switch (s) {
      case f.PositionType.ForearmL:
      case f.PositionType.ForearmR:
        if (_.index < 0 || _.index >= 6)
          return i.default.MESSAGE_INVALID_DOT_INDEX_ARM;
        break;
      case f.PositionType.Head:
        if (_.index < 0 || _.index >= 6)
          return i.default.MESSAGE_INVALID_DOT_INDEX_HEAD;
        break;
      case f.PositionType.VestBack:
      case f.PositionType.VestFront:
        if (_.index < 0 || _.index >= 20)
          return i.default.MESSAGE_INVALID_DOT_INDEX_VEST;
        break;
    }
    if (_.intensity < 0 || _.intensity > 100)
      return i.default.MESSAGE_INVALID_INTENSITY;
  }
  const I = {
    Submit: [{
      Type: "frame",
      Key: t,
      Frame: {
        Position: s,
        PathPoints: [],
        DotPoints: e,
        DurationMillis: S
      }
    }]
  };
  return n.socket.send(JSON.stringify(I, (u, _) => _.toFixed ? Number(_.toFixed(3)) : _));
};
a.submitPath = (t, s, e, S) => {
  if (!n.socket)
    return i.default.MESSAGE_NOT_INITIALIZED;
  if (isNaN(S) || S < 20 || S > 1e5)
    return i.default.MESSAGE_INVALID_DURATION_MILLIS;
  if (e === void 0)
    return i.default.MESSAGE_INVALID;
  for (let u = 0; u < e.length; u++) {
    const _ = e[u];
    if (_.x < 0 || _.x > 1)
      return i.default.MESSAGE_INVALID_X;
    if (_.y < 0 || _.y > 1)
      return i.default.MESSAGE_INVALID_Y;
    if (_.intensity < 0 || _.intensity > 100)
      return i.default.MESSAGE_INVALID_INTENSITY;
  }
  const I = {
    Submit: [{
      Type: "frame",
      Key: t,
      Frame: {
        Position: s,
        PathPoints: e,
        DotPoints: [],
        DurationMillis: S
      }
    }]
  };
  return n.socket.send(JSON.stringify(I, (u, _) => _.toFixed ? Number(_.toFixed(3)) : _));
};
a.registerFile = (t, s) => {
  if (!n.socket)
    throw new Error("BhapticsSdk not initialized");
  const S = JSON.parse(s).project, I = {
    Register: [{
      Key: t,
      project: S
    }]
  };
  return n.socket.send(JSON.stringify(I));
};
a.submitRegistered = (t) => {
  if (!n.socket)
    return i.default.MESSAGE_NOT_INITIALIZED;
  if (n.registeredKeys.find((e) => e === t) === void 0)
    return i.default.MESSAGE_NOT_REGISTERED_KEY;
  const s = {
    Submit: [{
      Type: "key",
      Key: t
    }]
  };
  return n.socket.send(JSON.stringify(s));
};
a.submitRegisteredWithScaleOption = (t, s) => {
  if (!n.socket)
    return i.default.MESSAGE_NOT_INITIALIZED;
  if (n.registeredKeys.find((S) => S === t) === void 0)
    return i.default.MESSAGE_NOT_REGISTERED_KEY;
  if (s.intensity < 0.2 || s.intensity > 5)
    return i.default.MESSAGE_INVALID_SCALE_INTENSITY_RATIO;
  if (s.duration < 0.2 || s.duration > 5)
    return i.default.MESSAGE_INVALID_SCALE_DURATION_RATIO;
  const e = {
    Submit: [{
      Type: "key",
      Key: t,
      Parameters: {
        scaleOption: s
      }
    }]
  };
  return n.socket.send(JSON.stringify(e));
};
a.submitRegisteredWithRotationOption = (t, s) => {
  if (!n.socket)
    return i.default.MESSAGE_NOT_INITIALIZED;
  if (n.registeredKeys.find((S) => S === t) === void 0)
    return i.default.MESSAGE_NOT_REGISTERED_KEY;
  if (s.offsetAngleX < 0 || s.offsetAngleX > 360)
    return i.default.MESSAGE_INVALID_ROTATION_X;
  if (s.offsetY < -0.5 || s.offsetY > 0.5)
    return i.default.MESSAGE_INVALID_ROTATION_Y;
  const e = {
    Submit: [{
      Type: "key",
      Key: t,
      Parameters: {
        rotationOption: s
      }
    }]
  };
  return n.socket.send(JSON.stringify(e));
};
c.default = a;
(function(t) {
  var s = N && N.__importDefault || function(u) {
    return u && u.__esModule ? u : { default: u };
  };
  Object.defineProperty(t, "__esModule", { value: !0 }), t.BhapticsPlayer = t.ErrorCode = t.PositionType = void 0;
  const e = s(c);
  t.BhapticsPlayer = e.default;
  const S = s(T);
  t.ErrorCode = S.default;
  const I = l;
  Object.defineProperty(t, "PositionType", { enumerable: !0, get: function() {
    return I.PositionType;
  } }), t.default = e.default;
})(O);
const A = /* @__PURE__ */ m(O);
A.initialize("testApp", "testAppName");
A.turnOffAll();
let d = 0;
const o = () => (d += 1, `${d}`);
window.vestControl = {
  sendDot: ({ index: t, intensity: s, duration: e, position: S = "VestFront" }) => {
    A.submitDot(o(), S, [{ Index: t, Intensity: s }], e);
  },
  sendPath: ({ points: t, duration: s, position: e = "VestFront" }) => {
    A.submitPath(o(), e, t, s);
  }
};
