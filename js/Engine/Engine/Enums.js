"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Visiblity = exports.GameState = exports.UpdateState = void 0;
var UpdateState;
(function (UpdateState) {
    UpdateState[UpdateState["Peeding"] = 0] = "Peeding";
    UpdateState[UpdateState["Active"] = 1] = "Active";
    UpdateState[UpdateState["Paused"] = 2] = "Paused";
    UpdateState[UpdateState["Dead"] = 3] = "Dead";
})(UpdateState = exports.UpdateState || (exports.UpdateState = {}));
var GameState;
(function (GameState) {
    GameState[GameState["Playing"] = 0] = "Playing";
    GameState[GameState["Paused"] = 1] = "Paused";
    GameState[GameState["Quit"] = 2] = "Quit";
})(GameState = exports.GameState || (exports.GameState = {}));
var Visiblity;
(function (Visiblity) {
    Visiblity[Visiblity["Visible"] = 0] = "Visible";
    Visiblity[Visiblity["Hide"] = 1] = "Hide";
})(Visiblity = exports.Visiblity || (exports.Visiblity = {}));
