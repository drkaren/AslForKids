// WADE (Web App Development Engine) 1.6 - Copyright Clockwork Chilli ltd 2012-2014 - all rights reserved 
function Animation(a, b, c, d, e, f, g, i, l) {
    if ("object" == typeof a && a) {
        if (this.name = a.name, this._numCells = {
                x: a.numCells && a.numCells.x || 1,
                y: a.numCells && a.numCells.y || 1
            }, this._startFrame = a.startFrame || 0, this._endFrame = "undefined" != typeof a.endFrame && !isNaN(a.endFrame) ? a.endFrame : this._numCells.x * this._numCells.y - 1, this._imageName = a.image, this._speed = "undefined" != typeof a.speed ? a.speed : 20, this._looping = !!a.looping, this._blending = !!a.blending, this._playMode = a.playMode || "forward", this._autoResize = "undefined" != typeof a.autoResize ? a.autoResize : !0, this._offset = {
                x: a.offset && a.offset.x || 0,
                y: a.offset && a.offset.y || 0
            }, this._image = wade.getImage(this._imageName), this._stopped = !!a.stopped, a.properties)for (var j in a.properties)if (a.properties.hasOwnProperty(j))try {
            this[j] = JSON.parse(JSON.stringify(a.properties[j]))
        } catch (h) {
        }
    } else this._image = wade.getImage(a), this._imageName = wade.getFullPathAndFileName(a), this._numCells = {
        x: b ? b : 1,
        y: c ? c : 1
    }, this._startFrame = f ? f : 0, this._endFrame = "undefined" != typeof g && !isNaN(g) ? g : b *
    c - 1, this._speed = "undefined" != typeof d ? d : 20, this._looping = e, this._blending = !1, this._playMode = "forward", this._stopped = !1, this._autoResize = "undefined" != typeof i ? i : !0, this._offset = l || {
        x: 0,
        y: 0
    }, this._offset.x = this._offset.x || 0, this._offset.y = this._offset.y || 0;
    this._currentFrame = this._startFrame;
    this._playing = !1;
    this._time = 0;
    this._direction = 1;
    this._frameFraction = 0;
    this._frameSize = {x: this._image.width / this._numCells.x, y: this._image.height / this._numCells.y};
    this._frameCenter = {};
    window.Float32Array && (this._f32AnimFrameInfo =
        new Float32Array([0, 0, 1 / this._numCells.x, 1 / this._numCells.y]));
    this._updateFrameCenter()
}
Animation.prototype.getImageSize = function () {
    return {x: this._image.width, y: this._image.height}
};
Animation.prototype.getFrameSize = function () {
    return {x: this._image.width / this._numCells.x, y: this._image.height / this._numCells.y}
};
Animation.prototype.getFrameCenter = function () {
    return {x: this._frameCenter.x, y: this._frameCenter.y}
};
Animation.prototype.getImageName = function () {
    return wade.getFullPathAndFileName(this._imageName)
};
Animation.prototype.getRelativeImageName = function () {
    return this._imageName
};
Animation.prototype.getNumCells = function () {
    return {x: this._numCells.x, y: this._numCells.y}
};
Animation.prototype.play = function (a) {
    if (this._autoResize && this.sprite) {
        var b = this.sprite.getScaleFactor();
        this.sprite.setSize(this._frameSize.x * b.x, this._frameSize.y * b.y)
    }
    this._time = 0;
    this._direction = a && "reverse" == a ? -1 : 1;
    this._playMode = a;
    a = this._currentFrame;
    this._currentFrame = 1 == this._direction ? this._startFrame : this._endFrame;
    a != this._currentFrame && this._updateFrameCenter();
    a = this._playing;
    this._playing = !0;
    this._stopped = !1;
    if (this.sprite && this.name)this.sprite.onAnimationStart(this.name, a)
};
Animation.prototype.stop = function () {
    this._playing = !1;
    this._stopped = !0
};
Animation.prototype.resume = function () {
    this._playing || (this._stopped ? (this._playing = !0, this._stopped = !1) : this.play())
};
Animation.prototype.step = function () {
    this._time += wade.c_timeStep;
    var a = this._currentFrame, b = this._speed * this._time + wade.c_epsilon - 0.5, c = Math.round(b);
    this._frameFraction = b - c + 0.5;
    this._currentFrame = 1 == this._direction ? c + this._startFrame : this._endFrame - c;
    if (a != this._currentFrame) {
        if (1 == this._direction) {
            if (this._currentFrame > this._endFrame)if ("ping-pong" == this._playMode)this._currentFrame = this._endFrame, this._direction = -1, this._time = 0; else if (this._looping)this._currentFrame = this._startFrame, this._time -=
                (this._endFrame - this._startFrame + 1) / this._speed; else if (this._currentFrame = this._endFrame, this._playing = !1, this._time = 0, this.sprite && this.name)this.sprite.onAnimationEnd(this.name)
        } else if (this._currentFrame < this._startFrame)if (this._looping)"ping-pong" == this._playMode ? (this._currentFrame = this._startFrame, this._direction = 1, this._time = 0) : (this._currentFrame = this._endFrame, this._time -= (this._endFrame - this._startFrame + 1) / this._speed); else if (this._currentFrame = this._startFrame, this._playing = !1, this._time =
                0, this.sprite && this.name)this.sprite.onAnimationEnd(this.name);
        this._updateFrameCenter();
        this.sprite && this.sprite.isVisible() && this.sprite.getSceneObject() && this.sprite.getSceneObject().isInScene() && this.sprite.setDirtyArea()
    }
};
Animation.prototype.isPlaying = function () {
    return this._playing
};
Animation.prototype.setBlending = function (a) {
    "undefined" == typeof a && (a = !0);
    this.draw = a ? this._drawBlended : this._drawSingle;
    this._blending = a
};
Animation.prototype.clone = function () {
    var a = new Animation;
    jQuery.extend(a, this);
    a.sprite = 0;
    window.Float32Array && (a._f32AnimFrameInfo = this._f32AnimFrameInfo ? new Float32Array([this._f32AnimFrameInfo[0], this._f32AnimFrameInfo[1], this._f32AnimFrameInfo[2], this._f32AnimFrameInfo[3]]) : new Float32Array([0, 0, 1, 1]), a._f32PositionAndSize = this._f32PositionAndSize ? new Float32Array([this._f32PositionAndSize[0], this._f32PositionAndSize[1], this._f32PositionAndSize[2], this._f32PositionAndSize[3]]) : new Float32Array([0,
        0, 1, 1]), a._f32RotationAlpha = this._f32RotationAlpha ? new Float32Array([this._f32RotationAlpha[0], this._f32RotationAlpha[1]]) : new Float32Array([0, 0]));
    return a
};
Animation.prototype.serialize = function (a, b) {
    var c = {
        type: "Animation",
        name: this.name,
        startFrame: this._startFrame,
        endFrame: this._endFrame,
        numCells: {x: this._numCells.x, y: this._numCells.y},
        image: this._imageName,
        speed: this._speed,
        looping: this._looping,
        blending: this._blending,
        playMode: this._playMode,
        autoResize: this._autoResize,
        offset: {x: this._offset.x, y: this._offset.y},
        stopped: this._stopped,
        properties: {}
    }, d = ["name", "sprite", "isDefault"];
    b && (d = d.concat(b));
    for (var e in this)if (this.hasOwnProperty(e) && "_" !=
        e[0] && -1 == d.indexOf(e))try {
        var f = JSON.stringify(this[e]);
        c.properties[e] = JSON.parse(f)
    } catch (g) {
    }
    return a ? JSON.stringify(c) : c
};
Animation.prototype.setFrameNumber = function (a) {
    a != this._currentFrame && (this._currentFrame = a, this._updateFrameCenter(), this.sprite && this.sprite.setDirtyArea())
};
Animation.prototype.getFrameNumber = function () {
    return this._currentFrame
};
Animation.prototype.getFrameCount = function () {
    return this._endFrame - this._startFrame + 1
};
Animation.prototype.setOffset = function (a) {
    this._offset.x = a.x;
    this._offset.y = a.y;
    this.sprite && this.sprite.updateBoundingBox()
};
Animation.prototype.getOffset = function () {
    return {x: this._offset.x, y: this._offset.y}
};
Animation.prototype.getOffset_ref = function () {
    return this._offset
};
Animation.prototype.refreshImage = function () {
    this._image = wade.getImage(this._imageName);
    this._frameSize = {x: this._image.width / this._numCells.x, y: this._image.height / this._numCells.y};
    this._f32AnimFrameInfo && (this._f32AnimFrameInfo[2] = 1 / this._numCells.x, this._f32AnimFrameInfo[3] = 1 / this._numCells.y);
    this._updateFrameCenter();
    if (this._autoResize && this.sprite) {
        var a = this.sprite.getScaleFactor();
        this.sprite.setSize(this._frameSize.x * a.x, this._frameSize.y * a.y)
    }
};
Animation.prototype._drawSingle = function (a, b, c) {
    wade.numDrawCalls++;
    a.drawImage(this._image, this._frameCenter.x, this._frameCenter.y, this._frameSize.x, this._frameSize.y, b.x - c.x / 2 + this._offset.x, b.y - c.y / 2 + this._offset.y, c.x, c.y)
};
Animation.prototype._drawBlended = function (a, b, c) {
    var d = 0 < this._frameFraction ? this._currentFrame + this._direction : this._currentFrame - this._direction;
    if (d < this._startFrame) {
        if ("ping-pong" == this._playMode || !this._looping) {
            this._drawSingle(a, b, c);
            return
        }
        d = this._endFrame
    } else if (d > this._endFrame) {
        if ("ping-pong" == this._playMode || !this._looping) {
            this._drawSingle(a, b, c);
            return
        }
        d = this._startFrame
    }
    var e = d % this._numCells.x * this._frameSize.x, d = Math.floor(d / this._numCells.x) * this._frameSize.y;
    wade.numDrawCalls +=
        2;
    var f = a.globalAlpha, g = a.globalCompositeOperation;
    a.globalAlpha = f * (1 - this._frameFraction);
    var i = b.x - c.x / 2 + this._offset.x, b = b.y - c.y / 2 + this._offset.y;
    a.drawImage(this._image, this._frameCenter.x, this._frameCenter.y, this._frameSize.x, this._frameSize.y, i, b, c.x, c.y);
    a.globalCompositeOperation = "lighter";
    a.globalAlpha = f * this._frameFraction;
    a.drawImage(this._image, e, d, this._frameSize.x, this._frameSize.y, i, b, c.x, c.y);
    a.globalAlpha = f;
    a.globalCompositeOperation = g;
    this.sprite && this.sprite.isVisible() && this.sprite.getSceneObject() &&
    this.sprite.getSceneObject().isInScene() && this.sprite.setDirtyArea()
};
Animation.prototype.draw = Animation.prototype._drawSingle;
Animation.prototype.draw_gl = function (a, b, c) {
    a.isWebGl ? (wade.numDrawCalls++, a.uniform4fv(a.uniforms.uPositionAndSize, b), a.uniform4fv(a.uniforms.uAnimFrameInfo, this._f32AnimFrameInfo), a.uniform2fv(a.uniforms.uRotationAlpha, c), a.setTextureImage(this._image), a.drawArrays(a.TRIANGLE_STRIP, 0, 4)) : this.draw(a, {
        x: b[0],
        y: b[1]
    }, {x: b[2], y: b[3]})
};
Animation.prototype._updateFrameCenter = function () {
    var a = this._currentFrame % this._numCells.x, b = Math.floor(this._currentFrame / this._numCells.x);
    this._frameCenter.x = a * this._frameSize.x;
    this._frameCenter.y = b * this._frameSize.y;
    this._f32AnimFrameInfo && (this._f32AnimFrameInfo[0] = a / this._numCells.x, this._f32AnimFrameInfo[1] = b / this._numCells.y)
};
Animation.prototype.mirror = function () {
    this._f32AnimFrameInfo[2] *= -1
};
Animation.prototype.flip = function () {
    this._f32AnimFrameInfo[3] *= -1
};
function AssetLoader() {
    this.loadingStatus = [];
    this.loadedImages = [];
    this.loadedAudio = [];
    this.loadedJson = [];
    this.loadedScripts = [];
    this.loadedFonts = [];
    this.attemptsCount = [];
    this.maxAttempts = 5;
    this.loadingRequests = {scripts: 0, json: 0, images: 0, audio: 0, fonts: 0};
    this.loadingSuccess = {scripts: 0, json: 0, images: 0, audio: 0, fonts: 0};
    this.loadingErrors = {scripts: 0, json: 0, images: 0, audio: 0, fonts: 0};
    this.loadingFailed = {scripts: 0, json: 0, images: 0, audio: 0, fonts: 0};
    this.init = function (a, b) {
        if (b) {
            var c = !1;
            try {
                window.AudioContext =
                    window.AudioContext || window.webkitAudioContext, this.audioContext = new AudioContext, c = XMLHttpRequest && "string" === typeof(new XMLHttpRequest).responseType
            } catch (d) {
            }
            !c && !a && wade.log("Warning: the WebAudio API is not supported by this browser. Audio functionality will be limited");
            var e;
            window.Audio && (e = new Audio) ? this.audioExtension = e.canPlayType("audio/ogg; codecs=vorbis") ? "ogg" : "aac" : wade.log("Warning: Unable to initialise audio.")
        }
    };
    this.updateAttempts = function (a, b) {
        this.attemptsCount[a] ? this.attemptsCount[a]++ :
            (this.attemptsCount[a] = 1, this.loadingRequests[b]++)
    };
    this.loadScript = function (a, b, c, d, e) {
        if ("loading" != this.loadingStatus[a] || c) {
            if ("ok" == this.loadingStatus[a] || "loading" == this.loadingStatus[a]) {
                if (!c) {
                    "ok" == this.loadingStatus[a] && (!e && eval.call(window, this.loadedScripts[a]), b && b(this.loadedScripts[a]));
                    return
                }
                this.attemptsCount[a] = 0
            }
            this.loadingStatus[a] = "loading";
            this.updateAttempts(a, "scripts");
            a = {
                cache: c ? !1 : !0,
                type: "GET",
                url: a,
                dataType: "script",
                timeout: 15E3,
                success: this.scriptLoaded(a, b, !e),
                error: this.scriptLoadingError(a,
                    b, c, d),
                converters: {
                    "text script": function (a) {
                        return a
                    }
                }
            };
            $.ajax(a)
        }
    };
    this.loadJson = function (a, b, c, d, e) {
        if ("ok" == this.loadingStatus[a] || "loading" == this.loadingStatus[a]) {
            if (!d) {
                "ok" == this.loadingStatus[a] && (b && (b.data = this.loadedJson[a]), c && c(this.loadedJson[a]));
                return
            }
            this.attemptsCount[a] = 0
        }
        this.loadingStatus[a] = "loading";
        this.updateAttempts(a, "json");
        $.ajax({
            cache: d ? !1 : !0,
            type: "GET",
            url: a,
            dataType: "json",
            timeout: 15E3,
            success: this.jsonLoaded(a, b, c),
            error: this.jsonLoadingError(a, b, c, d, e)
        })
    };
    this.loadAppScript =
        function (a, b) {
            this.updateAttempts(a, "scripts");
            $.ajax({
                cache: b ? !1 : !0,
                type: "GET",
                url: a,
                dataType: "script",
                timeout: 15E3,
                success: this.appLoaded(a),
                error: this.appLoadingError(a)
            })
        };
    this.loadImage = function (a, b, c) {
        if ("ok" == this.loadingStatus[a])b && b(); else if ("loading" == this.loadingStatus[a])this.loadedImages[a] && this.loadedImages[a].callbackIsSet && b && wade.log("Warning: conflicting callbacks for the load event of image " + a); else {
            this.loadingStatus[a] = "loading";
            this.updateAttempts(a, "images");
            var d = new Image;
            this.loadedImages[a] = d;
            d.loadListener = this.imageLoaded(a, b);
            d.errorListener = this.imageLoadingError(a, b, c);
            d.addEventListener("load", d.loadListener, !1);
            d.addEventListener("error", d.errorListener, !1);
            d.callbackIsSet = b ? 1 : 0;
            d.src = a
        }
    };
    this.unloadImage = function (a) {
        if ("ok" != this.loadingStatus[a])return !1;
        var b = this.loadedImages[a];
        b.removeEventListener("load", b.loadListener);
        b.removeEventListener("error", b.errorListener);
        b.src ? b.src = "data:image/gif;base64,R0lGODlhAQABAIAAAP7//wAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==" :
            b.width = b.height = 1;
        if (b = wade.getImageUsers(a))for (var c = 0; c < b.length; c++)b[c].onImageUnloaded && b[c].onImageUnloaded(a);
        wade.removeAllImageUsers(a);
        this.loadedImages[a] = null;
        this.loadingStatus[a] = "";
        this.attemptsCount[a] = 0;
        return !0
    };
    this.releaseImageReference = function (a) {
        "ok" == this.loadingStatus[a] && (this.loadedImages[a] = null, this.loadingStatus[a] = "", this.attemptsCount[a] = 0)
    };
    this.unloadAllImages = function () {
        for (var a in this.loadedImages)this.loadedImages.hasOwnProperty(a) && this.unloadImage(a)
    };
    this.imageLoaded =
        function (a, b) {
            var c = this;
            return function () {
                c.loadingSuccess.images++;
                c.loadingStatus[a] = "ok";
                window.wade && wade.setImage(a, c.loadedImages[a]);
                c.handleLoadingCallback(b)
            }
        };
    this.imageLoadingError = function (a, b, c) {
        var d = this;
        return function () {
            d.loadingErrors.images++;
            d.loadingStatus[a] = "error";
            d.attemptsCount[a] < d.maxAttempts ? (c ? c() : wade.log("Unable to load image " + a), d.loadingFailed.images++) : d.loadImage(a, b, c)
        }
    };
    this.setImage = function (a, b) {
        b.imageName = a;
        (this.loadedImages[a] = b) && (this.loadingStatus[a] =
            "ok")
    };
    this.setJson = function (a, b) {
        (this.loadedJson[a] = b) && (this.loadingStatus[a] = "ok")
    };
    this.setAudio = function (a, b) {
        (this.loadedAudio[a] = b) && (this.loadingStatus[a] = "ok")
    };
    this.setScript = function (a, b) {
        wade.isDebugMode() && -1 == b.indexOf("//# sourceURL") && (b += "\n//# sourceURL=" + a);
        (this.loadedScripts[a] = b) && (this.loadingStatus[a] = "ok")
    };
    this.setFont = function (a, b) {
        if (this.loadedFonts[a] = b)if (this.loadingStatus[a] = "ok", !document.getElementById("__wade_font_" + a)) {
            var c = Math.max(a.lastIndexOf("/"), a.lastIndexOf("\\")) +
                1, c = a.substr(c, a.lastIndexOf(".") - c), d = document.createElement("style");
            d.id = "__wade_font_" + a;
            d.appendChild(document.createTextNode("@font-face {font-family: '" + c + "';src: url('" + b + "') format('woff');}"));
            document.head.appendChild(d)
        }
    };
    this.jsonLoaded = function (a, b, c) {
        var d = this;
        return function (e) {
            d.loadingSuccess.json++;
            d.loadingStatus[a] = "ok";
            d.loadedJson[a] = e;
            window.wade && wade.setJson(a, d.loadedJson[a]);
            b && (b.data = e);
            d.handleLoadingCallback(c, d.loadedJson[a])
        }
    };
    this.scriptLoaded = function (a, b, c) {
        var d =
            this;
        return function (e) {
            d.loadingSuccess.scripts++;
            d.loadingStatus[a] = "ok";
            d.loadedScripts[a] = e;
            window.wade && wade.setScript(a, d.loadedScripts[a]);
            c && eval.call(window, e);
            d.handleLoadingCallback(b)
        }
    };
    this.scriptLoadingError = function (a, b, c, d) {
        var e = this;
        return function () {
            e.loadingErrors.scripts++;
            e.loadingStatus[a] = "error";
            e.attemptsCount[a] < e.maxAttempts ? (d ? d() : wade.log("Unable to load script " + a), e.loadingFailed.scripts++) : e.loadScript(a, b, c, d)
        }
    };
    this.jsonLoadingError = function (a, b, c, d, e) {
        var f = this;
        return function () {
            f.loadingErrors.json++;
            f.loadingStatus[a] = "error";
            f.attemptsCount[a] < f.maxAttempts ? (e ? e() : wade.log("Unable to load json file " + a), f.loadingFailed.json++) : f.loadJson(a, b, c, d, e)
        }
    };
    this.appLoaded = function (a) {
        var b = this;
        return function () {
            b.loadingSuccess.scripts++;
            b.loadingStatus[a] = "ok";
            wade.instanceApp()
        }
    };
    this.appLoadingError = function (a) {
        var b = this;
        return function () {
            b.loadingErrors.scripts++;
            b.loadingStatus[a] = "error";
            b.attemptsCount[a] < b.maxAttempts ? (alert("Unable to load main app script " +
            a), b.loadingFailed.scripts++) : b.loadAppScript(a)
        }
    };
    this.loadAudio = function (a, b, c, d, e) {
        this.updateAttempts(a, "audio");
        var f = a.substr(a.length - 3).toLowerCase(), g = a;
        if (f != this.audioExtension && ("aac" == f || "ogg" == f))g = a.substr(0, a.length - 3) + this.audioExtension;
        if (this.audioContext) {
            var i = this, l = new XMLHttpRequest;
            l.open("GET", g, !0);
            l.responseType = "arraybuffer";
            l.timeout = 6E4;
            l.onload = function () {
                i.audioContext.decodeAudioData(l.response, function (e) {
                    i.loadedAudio[a] = e;
                    i.audioLoaded(a, d)();
                    b && wade.playAudio(a,
                        c)
                }, i.audioLoadingError(a, b, c, d, e))
            };
            l.send()
        } else f = new Audio, f.autoplay = b, f.loop = c, f.name = a, f.addEventListener("canplaythrough", this.audioLoaded(a, d), !1), f.addEventListener("error", this.audioLoadingError(a, b, c, d, e), !1), c && f.addEventListener("ended", function () {
            this.currentTime = 0;
            this.play()
        }, !1), f.src = g, f.load(), this.loadedAudio[a] = f
    };
    this.unloadAudio = function (a) {
        if ("ok" != this.loadingStatus[a])return !1;
        this.loadedAudio[a] = null;
        this.loadingStatus[a] = "";
        this.attemptsCount[a] = 0;
        return !0
    };
    this.unloadAllAudio =
        function () {
            for (var a in this.loadedAudio)this.loadedAudio.hasOwnProperty(a) && this.unloadAudio(a)
        };
    this.audioLoaded = function (a, b) {
        var c = this;
        return function () {
            "ok" != c.loadingStatus[a] && (c.loadingSuccess.audio++, window.wade && wade.setAudio(a, c.loadedAudio[a]), c.loadingStatus[a] = "ok", c.handleLoadingCallback(b))
        }
    };
    this.audioLoadingError = function (a, b, c, d, e) {
        var f = this;
        return function () {
            f.loadingErrors.audio++;
            f.loadingStatus[a] = "error";
            f.attemptsCount[a] < f.maxAttempts ? (e ? e() : wade.log("Unable to load audio " +
            a), f.loadingFailed.audio++) : f.loadAudio(a, b, c, d, e)
        }
    };
    this.isFinishedLoading = function () {
        return this.loadingRequests.scripts == this.loadingSuccess.scripts + this.loadingFailed.scripts && this.loadingRequests.json == this.loadingSuccess.json + this.loadingFailed.json && this.loadingRequests.images == this.loadingSuccess.images + this.loadingFailed.images && this.loadingRequests.audio == this.loadingSuccess.audio + this.loadingFailed.audio && this.loadingRequests.fonts == this.loadingSuccess.fonts + this.loadingFailed.fonts
    };
    this.getPercentageComplete =
        function () {
            return 100 * (this.loadingSuccess.scripts + this.loadingSuccess.json + this.loadingSuccess.images + this.loadingSuccess.audio) / (this.loadingRequests.scripts + this.loadingRequests.json + this.loadingRequests.images + this.loadingRequests.audio)
        };
    this.getImage = function (a, b) {
        if ("ok" == this.loadingStatus[a])return this.loadedImages[a];
        "undefined" == typeof b && (b = "Warning: Trying to get image " + a + " without loading it first");
        b && wade.log(b);
        return wade.getImage()
    };
    this.getJson = function (a) {
        if ("ok" == this.loadingStatus[a])return this.loadedJson[a];
        wade.log("Warning: Trying to get JSON data " + a + " without loading it first");
        return {}
    };
    this.getAudio = function (a) {
        if ("ok" == this.loadingStatus[a])return this.loadedAudio[a];
        wade.log("Warning: Trying to get audio " + a + " without loading it first");
        return new Audio
    };
    this.getScript = function (a) {
        if ("ok" == this.loadingStatus[a])return this.loadedScripts[a];
        wade.log("Warning: Trying to get script " + a + " without loading it first");
        return ""
    };
    this.getFont = function (a) {
        if ("ok" == this.loadingStatus[a])return this.loadedFonts[a];
        wade.log("Warning: Trying to get font " + a + " without loading it first");
        return ""
    };
    this.getLoadingStatus = function (a) {
        return (a = this.loadingStatus[a]) ? a : "unknown"
    };
    this.setGlobalCallback = function (a) {
        a && this.isFinishedLoading() ? (a(), this.globalCallback = 0) : this.globalCallback = a
    };
    this.handleLoadingCallback = function (a, b) {
        a && a(b);
        this.globalCallback && this.isFinishedLoading() && (this.globalCallback(), this.setGlobalCallback(0))
    };
    this.getWebAudioContext = function () {
        return this.audioContext
    };
    this.loadFont = function (a,
                              b, c) {
        if ("ok" == this.loadingStatus[a])b && b(); else if ("loading" != this.loadingStatus[a]) {
            this.loadingStatus[a] = "loading";
            this.updateAttempts(a, "fonts");
            var d = Math.max(a.lastIndexOf("/"), a.lastIndexOf("\\")) + 1, e = a.substr(d, a.lastIndexOf(".") - d), d = new XMLHttpRequest;
            d.open("GET", a, !0);
            d.responseType = "blob";
            var f = this;
            d.onload = function () {
                if (this.status && 200 != this.status || !this.response)f.fontLoadingError(a, b, c); else {
                    var d = this.response, i = new FileReader;
                    i.onloadend = function () {
                        var d = document.createElement("style");
                        d.id = "__wade_font_" + e;
                        d.appendChild(document.createTextNode("@font-face {font-family: '" + e + "';src: url('" + i.result + "') format('woff');}"));
                        document.head.appendChild(d);
                        var g = document.createElement("span");
                        g.innerHTML = "giItT1WQy@!-/#";
                        g.style.position = "absolute";
                        g.style.left = "-10000px";
                        g.style.top = "-10000px";
                        g.style.fontSize = "300px";
                        g.style.fontFamily = "sans-serif";
                        g.style.fontVariant = "normal";
                        g.style.fontStyle = "normal";
                        g.style.fontWeight = "normal";
                        g.style.letterSpacing = "0";
                        document.body.appendChild(g);
                        var h = g.offsetWidth;
                        g.style.fontFamily = e;
                        var m, n = 0, d = function () {
                            if (g && g.offsetWidth != h)return g.parentNode.removeChild(g), g = null, clearInterval(m), f.loadedFonts[a] = i.result, f.fontLoaded(a, b)(), !0;
                            if (15E3 < (n += 50))clearInterval(m), f.fontLoadingError(a, b, c)();
                            return !1
                        };
                        d() || (m = setInterval(d, 50))
                    };
                    i.readAsDataURL(d)
                }
            };
            d.send()
        }
    };
    this.fontLoaded = function (a, b) {
        var c = this;
        return function () {
            "ok" != c.loadingStatus[a] && (c.loadingSuccess.fonts++, c.loadingStatus[a] = "ok", window.wade && wade.setFont(a, c.loadedFonts[a]),
                c.handleLoadingCallback(b))
        }
    };
    this.fontLoadingError = function (a, b, c) {
        var d = this;
        return function () {
            d.loadingErrors.fonts++;
            d.loadingStatus[a] = "error";
            d.attemptsCount[a] < d.maxAttempts ? (c ? c() : wade.log("Unable to load font " + a), d.loadingFailed.fonts++) : d.loadFont(a, b, c)
        }
    }
}
function InputManager() {
    var a = this, b = 0, c = 0, d, e = [], f = [], g = [], i = [], l = [], j = 5, h = {}, m = [], n = [], p = [], t = "", r = !1, z = !1, y = !0, u = 1, s = 3, A, D = {}, C = function (a, b) {
        "string" == typeof b && (b = document.getElementById(b));
        if (null == b)return {x: 0, y: 0};
        var c;
        c = (c = a) ? c : window.event;
        c = isNaN(window.scrollX) ? {
            x: document.documentElement.scrollLeft + document.body.scrollLeft + c.clientX,
            y: document.documentElement.scrollTop + document.body.scrollTop + c.clientY
        } : {x: window.scrollX + c.clientX, y: window.scrollY + c.clientY};
        c.x -= b.offsetLeft + b.clientLeft +
        b.clientWidth / 2;
        c.y -= b.offsetTop + b.clientTop + b.clientHeight / 2;
        c.x *= b.getAttribute("width") / b.clientWidth;
        c.y *= b.getAttribute("height") / b.clientHeight;
        if (wade.isScreenRotated()) {
            var d = c.y;
            c.y = -c.x;
            c.x = d
        }
        return c
    }, q = function (a) {
        y && (a = a ? a : window.event, a.stopPropagation && a.stopPropagation(), a.preventDefault && a.preventDefault(), a.returnValue = !1, a.cancel = !0, a.cancelBubble = !0)
    };
    this.init = function () {
        if (!z) {
            A = wade.getContainerName();
            var a = document.getElementById(A);
            a.addEventListener("mousedown", this.event_mouseDown);
            window.addEventListener("mouseup", this.event_mouseUp);
            a.addEventListener("mousemove", this.event_mouseMove);
            a.addEventListener("mousewheel", this.event_mouseWheel);
            a.addEventListener("click", this.noEvent);
            a.addEventListener("dblclick", this.noEvent);
            a.addEventListener("contextmenu", this.noEvent);
            a.addEventListener("DOMMouseScroll", this.event_mouseWheel);
            window.addEventListener("touchstart", this.event_touchStart);
            window.addEventListener("touchend", this.event_touchEnd);
            window.addEventListener("touchmove",
                this.event_touchMove);
            window.addEventListener("keydown", this.event_keyDown);
            window.addEventListener("keyup", this.event_keyUp);
            window.addEventListener("keypress", this.event_keyPress);
            window.addEventListener("blur", this.event_blur);
            window.addEventListener("focus", this.event_focus);
            navigator.msPointerEnabled && (a.addEventListener("MSPointerDown", this.event_pointerDown), a.addEventListener("MSPointerMove", this.event_pointerMove), a.addEventListener("MSPointerUp", this.event_pointerUp));
            window.tizen && (window.addEventListener("tizenhwkey",
                function (a) {
                    "back" == a.keyName && tizen.application.getCurrentApplication().exit()
                }), window.onblur = function () {
                wade.deleteCanvases()
            }, window.onfocus = function () {
                wade.recreateCanvases()
            });
            window.DeviceOrientationEvent && window.addEventListener("deviceorientation", this.event_deviceOrientation, !1);
            window.DeviceMotionEvent && window.addEventListener("devicemotion", this.event_deviceMotion, !1);
            z = !0
        }
    };
    this.deinit = function () {
        if (z) {
            var a = document.getElementById(A);
            a.removeEventListener("mousedown", this.event_mouseDown);
            window.removeEventListener("mouseup", this.event_mouseUp);
            a.removeEventListener("mousemove", this.event_mouseMove);
            a.removeEventListener("mousewheel", this.event_mouseWheel);
            a.removeEventListener("click", this.noEvent);
            a.removeEventListener("dblclick", this.noEvent);
            a.removeEventListener("contextmenu", this.noEvent);
            a.removeEventListener("DOMMouseScroll", this.event_mouseWheel);
            window.removeEventListener("touchstart", this.event_touchStart);
            window.removeEventListener("touchend", this.event_touchEnd);
            window.removeEventListener("touchmove",
                this.event_touchMove);
            window.removeEventListener("keydown", this.event_keyDown);
            window.removeEventListener("keyup", this.event_keyUp);
            window.removeEventListener("keypress", this.event_keyPress);
            window.removeEventListener("blur", this.event_blur);
            window.removeEventListener("focus", this.event_focus);
            navigator.msPointerEnabled && (a.removeEventListener("MSPointerDown", this.event_pointerDown), a.removeEventListener("MSPointerMove", this.event_pointerMove), a.removeEventListener("MSPointerUp", this.event_pointerUp));
            window.tizen && (window.removeEventListener("tizenhwkey"), window.onblur = window.onfocus = null);
            window.DeviceOrientationEvent && window.removeEventListener("deviceorientation", this.event_deviceOrientation);
            window.DeviceMotionEvent && window.removeEventListener("deviceorientation", this.event_deviceMotion);
            z = !1
        }
    };
    this.enableGamepads = function (a) {
        "undefined" == typeof a && (a = !0);
        if (a)if (wade.areGamepadsSupported()) {
            var b = navigator.getGamepads || navigator.webkitGetGamepads;
            wade.setMainLoopCallback(function () {
                for (var a =
                    b.call(navigator), c = 0; c < a.length; c++) {
                    var d = a[c];
                    n[c] || (n[c] = []);
                    if (d)for (var e = 0; e < d.buttons.length; e++) {
                        if (d.buttons[e] != (n[c][e] || 0)) {
                            var g = d.buttons[e] ? "onGamepadButtonDown" : "onGamepadButtonUp", f = {
                                gamepadIndex: d.index,
                                gamepadId: d.id,
                                button: e
                            };
                            wade.app && wade.isAppInitialized() && !wade.processEvent(g, f) && wade.app[g] && wade.app[g](f)
                        }
                        n[c][e] = d.buttons[e]
                    }
                }
                m = a
            }, "__wade_gamepads")
        } else wade.log("Warning - Gamepads aren't supported in this browser"); else wade.setMainLoopCallback(null, "__wade_gamepads")
    };
    this.getGamepadData = function () {
        return m
    };
    this.event_mouseDown = function (c) {
        var k = {screenPosition: C(c, A)};
        if (Math.abs(k.screenPosition.x) > wade.getScreenWidth() / 2 || Math.abs(k.screenPosition.y) > wade.getScreenHeight() / 2)return !1;
        a._setLastMousePosition(k.screenPosition.x, k.screenPosition.y);
        var w = (new Date).getTime();
        if (!r && f.mouseDown && e.mouseDown && w - e.mouseDown < f.mouseDown || !r && f.mouseUp && e.mouseUp && w - e.mouseUp < f.mouseUp)return !1;
        if (r || !b) {
            b = r ? b + 1 : !0;
            l.push({x: k.screenPosition.x, y: k.screenPosition.y});
            k.button = c.button;
            d = c;
            if (wade.app && (wade.isAppInitialized() && !wade.processEvent("onMouseDown", k)) && wade.app.onMouseDown)wade.app.onMouseDown(k);
            q(c);
            e.mouseDown = w;
            p.length = 0;
            t = "";
            p.push({x: k.screenPosition.x, y: k.screenPosition.y})
        }
        return !1
    };
    this.event_mouseUp = function (c) {
        var k = {screenPosition: C(c, A)};
        if (Math.abs(k.screenPosition.x) > wade.getScreenWidth() / 2 || Math.abs(k.screenPosition.y) > wade.getScreenHeight() / 2)return !1;
        a._setLastMousePosition(k.screenPosition.x, k.screenPosition.y);
        var w = (new Date).getTime();
        if (!r && f.mouseUp && e.mouseUp && w - e.mouseUp < f.mouseUp)return !1;
        if (r || b) {
            b = r ? b - 1 : !1;
            k.button = c.button;
            d = c;
            if (l.length) {
                for (var g = 0; g < l.length; g++) {
                    var u = k.screenPosition.x - l[g].x, i = k.screenPosition.y - l[g].y;
                    if (u * u + i * i <= j * j) {
                        a.event_click(k);
                        break
                    }
                }
                l.length--
            }
            if (wade.app && (wade.isAppInitialized() && !wade.processEvent("onMouseUp", k)) && wade.app.onMouseUp)wade.app.onMouseUp(k);
            !e.mouseUp && (navigator && navigator.userAgent.match(/(iPod|iPhone|iPad)/) && navigator.userAgent.match(/AppleWebKit/)) && wade.playSilentSound();
            q(c);
            e.mouseUp = w;
            p.length = 0;
            t = ""
        }
        return !1
    };
    this.event_mouseMove = function (b) {
        var k = {screenPosition: C(b, A)};
        if (Math.abs(k.screenPosition.x) > wade.getScreenWidth() / 2 || Math.abs(k.screenPosition.y) > wade.getScreenHeight() / 2)return !1;
        a._setLastMousePosition(k.screenPosition.x, k.screenPosition.y);
        var c = (new Date).getTime();
        if (!r && f.mouseMove && e.mouseMove && c - e.mouseMove < f.mouseMove)return !1;
        d = b;
        if (wade.app && (wade.isAppInitialized() && !wade.processEvent("onMouseMove", k)) && wade.app.onMouseMove)wade.app.onMouseMove(k);
        e.mouseMove = c;
        q(b);
        a.isMouseDown() && (p.push({x: k.screenPosition.x, y: k.screenPosition.y}), a.detectGestures())
    };
    this.event_mouseWheel = function (b) {
        var b = b ? b : window.event, k = {screenPosition: C(b, A)};
        if (Math.abs(k.screenPosition.x) > wade.getScreenWidth() / 2 || Math.abs(k.screenPosition.y) > wade.getScreenHeight() / 2)return !1;
        a._setLastMousePosition(k.screenPosition.x, k.screenPosition.y);
        var c = (new Date).getTime();
        if (r || !f.mouseWheel || !(e.mouseWheel && c - e.mouseWheel < f.mouseWheel)) {
            k.value = b.detail ? -1 * b.detail : b.wheelDelta /
            40;
            d = k;
            if (wade.app && (wade.isAppInitialized() && !wade.processEvent("onMouseWheel", k)) && wade.app.onMouseWheel)wade.app.onMouseWheel(k);
            e.mouseWheel = c;
            q(b)
        }
    };
    this.event_click = function (a) {
        var b = (new Date).getTime();
        if (r || !f.onClick || !(e.onClick && b - e.onClick < f.onClick)) {
            if (wade.app && (wade.isAppInitialized() && !wade.processEvent("onClick", a)) && wade.app.onClick)wade.app.onClick(a);
            e.onClick = b
        }
    };
    this.event_touchStart = function (b) {
        var k = b.touches || i;
        if (2 == k.length) {
            var d = k[0].pageX - k[1].pageX, e = k[0].pageY - k[1].pageY;
            c = Math.sqrt(d * d + e * e);
            r && a.event_mouseDown(k[1])
        } else 1 == k.length ? a.event_mouseDown(k[0]) : r && a.event_mouseDown(k[k.length - 1]);
        q(b)
    };
    this.event_touchEnd = function (b) {
        if (b.changedTouches && b.changedTouches.length)for (var k = 0; k < b.changedTouches.length; k++)a.event_mouseUp(b.changedTouches[k]); else a.event_mouseUp(d);
        q(b)
    };
    this.event_touchMove = function (b) {
        var k;
        k = b.touches || i;
        if (2 == k.length) {
            var d = k[0].pageX - k[1].pageX, e = k[0].pageY - k[1].pageY;
            if (d = Math.sqrt(d * d + e * e))e = c - d, Math.abs(e) > wade.c_epsilon && (e = -30 *
            e / Math.max(wade.getScreenWidth(), wade.getScreenHeight()), a.event_mouseWheel({
                clientX: k[0].pageX,
                clientY: k[0].pageY,
                detail: -e
            }));
            c = d;
            if (r && b.changedTouches)for (k = 0; k < b.changedTouches.length; k++)a.event_mouseMove({
                clientX: b.changedTouches[k].pageX,
                clientY: b.changedTouches[k].pageY
            })
        } else if (1 == k.length)a.event_mouseMove({
            clientX: k[0].pageX,
            clientY: k[0].pageY
        }); else if (r && b.changedTouches)for (k = 0; k < b.changedTouches.length; k++)a.event_mouseMove({
            clientX: b.changedTouches[k].pageX,
            clientY: b.changedTouches[k].pageY
        });
        q(b)
    };
    this.event_keyDown = function (a) {
        var b = {
            keyCode: "which"in a ? a.which : a.keyCode,
            shift: a.shiftKey,
            ctrl: a.ctrlKey,
            alt: a.altKey,
            meta: a.metaKey
        };
        D[b.keyCode] = !0;
        wade.app && wade.isAppInitialized() && !wade.processEvent("onKeyDown", b) ? wade.app.onKeyDown && wade.app.onKeyDown(b) && q(a) : q(a)
    };
    this.event_keyUp = function (a) {
        var b = {
            keyCode: "which"in a ? a.which : a.keyCode,
            shift: a.shiftKey,
            ctrl: a.ctrlKey,
            alt: a.altKey,
            meta: a.metaKey
        };
        D[b.keyCode] = !1;
        wade.app && wade.isAppInitialized() && !wade.processEvent("onKeyUp", b) ? wade.app.onKeyUp &&
        wade.app.onKeyUp(b) && q(a) : q(a)
    };
    this.event_keyPress = function (a) {
        var b = {charCode: "charCode"in a ? a.charCode : a.keyCode};
        wade.app && wade.isAppInitialized() && !wade.processEvent("onKeyPress", b) ? wade.app.onKeyPress && wade.app.onKeyPress(b) && q(a) : q(a)
    };
    this.isKeyDown = function (a) {
        return !!D[a]
    };
    this.event_pointerDown = function (b) {
        g[b.pointerId] || (g[b.pointerId] = 1, i.push({
            pageX: b.pageX,
            pageY: b.pageY,
            clientX: b.clientX,
            clientY: b.clientY,
            pointerId: b.pointerId
        }), a.event_touchStart(b))
    };
    this.event_pointerUp = function (b) {
        if (g[b.pointerId]) {
            for (var k =
                0; k < i.length; k++)if (i[k].pointerId == b.pointerId) {
                wade.removeObjectFromArrayByIndex(k, i);
                break
            }
            g[b.pointerId] = 0;
            a.event_touchEnd({changedTouches: [b]})
        }
    };
    this.event_pointerMove = function (b) {
        if (g[b.pointerId]) {
            for (var k = 0; k < i.length; k++)if (i[k].pointerId == b.pointerId) {
                i[k].pageX = b.pageX;
                i[k].pageY = b.pageY;
                i[k].clientX = b.clientX;
                i[k].clientY = b.clientY;
                b.changedTouches = [i[k]];
                break
            }
            a.event_touchMove(b)
        }
    };
    this.event_deviceMotion = function (a) {
        if (a.acceleration && null !== a.acceleration.x) {
            var b = {
                acceleration: a.acceleration,
                accelerationIncludingGravity: a.accelerationIncludingGravity,
                rotation: a.rotationRate,
                refreshInterval: a.interval
            };
            wade.app && wade.isAppInitialized() && !wade.processEvent("onDeviceMotion", b) ? wade.app.onDeviceMotion && wade.app.onDeviceMotion(b) && q(a) : q(a)
        }
    };
    this.event_deviceOrientation = function (a) {
        if (null !== a.alpha) {
            var b = {alpha: a.alpha, beta: a.beta, gamma: a.gamma};
            wade.app && wade.isAppInitialized() && !wade.processEvent("onDeviceOrientation", b) ? wade.app.onDeviceOrientation && wade.app.onDeviceOrientation(b) &&
            q(a) : q(a)
        }
    };
    this.event_gamepadConnected = function (a) {
        wade.app.onGamepadConnected && wade.app.onGamepadConnected({gamepadId: a.gamepad.id})
    };
    this.event_gamepadDisconnected = function (a) {
        wade.app.onGamepadDisconnected && wade.app.onGamepadDisconnected({gamepadId: a.gamepad.id})
    };
    this.event_blur = function (a) {
        var b = {};
        wade.app && wade.isAppInitialized() && !wade.processEvent("onBlur", b) ? wade.app.onBlur && wade.app.onBlur(b) && q(a) : q(a)
    };
    this.event_focus = function (a) {
        var b = {};
        wade.app && wade.isAppInitialized() && !wade.processEvent("onFocus",
            b) ? wade.app.onFocus && wade.app.onFocus(b) && q(a) : q(a)
    };
    this.noEvent = function (a) {
        q(a)
    };
    this.isMouseDown = function () {
        return !!b
    };
    this.setMinimumIntervalBetweenEvents = function (a, b) {
        f[a] = b
    };
    this.setClickTolerance = function (a) {
        j = a
    };
    this.getMousePosition = function () {
        return {x: h.x, y: h.y}
    };
    this.enableMultitouch = function (a) {
        r = a
    };
    this.isMultitouchEnabled = function () {
        return r
    };
    this.cancelEvents = function (a) {
        "undefined" == typeof a && (a = !0);
        y = a
    };
    this._setLastMousePosition = function (a, b) {
        if (a != h.x || b != h.y)wade.updateMouseInOut(h,
            {x: a, y: b}), h.x = a, h.y = b
    };
    this.detectGestures = function () {
        var a = 0, b = 0, c = 0, d = 0;
        if (!t && p.length < 3 * s) {
            for (var e = 1; e < p.length && !t; e++) {
                var g = p[e].x - p[e - 1].x || wade.c_epsilon, f = p[e].y - p[e - 1].y || wade.c_epsilon, i = g / Math.abs(f), g = f / Math.abs(g);
                -1 > i && Math.abs(g) <= u && ++a == s && !b && !c && !d ? t = "onSwipeLeft" : 1 < i && Math.abs(g) <= u && ++b == s && !a && !c && !d ? t = "onSwipeRight" : -1 > g && Math.abs(i) <= u && ++c == s && !a && !b && !d ? t = "onSwipeUp" : 1 < g && (Math.abs(i) <= u && ++d == s && !a && !c && !b) && (t = "onSwipeDown")
            }
            if (t && (a = p[0], a = {
                    screenPosition: {
                        x: a.x,
                        y: a.y
                    }, screenPositions: p
                }, wade.app && (wade.isAppInitialized() && !wade.processEvent(t, a)) && wade.app[t]))wade.app[t](a)
        }
    };
    this.setSwipeTolerance = function (a, b) {
        u = a;
        s = b
    }
}
function Layer(a, b) {
    this.id = a;
    this._sprites = [];
    this._movingSprites = [];
    this._transform = {scale: 1, translate: 1};
    this._sorting = "none";
    this._dirtyAreas = [];
    this._smoothing = this._clearCanvas = this._needsFullRedraw = !0;
    this._resolutionFactor = wade.getResolutionFactor();
    this._cameraPosition = wade.getCameraPosition();
    this._useQuadtree = !0;
    this._renderMode = b || "2d";
    this._useOffScreenTarget = !1;
    this._updateScaleConversionFactor();
    window.Float32Array && (this._f32ViewportSize = new Float32Array([0, 0]), this._f32CameraScaleTranslate =
        new Float32Array([0, 0, 0]));
    this.createCanvas();
    wade.isDoubleBufferingEnabled() && this.createSecondaryCanvas();
    var c = wade.getScreenWidth() / 2, d = wade.getScreenHeight() / 2;
    this._worldBounds = {minX: -c, minY: -d, maxX: c, maxY: d};
    this._initQuadTree();
    this._isAndroidStockBrowser = 0 <= navigator.userAgent.indexOf("Android") && -1 == navigator.userAgent.indexOf("Firefox") && !(window.chrome && window.chrome.app) && !wade.isWebGlSupported()
}
Layer.prototype.getScaleFactor = function () {
    return this._transform.scale
};
Layer.prototype.getTranslateFactor = function () {
    return this._transform.translate
};
Layer.prototype.setTransform = function (a, b) {
    this._transform.scale = a;
    this._transform.translate = b;
    this._updateScaleConversionFactor();
    this._needsFullRedraw = !0
};
Layer.prototype.getSorting = function () {
    return this._sorting
};
Layer.prototype.setSorting = function (a) {
    if (a != this._sorting) {
        this._sorting = a;
        switch (a) {
            case "bottomToTop":
                this._sortingFunction = this._spriteSorter_bottomToTop;
                break;
            case "topToBottom":
                this._sortingFunction = this._spriteSorter_topToBottom;
                break;
            case "none":
                this._sortingFunction = 0;
                break;
            default:
                this._sortingFunction = a
        }
        this._needsFullSorting = !0
    }
};
Layer.prototype.clearDirtyAreas = function () {
    this._dirtyAreas.length = 0;
    this._needsFullRedraw = !1
};
Layer.prototype.addDirtyArea = function (a) {
    this._dirtyAreas.push({minX: a.minX, maxX: a.maxX, minY: a.minY, maxY: a.maxY})
};
Layer.prototype.addSprite = function (a) {
    this._sprites.push(a);
    a.id = this._sprites.length;
    wade.expandBox(this._worldBounds, a.boundingBox);
    this._useQuadtree && (this.addDirtyArea(a.boundingBox), this._addSpriteToQuadTree(a));
    this._movingSprites.push(a)
};
Layer.prototype.removeSprite = function (a) {
    wade.removeObjectFromArray(a, this._sprites);
    this._useQuadtree && (this.addDirtyArea(a.boundingBox), a.quadTreeNode.removeObject(a), a.quadTreeNode = 0)
};
Layer.prototype.draw = function () {
    var a, b, c;
    if (this._canvas && !(0 == this._dirtyAreas.length && !this._needsFullRedraw && this._useQuadtree)) {
        if (this._isAndroidStockBrowser && this._clearCanvas || !this._useOffScreenTarget)this._needsFullRedraw = !0;
        var d = this._needsFullRedraw && "2d" == this._renderMode && wade.isDoubleBufferingEnabled(), e = d ? this._secondaryContext : this._context;
        this._needsFlipping = d;
        var d = wade.getScreenWidth() * this._resolutionFactor, f = wade.getScreenHeight() * this._resolutionFactor, g = d / 2, i = f / 2;
        if ("none" !=
            this._sorting)if (this._needsFullSorting = this._needsFullSorting || this._movingSprites.length * this._movingSprites.length > this._sprites.length)this._sprites.sort(this._sortingFunction); else for (a = 0; a < this._movingSprites.length; a++) {
            var l = 0, j = this._movingSprites[a];
            for (b = 0; b < this._sprites.length && j != this._sprites[b]; b++);
            if (b < this._sprites.length) {
                for (c = b + 1; c < this._sprites.length; c++)if (0 < this._sortingFunction(j, this._sprites[c]))this._sprites[c].setDirtyArea(), this._sprites[c - 1] = this._sprites[c], this._sprites[c] =
                    j, l++; else break;
                if (!l)for (c = b - 1; 0 <= c; c--)if (0 > this._sortingFunction(j, this._sprites[c]))this._sprites[c].setDirtyArea(), this._sprites[c + 1] = this._sprites[c], this._sprites[c] = j, l++; else break
            }
        }
        this._needsFullSorting = !1;
        this._movingSprites.length = 0;
        l = "webgl" == this._renderMode ? "draw_gl" : "draw";
        "webgl" == this._renderMode && this._useOffScreenTarget && e.bindFramebuffer(e.FRAMEBUFFER, e.mainRenderTarget);
        if (this._useQuadtree) {
            a = this.canvasBoxToWorld({minX: -g, minY: -i, maxX: g, maxY: i});
            this._needsFullRedraw ? (b =
                this._scaleConversionFactor, c = g - this._cameraPosition.x * this._transform.translate * b, j = i - this._cameraPosition.y * this._transform.translate * b, "2d" == this._renderMode ? (e.restore(), e.save(), e.setTransform(b, 0, 0, b, Math.round(c), Math.round(j))) : "webgl" == this._renderMode && (this._f32CameraScaleTranslate[0] = b, this._f32CameraScaleTranslate[1] = this._cameraPosition.x * this._transform.translate * b, this._f32CameraScaleTranslate[2] = this._cameraPosition.y * this._transform.translate * b, e.uniform3fv(e.uniforms.uCameraScaleTranslate,
                this._f32CameraScaleTranslate)), j = wade.cloneObject(a)) : j = this._joinDirtyAreas();
            if (!j) {
                this.clearDirtyAreas();
                return
            }
            for (c = 0; c < this._sprites.length; c++)this._sprites[c].needsDrawing = 0;
            for (c = 0; c.minX != j.minX || c.minY != j.minY || c.maxX != j.maxX || c.maxY != j.maxY;) {
                if (isNaN(j.minX) || isNaN(j.minY) || isNaN(j.maxX) || isNaN(j.maxY)) {
                    wade.log("Warning: some sprites have invalid coordinates, it isn't possible to render this frame");
                    return
                }
                this._quadTree.flagObjects(j, "needsDrawing");
                c = wade.cloneObject(j);
                for (b = 0; b <
                this._sprites.length; b++)this._sprites[b].needsDrawing && this._sprites[b].isVisible() && wade.expandBox(j, this._sprites[b].boundingBox);
                wade.clampBoxToBox(j, a)
            }
            if (this._clearCanvas) {
                var h;
                "2d" == this._renderMode ? (e.save(), e.setTransform(1, 0, 0, 1, 0, 0), this._needsFullRedraw ? e.clearRect(0, 0, Math.round(d), Math.round(f)) : (h = this.worldBoxToCanvas(j), e.clearRect(Math.floor(h.minX + g - 1), Math.floor(h.minY + i - 1), Math.ceil(h.maxX - h.minX + 2), Math.ceil(h.maxY - h.minY + 2))), e.restore()) : "webgl" == this._renderMode && (this._needsFullRedraw ?
                    e.clear(e.COLOR_BUFFER_BIT) : (h = this.worldBoxToCanvas(j), e.enable(e.SCISSOR_TEST), e.scissor(Math.floor(h.minX + g - 1), f - Math.floor(h.minY + i - 1) - Math.ceil(h.maxY - h.minY + 2), Math.ceil(h.maxX - h.minX + 2), Math.ceil(h.maxY - h.minY + 2)), e.clear(e.COLOR_BUFFER_BIT), e.disable(e.SCISSOR_TEST)))
            }
            this.clearDirtyAreas();
            for (a = 0; a < this._sprites.length; a++)if (this._sprites[a].needsDrawing)this._sprites[a][l](e)
        } else {
            b = this._scaleConversionFactor;
            c = g - this._cameraPosition.x * this._transform.translate * b;
            j = i - this._cameraPosition.y *
            this._transform.translate * b;
            "webgl" == this._renderMode ? (e.clear(e.COLOR_BUFFER_BIT), this._f32CameraScaleTranslate[0] = b, this._f32CameraScaleTranslate[1] = this._cameraPosition.x * this._transform.translate * b, this._f32CameraScaleTranslate[2] = this._cameraPosition.y * this._transform.translate * b, e.uniform3fv(e.uniforms.uCameraScaleTranslate, this._f32CameraScaleTranslate)) : "2d" == this._renderMode && (e.save(), e.setTransform(1, 0, 0, 1, 0, 0), e.clearRect(0, 0, Math.round(d), Math.round(f)), e.restore(), e.setTransform(b, 0,
                0, b, Math.round(c), Math.round(j)));
            this.clearDirtyAreas();
            for (a = 0; a < this._sprites.length; a++)this._sprites[a][l](e)
        }
        "webgl" == this._renderMode && this._useOffScreenTarget && (e.blendFuncSeparate(e.ONE, e.ONE_MINUS_SRC_ALPHA, e.ONE, e.ONE_MINUS_SRC_ALPHA), e.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL, !0), this._f32CameraScaleTranslate[0] = 1, this._f32CameraScaleTranslate[1] = 0, this._f32CameraScaleTranslate[2] = 0, e.bindFramebuffer(e.FRAMEBUFFER, null), h ? (e.enable(e.SCISSOR_TEST), e.scissor(Math.floor(h.minX + g - 1),
            f - Math.floor(h.minY + i - 1) - Math.ceil(h.maxY - h.minY + 2), Math.ceil(h.maxX - h.minX + 2), Math.ceil(h.maxY - h.minY + 2)), e.clear(e.COLOR_BUFFER_BIT), e.disable(e.SCISSOR_TEST)) : this._clearCanvas && e.clear(e.COLOR_BUFFER_BIT), e.uniform3fv(e.uniforms.uCameraScaleTranslate, this._f32CameraScaleTranslate), e.uniform4fv(e.uniforms.uPositionAndSize, e.mainRenderTarget.uniformValues.positionAndSize), e.uniform4fv(e.uniforms.uAnimFrameInfo, e.mainRenderTarget.uniformValues.animFrameInfo), e.uniform2fv(e.uniforms.uRotationAlpha,
            e.mainRenderTarget.uniformValues.rotationAlpha), e.bindTexture(e.TEXTURE_2D, e.mainRenderTarget.texture), e.drawArrays(e.TRIANGLE_STRIP, 0, 4), b = this._scaleConversionFactor, this._f32CameraScaleTranslate[0] = b, this._f32CameraScaleTranslate[1] = this._cameraPosition.x * this._transform.translate * b, this._f32CameraScaleTranslate[2] = this._cameraPosition.y * this._transform.translate * b, e.uniform3fv(e.uniforms.uCameraScaleTranslate, this._f32CameraScaleTranslate), e.bindTexture(e.TEXTURE_2D, null), e.currentImage = null,
            e.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL, !1), e.blendFuncSeparate(e.SRC_ALPHA, e.ONE_MINUS_SRC_ALPHA, e.ONE, e.ONE_MINUS_SRC_ALPHA))
    }
};
Layer.prototype.sort = function (a) {
    this._sprites.sort(a || this._sortingFunction);
    this._needsFullRedraw = !0
};
Layer.prototype.onCameraPositionChanged = function (a) {
    if (0 != this._transform.translate && (a.x != this._cameraPosition.x || a.y != this._cameraPosition.y) || 0 != this._transform.scale && a.z != this._cameraPosition.z)this._needsFullRedraw = !0;
    this._cameraPosition = {x: a.x, y: a.y, z: a.z};
    this._updateScaleConversionFactor()
};
Layer.prototype.onSpritePositionChanged = function (a) {
    this._useQuadtree && a.quadTreeNode && (wade.expandBox(this._worldBounds, a.boundingBox), a.quadTreeNode.removeObject(a), this._addSpriteToQuadTree(a));
    this._movingSprites.push(a)
};
Layer.prototype.worldPositionToScreen = function (a) {
    return {
        x: this._scaleConversionFactor * (a.x - this._cameraPosition.x * this._transform.translate) / this._resolutionFactor,
        y: this._scaleConversionFactor * (a.y - this._cameraPosition.y * this._transform.translate) / this._resolutionFactor
    }
};
Layer.prototype.worldDirectionToScreen = function (a) {
    return {
        x: this._scaleConversionFactor * a.x / this._resolutionFactor,
        y: this._scaleConversionFactor * a.y / this._resolutionFactor
    }
};
Layer.prototype.worldBoxToScreen = function (a) {
    var b = {x: (a.maxX - a.minX) / 2, y: (a.maxY - a.minY) / 2}, a = this.worldPositionToScreen({
        x: a.minX + b.x,
        y: a.minY + b.y
    }), b = this.worldDirectionToScreen(b);
    return {minX: a.x - b.x, minY: a.y - b.y, maxX: a.x + b.x, maxY: a.y + b.y}
};
Layer.prototype.worldUnitToScreen = function () {
    return this._scaleConversionFactor / this._resolutionFactor
};
Layer.prototype.screenPositionToWorld = function (a) {
    return {
        x: this._cameraPosition.x * this._transform.translate + a.x * this._resolutionFactor / this._scaleConversionFactor,
        y: this._cameraPosition.y * this._transform.translate + a.y * this._resolutionFactor / this._scaleConversionFactor
    }
};
Layer.prototype.screenDirectionToWorld = function (a) {
    return {
        x: a.x * this._resolutionFactor / this._scaleConversionFactor,
        y: a.y * this._resolutionFactor / this._scaleConversionFactor
    }
};
Layer.prototype.screenBoxToWorld = function (a) {
    var b = {x: (a.maxX - a.minX) / 2, y: (a.maxY - a.minY) / 2}, a = this.screenPositionToWorld({
        x: a.minX + b.x,
        y: a.minY + b.y
    }), b = this.screenDirectionToWorld(b);
    return {minX: a.x - b.x, minY: a.y - b.y, maxX: a.x + b.x, maxY: a.y + b.y}
};
Layer.prototype.screenUnitToWorld = function () {
    return this._resolutionFactor / this._scaleConversionFactor
};
Layer.prototype.worldPositionToCanvas = function (a) {
    return {
        x: this._scaleConversionFactor * (a.x - this._cameraPosition.x * this._transform.translate),
        y: this._scaleConversionFactor * (a.y - this._cameraPosition.y * this._transform.translate)
    }
};
Layer.prototype.worldDirectionToCanvas = function (a) {
    return {x: this._scaleConversionFactor * a.x, y: this._scaleConversionFactor * a.y}
};
Layer.prototype.worldBoxToCanvas = function (a) {
    var b = {x: (a.maxX - a.minX) / 2, y: (a.maxY - a.minY) / 2}, a = this.worldPositionToCanvas({
        x: a.minX + b.x,
        y: a.minY + b.y
    }), b = this.worldDirectionToCanvas(b);
    return {minX: a.x - b.x, minY: a.y - b.y, maxX: a.x + b.x, maxY: a.y + b.y}
};
Layer.prototype.worldUnitToCanvas = function () {
    return this._scaleConversionFactor
};
Layer.prototype.canvasPositionToWorld = function (a) {
    return {
        x: this._cameraPosition.x * this._transform.translate + a.x / this._scaleConversionFactor,
        y: this._cameraPosition.y * this._transform.translate + a.y / this._scaleConversionFactor
    }
};
Layer.prototype.canvasDirectionToWorld = function (a) {
    return {x: a.x / this._scaleConversionFactor, y: a.y / this._scaleConversionFactor}
};
Layer.prototype.canvasBoxToWorld = function (a) {
    var b = {x: (a.maxX - a.minX) / 2, y: (a.maxY - a.minY) / 2}, a = this.canvasPositionToWorld({
        x: a.minX + b.x,
        y: a.minY + b.y
    }), b = this.canvasDirectionToWorld(b);
    return {minX: a.x - b.x, minY: a.y - b.y, maxX: a.x + b.x, maxY: a.y + b.y}
};
Layer.prototype.canvasUnitToWorld = function () {
    return 1 / this._scaleConversionFactor
};
Layer.prototype.resize = function (a, b) {
    this._canvas && (this._canvas.width = Math.round(a * this._resolutionFactor), this._canvas.height = Math.round(b * this._resolutionFactor), "webgl" == this._renderMode && (this._f32ViewportSize[0] = this._canvas.width, this._f32ViewportSize[1] = this._canvas.height, this._context.viewport(0, 0, this._canvas.width, this._canvas.height), this._context.uniform2fv(this._context.uniforms.uViewportSize, this._f32ViewportSize), this._useOffScreenTarget && (this._context.mainRenderTarget.uniformValues.positionAndSize[2] =
        this._canvas.width, this._context.mainRenderTarget.uniformValues.positionAndSize[3] = this._canvas.height, this._context.bindTexture(this._context.TEXTURE_2D, this._context.mainRenderTarget.texture), this._context.texImage2D(this._context.TEXTURE_2D, 0, this._context.RGBA, this._canvas.width, this._canvas.height, 0, this._context.RGBA, this._context.UNSIGNED_BYTE, null), this._context.bindTexture(this._context.TEXTURE_2D, null)), this._context.currentImage = null));
    this._secondaryCanvas && (this._secondaryCanvas.width =
        Math.round(a * this._resolutionFactor), this._secondaryCanvas.height = Math.round(b * this._resolutionFactor));
    this._needsFullRedraw = !0;
    this._smoothing || (this._smoothing = !0, this.setSmoothing(!1))
};
Layer.prototype.setCanvasClearing = function (a) {
    this._clearCanvas = a
};
Layer.prototype.getContext = function () {
    return this._context
};
Layer.prototype.bringSpriteToFront = function (a) {
    a.setDirtyArea();
    wade.removeObjectFromArray(a, this._sprites);
    this._sprites.push(a)
};
Layer.prototype.pushSpriteToBack = function (a) {
    a.setDirtyArea();
    wade.removeObjectFromArray(a, this._sprites);
    this._sprites.splice(0, 0, a)
};
Layer.prototype.putSpriteBehindSprite = function (a, b) {
    var c = this._sprites.indexOf(b);
    wade.removeObjectFromArray(a, this._sprites);
    this._sprites.splice(c, 0, a)
};
Layer.prototype.flipIfNeeded = function () {
    if (this._needsFlipping && "2d" == this._renderMode) {
        var a = this._canvas, b = this._context;
        this._canvas = this._secondaryCanvas;
        this._context = this._secondaryContext;
        this._secondaryCanvas = a;
        this._secondaryContext = b;
        this._canvas.style.display = "inline";
        this._secondaryCanvas.style.display = "none";
        this._needsFlipping = !1
    }
};
Layer.prototype.setCanvasStyleSize = function (a, b) {
    if (this._canvas && (a != this._canvas.style.width || b != this._canvas.style.height))this._canvas.style.width = a, this._canvas.style.height = b, this._secondaryCanvas && (this._secondaryCanvas.style.width = a, this._secondaryCanvas.style.height = b)
};
Layer.prototype.compareSprites = function (a, b) {
    return this._sortingFunction ? this._sortingFunction(a, b) : a.id - b.id
};
Layer.prototype.removeCanvases = function () {
    this._canvas && (document.getElementById(wade.getContainerName()).removeChild(this._canvas), this._canvas = null);
    this.removeSecondaryCanvas()
};
Layer.prototype.createCanvas = function () {
    if (!this._canvas) {
        this._canvas = wade.createCanvas(this._resolutionFactor);
        this._canvas.id = "wade_layer_" + this.id;
        this._canvas.style.zIndex = -this.id;
        if ("webgl" == this._renderMode) {
            try {
                this._context = this._canvas.getContext("webgl") || this._canvas.getContext("experimental-webgl"), this._context.isWebGl = !0
            } catch (a) {
            }
            this._context ? (this._context.clearColor(0, 0, 0, 0), this._context.clear(this._context.COLOR_BUFFER_BIT), this._setupWebGl(this._context, this._canvas)) : wade.log("Unable to use WebGL in this browser, falling back to 2d canvas")
        }
        if (!this._context ||
            "webgl" != this._renderMode)this._context = this._canvas.getContext("2d"), this._renderMode = "2d";
        this._context.imageSmoothingEnabled = this._context.mozImageSmoothingEnabled = this._context.msImageSmoothingEnabled = this._context.oImageSmoothingEnabled = this._context.webkitImageSmoothingEnabled = this._smoothing;
        "2d" == this._renderMode && this._context.save();
        this._needsFullRedraw = !0
    }
};
Layer.prototype.getCanvas = function () {
    return this._canvas
};
Layer.prototype._updateScaleConversionFactor = function () {
    var a = wade.getCameraPosition();
    this._scaleConversionFactor = (this._transform.scale / a.z + 1 - this._transform.scale) * this._resolutionFactor
};
Layer.prototype._spriteSorter_bottomToTop = function (a, b) {
    var c = a.getPosition().y + a.getSortPoint().y * a.getSize().y - b.getPosition().y - b.getSortPoint().y * b.getSize().y;
    return Math.abs(c) < wade.c_epsilon ? a.id - b.id : c
};
Layer.prototype._spriteSorter_topToBottom = function (a, b) {
    var c = b.getPosition().y + b.getSortPoint().y * b.getSize().y - a.getPosition().y - a.getSortPoint().y * a.getSize().y;
    return Math.abs(c) < wade.c_epsilon ? a.id - b.id : c
};
Layer.prototype._initQuadTree = function () {
    var a = (this._worldBounds.maxX - this._worldBounds.minX) / 2, b = (this._worldBounds.maxY - this._worldBounds.minY) / 2, c = this._worldBounds.minX + a, d = this._worldBounds.minY + b;
    this._quadTree = new QuadTreeNode(0, c - 1.5 * a, d - 1.5 * b, c + 1.5 * a, d + 1.5 * b)
};
Layer.prototype._addSpriteToQuadTree = function (a) {
    if (wade.boxContainsBox(this._quadTree, this._worldBounds))this._quadTree.addObject(a); else {
        this._initQuadTree();
        for (a = 0; a < this._sprites.length; a++)this._quadTree.addObject(this._sprites[a])
    }
};
Layer.prototype._joinDirtyAreas = function () {
    if (!this._dirtyAreas.length)return {minX: 0, minY: 0, maxX: 0, maxY: 0};
    for (var a = wade.getScreenWidth() / 2, b = wade.getScreenHeight() / 2, a = this.screenBoxToWorld({
        minX: -a,
        minY: -b,
        maxX: a,
        maxY: b
    }), b = {minX: a.maxX, minY: a.maxY, maxX: a.minX, maxY: a.minY}, c = 0; c < this._dirtyAreas.length; c++) {
        var d = this._dirtyAreas[c];
        wade.boxIntersectsBox(a, d) && wade.expandBox(b, d)
    }
    wade.clampBoxToBox(b, a);
    if (b.maxX <= b.minX || b.maxY <= b.minY)b = 0;
    return b
};
Layer.prototype.createSecondaryCanvas = function () {
    this._secondaryCanvas || (this._secondaryCanvas = wade.createCanvas(this._resolutionFactor), this._secondaryCanvas.id = "wade_layer_" + this.id + "_backBuffer", this._secondaryCanvas.style.zIndex = -this.id, this._secondaryCanvas.style.display = "none", this._secondaryContext = this._secondaryCanvas.getContext("2d"), this._secondaryContext.imageSmoothingEnabled = this._secondaryContext.mozImageSmoothingEnabled = this._secondaryContext.msImageSmoothingEnabled = this._secondaryContext.oImageSmoothingEnabled =
        this._secondaryContext.webkitImageSmoothingEnabled = this._smoothing, this._secondaryContext.save())
};
Layer.prototype.removeSecondaryCanvas = function () {
    this._secondaryCanvas && document.getElementById(wade.getContainerName()).removeChild(this._secondaryCanvas);
    this._secondaryCanvas = null
};
Layer.prototype.setResolutionFactor = function (a) {
    a != this._resolutionFactor && (this._resolutionFactor = a, this._updateScaleConversionFactor(), this.resize(wade.getScreenWidth(), wade.getScreenHeight()))
};
Layer.prototype.getResolutionFactor = function () {
    return this._resolutionFactor
};
Layer.prototype.setSmoothing = function (a) {
    a != this._smoothing && (this._smoothing = a, this._context.restore(), this._context.imageSmoothingEnabled = this._context.mozImageSmoothingEnabled = this._context.msImageSmoothingEnabled = this._context.oImageSmoothingEnabled = this._context.webkitImageSmoothingEnabled = a, this._context.save(), this._secondaryContext && (this._secondaryContext.restore(), this._secondaryContext.imageSmoothingEnabled = this._secondaryContext.mozImageSmoothingEnabled = this._secondaryContext.msImageSmoothingEnabled =
        this._secondaryContext.oImageSmoothingEnabled = this._secondaryContext.webkitImageSmoothingEnabled = a, this._secondaryContext.save()), this._needsFullRedraw = !0)
};
Layer.prototype.getSmoothing = function () {
    return this._smoothing
};
Layer.prototype.addSpritesInAreaToArray = function (a, b) {
    this._quadTree.addObjectsInAreaToArray(a, b)
};
Layer.prototype.toDataURL = function () {
    return this._canvas.toDataURL()
};
Layer.prototype.forceRedraw = function () {
    this._needsFullRedraw = !0
};
Layer.prototype.setOpacity = function (a) {
    this._canvas.style.opacity = a;
    this._secondaryCanvas && (this._secondaryCanvas.style.opacity = a)
};
Layer.prototype.getOpacity = function () {
    return this._canvas.style.opacity
};
Layer.prototype.clear = function () {
    var a = wade.getScreenWidth() * this._resolutionFactor, b = wade.getScreenHeight() * this._resolutionFactor, c = this._context;
    "webgl" == this._renderMode ? (this._context.clear(this._context.COLOR_BUFFER_BIT), this._secondaryContext && this._secondaryContext.clear(this._secondaryContext.COLOR_BUFFER_BIT)) : (c.save(), c.setTransform(1, 0, 0, 1, 0, 0), c.clearRect(0, 0, Math.round(a), Math.round(b)), c.restore(), this._secondaryContext && (c = this._secondaryContext, c.save(), c.setTransform(1, 0, 0, 1, 0,
        0), c.clearRect(0, 0, Math.round(a), Math.round(b)), c.restore()))
};
Layer.prototype.useQuadtree = function (a) {
    if (a != this._useQuadtree && (this._useQuadtree = a)) {
        this._quadTree.empty();
        for (a = 0; a < this._sprites.length; a++)this._addSpriteToQuadTree(this._sprites[a])
    }
};
Layer.prototype.isUsingQuadtree = function () {
    return this._useQuadtree
};
Layer.prototype.set3DTransform = function (a, b, c, d) {
    var e = function (e) {
        if (c) {
            e.style.MozTransition = "-moz-transform " + c + "s";
            e.style.msTransition = "-ms-transform " + c + "s";
            e.style.OTransition = "-O-transform " + c + "s";
            e.style.WebkitTransition = "-webkit-transform " + c + "s";
            e.style.transition = "transform " + c + "s";
            var g = function () {
                d && d();
                d = null;
                e.removeEventListener("transitionend", g)
            };
            e.addEventListener("transitionend", g, !0)
        } else e.style.MozTransition = "-moz-transform 0", e.style.msTransition = "-ms-transform 0", e.style.OTransition =
            "-O-transform 0", e.style.WebkitTransition = "-webkit-transform 0", e.style.transition = "transform 0";
        e.style.MozTransform = e.style.msTransform = e.style.OTransform = e.style.webkitTransform = e.style.transform = a;
        e.style.MozTransformOrigin = e.style.msTransformOrigin = e.style.OTransformOrigin = e.style.webkitTransformOrigin = e.style.transformOrigin = b;
        !c && d && d()
    };
    this._canvas && e(this._canvas);
    this._secondaryCanvas && e(this._secondaryCanvas)
};
Layer.prototype.getIndexOfSprite = function (a) {
    return this._sprites.indexOf(a)
};
Layer.prototype.setIndexOfSprite = function (a, b) {
    var c = this._sprites.indexOf(a);
    return -1 != c && b != c ? (wade.removeObjectFromArrayByIndex(c, this._sprites), this._sprites.length > b ? (this._sprites.splice(b, 0, a), b) : this._sprites.push(a) - 1) : -1
};
Layer.prototype._setupWebGl = function (a, b) {
    var c = a.createShader(a.VERTEX_SHADER);
    a.shaderSource(c, "attribute vec3 aVertexPosition;\nuniform vec3 uCameraScaleTranslate;\nuniform vec2 uViewportSize;\nuniform vec4 uPositionAndSize;\nuniform vec4 uAnimFrameInfo;\nuniform vec2 uRotationAlpha;\nvarying highp vec4 uvAlpha;\nvoid main(void) {\nfloat s = sin(uRotationAlpha.x);\nfloat c = cos(uRotationAlpha.x);\nvec2 pos = aVertexPosition.xy * uPositionAndSize.zw;\npos = vec2(pos.x * c - pos.y * s, pos.y * c + pos.x * s);\npos += uPositionAndSize.xy * 2.0;\npos *= uCameraScaleTranslate.x;\npos -= uCameraScaleTranslate.yz * 2.0;\npos /= uViewportSize;\npos.y *= -1.0;\nuvAlpha.xy = (aVertexPosition.xy + 1.0) * 0.5;\nuvAlpha.x = (uAnimFrameInfo.z < 0.0)? 1.0 - uvAlpha.x : uvAlpha.x;\nuvAlpha.y = (uAnimFrameInfo.w < 0.0)? 1.0 - uvAlpha.y : uvAlpha.y;\nuvAlpha.xy *= abs(uAnimFrameInfo.zw);\nuvAlpha.xy += uAnimFrameInfo.xy;\nuvAlpha.z = uRotationAlpha.y;\ngl_Position = vec4(pos, 0.0, 1.0);\n}");
    a.compileShader(c);
    if (a.getShaderParameter(c, a.COMPILE_STATUS)) {
        a.defaultVertexShader = c;
        var d = a.createShader(a.FRAGMENT_SHADER);
        a.shaderSource(d, "varying highp vec4 uvAlpha;\nuniform sampler2D uDiffuseSampler;\nvoid main(void) {\nhighp vec4 color = texture2D(uDiffuseSampler, uvAlpha.xy);\ncolor.w *= uvAlpha.z;\ngl_FragColor = color;\n}");
        a.compileShader(d);
        if (a.getShaderParameter(d, a.COMPILE_STATUS)) {
            a.defaultPixelShader = d;
            var e = a.createProgram();
            a.attachShader(e, c);
            a.attachShader(e, d);
            a.linkProgram(e);
            a.getProgramParameter(e,
                a.LINK_STATUS) ? (e.vertexPositionAttribute = a.getAttribLocation(e, "aVertexPosition"), a.defaultShaderProgram = e, a.useProgram(e), a.uniforms = {}, a.uniforms.uCameraScaleTranslate = a.getUniformLocation(e, "uCameraScaleTranslate"), a.uniforms.uViewportSize = a.getUniformLocation(e, "uViewportSize"), a.uniforms.uPositionAndSize = a.getUniformLocation(e, "uPositionAndSize"), a.uniforms.uAnimFrameInfo = a.getUniformLocation(e, "uAnimFrameInfo"), a.uniforms.uRotationAlpha = a.getUniformLocation(e, "uRotationAlpha"), a.uniforms.uDiffuseSampler =
                a.getUniformLocation(e, "uDiffuseSampler"), c = a.createBuffer(), a.enableVertexAttribArray(e.vertexPositionAttribute), a.bindBuffer(a.ARRAY_BUFFER, c), a.bufferData(a.ARRAY_BUFFER, new Float32Array([1, 1, 0, -1, 1, 0, 1, -1, 0, -1, -1, 0]), a.STATIC_DRAW), a.vertexAttribPointer(e.vertexPositionAttribute, 3, a.FLOAT, !1, 0, 0), a.activeTexture(a.TEXTURE0), a.uniform1i(a.uniforms.uDiffuseSampler, 0), a.disable(a.DEPTH_TEST), a.enable(a.BLEND), a.blendFuncSeparate(a.SRC_ALPHA, a.ONE_MINUS_SRC_ALPHA, a.ONE, a.ONE_MINUS_SRC_ALPHA), a.pixelStorei(a.UNPACK_PREMULTIPLY_ALPHA_WEBGL,
                !1), a.textures = {}, a.setTextureImage = function (b, c) {
                var d = b.imageName;
                if (a.currentImage != d) {
                    if (a.textures[d])c || a.bindTexture(a.TEXTURE_2D, a.textures[d]); else {
                        var e = a.createTexture();
                        a.bindTexture(a.TEXTURE_2D, e);
                        a.texParameteri(a.TEXTURE_2D, a.TEXTURE_MIN_FILTER, a.LINEAR);
                        a.texParameteri(a.TEXTURE_2D, a.TEXTURE_MAG_FILTER, a.LINEAR);
                        a.texParameteri(a.TEXTURE_2D, a.TEXTURE_WRAP_S, a.CLAMP_TO_EDGE);
                        a.texParameteri(a.TEXTURE_2D, a.TEXTURE_WRAP_T, a.CLAMP_TO_EDGE);
                        a.texImage2D(a.TEXTURE_2D, 0, a.RGBA, a.RGBA, a.UNSIGNED_BYTE,
                            b);
                        a.textures[d] = e;
                        wade.addImageUser(d, this);
                        c && (a.bindTexture(a.TEXTURE_2D, null), a.currentImage = null)
                    }
                    c || (a.currentImage = d)
                }
            }, a.setActiveImage = function (b) {
                a.bindTexture(a.TEXTURE_2D, a.textures[b]);
                a.texImage2D(a.TEXTURE_2D, 0, a.RGBA, a.RGBA, a.UNSIGNED_BYTE, wade.getImage(b))
            }, a.onImageUnloaded = function (b) {
                a.deleteTexture(a.textures[b])
            }, a.currentImage = null, this._useOffScreenTarget && (a.mainRenderTarget = a.createFramebuffer(), a.bindFramebuffer(a.FRAMEBUFFER, a.mainRenderTarget), a.disable(a.DEPTH_TEST),
                a.mainRenderTarget.texture = a.createTexture(), a.bindTexture(a.TEXTURE_2D, a.mainRenderTarget.texture), a.texParameteri(a.TEXTURE_2D, a.TEXTURE_MIN_FILTER, a.LINEAR), a.texParameteri(a.TEXTURE_2D, a.TEXTURE_MAG_FILTER, a.LINEAR), a.texParameteri(a.TEXTURE_2D, a.TEXTURE_WRAP_S, a.CLAMP_TO_EDGE), a.texParameteri(a.TEXTURE_2D, a.TEXTURE_WRAP_T, a.CLAMP_TO_EDGE), a.texImage2D(a.TEXTURE_2D, 0, a.RGBA, b.width, b.height, 0, a.RGBA, a.UNSIGNED_BYTE, null), a.framebufferTexture2D(a.FRAMEBUFFER, a.COLOR_ATTACHMENT0, a.TEXTURE_2D, a.mainRenderTarget.texture,
                0), a.bindTexture(a.TEXTURE_2D, null), a.bindFramebuffer(a.FRAMEBUFFER, null), a.mainRenderTarget.uniformValues = {
                positionAndSize: new Float32Array([0, 0, b.width, b.height]),
                animFrameInfo: new Float32Array([0, 0, 1, -1]),
                rotationAlpha: new Float32Array([0, 1])
            }), a.globalAlpha = 1, this._f32ViewportSize[0] = this._canvas.width, this._f32ViewportSize[1] = this._canvas.height, a.viewport(0, 0, b.width, b.height), a.uniform2fv(a.uniforms.uViewportSize, this._f32ViewportSize)) : wade.log("Unable to initialize WebGl shaders")
        } else wade.log("An error occurred compiling the pixel shader: " +
        a.getShaderInfoLog(d))
    } else wade.log("An error occurred compiling the vertex shader: " + a.getShaderInfoLog(c))
};
var resetContext = function (a) {
    var b = a.getParameter(a.MAX_VERTEX_ATTRIBS), c = a.createBuffer();
    a.bindBuffer(a.ARRAY_BUFFER, c);
    for (var d = 0; d < b; ++d)a.disableVertexAttribArray(d), a.vertexAttribPointer(d, 4, a.FLOAT, !1, 0, 0), a.vertexAttrib1f(d, 0);
    a.deleteBuffer(c);
    b = a.getParameter(a.MAX_TEXTURE_IMAGE_UNITS);
    for (d = 0; d < b; ++d)a.activeTexture(a.TEXTURE0 + d), a.bindTexture(a.TEXTURE_CUBE_MAP, null), a.bindTexture(a.TEXTURE_2D, null);
    a.activeTexture(a.TEXTURE0);
    a.useProgram(null);
    a.bindBuffer(a.ARRAY_BUFFER, null);
    a.bindBuffer(a.ELEMENT_ARRAY_BUFFER,
        null);
    a.bindFramebuffer(a.FRAMEBUFFER, null);
    a.bindRenderbuffer(a.RENDERBUFFER, null);
    a.disable(a.BLEND);
    a.disable(a.CULL_FACE);
    a.disable(a.DEPTH_TEST);
    a.disable(a.DITHER);
    a.disable(a.SCISSOR_TEST);
    a.blendColor(0, 0, 0, 0);
    a.blendEquation(a.FUNC_ADD);
    a.blendFunc(a.ONE, a.ZERO);
    a.clearColor(0, 0, 0, 0);
    a.clearDepth(1);
    a.clearStencil(-1);
    a.colorMask(!0, !0, !0, !0);
    a.cullFace(a.BACK);
    a.depthFunc(a.LESS);
    a.depthMask(!0);
    a.depthRange(0, 1);
    a.frontFace(a.CCW);
    a.hint(a.GENERATE_MIPMAP_HINT, a.DONT_CARE);
    a.lineWidth(1);
    a.pixelStorei(a.PACK_ALIGNMENT, 4);
    a.pixelStorei(a.UNPACK_ALIGNMENT, 4);
    a.pixelStorei(a.UNPACK_FLIP_Y_WEBGL, !1);
    a.pixelStorei(a.UNPACK_PREMULTIPLY_ALPHA_WEBGL, !1);
    a.UNPACK_COLORSPACE_CONVERSION_WEBGL && a.pixelStorei(a.UNPACK_COLORSPACE_CONVERSION_WEBGL, a.BROWSER_DEFAULT_WEBGL);
    a.polygonOffset(0, 0);
    a.sampleCoverage(1, !1);
    a.scissor(0, 0, a.canvas.width, a.canvas.height);
    a.stencilFunc(a.ALWAYS, 0, 4294967295);
    a.stencilMask(4294967295);
    a.stencilOp(a.KEEP, a.KEEP, a.KEEP);
    a.viewport(0, 0, a.canvas.width, a.canvas.height);
    a.clear(a.COLOR_BUFFER_BIT | a.DEPTH_BUFFER_BIT | a.STENCIL_BUFFER_BIT);
    for (var e in a.textures)a.textures.hasOwnProperty(e) && (wade.removeImageUser(e, a), a.deleteTexture(a.textures[e]));
    delete a.textures
};
Layer.prototype.setRenderMode = function (a, b) {
    var c = b && b.offScreenTarget;
    if (a != this._renderMode || c != this._useOffScreenTarget)"webgl" == this._renderMode && this._context && resetContext(this._context), this._renderMode = a, this._useOffScreenTarget = c, this.removeCanvases(), this.createCanvas(), wade.isDoubleBufferingEnabled() && this.createSecondaryCanvas()
};
Layer.prototype.getRenderMode = function () {
    return this._renderMode
};
function QuadTreeNode(a, b, c, d, e) {
    this._level = a;
    this.minX = b;
    this.minY = c;
    this.maxX = d;
    this.maxY = e;
    this._children = [];
    this._objects = []
}
QuadTreeNode.prototype.c_idealObjectCountPerLevel = 1;
QuadTreeNode.prototype.c_maxLevels = 8;
QuadTreeNode.prototype.addObject = function (a) {
    if (!this._insertInChild(a) && (a.quadTreeNode = this, this._objects.push(a), this._objects.length > this.c_idealObjectCountPerLevel && !this._children.length && this._level < this.c_maxLevels)) {
        var a = this.minX + (this.maxX - this.minX) / 2, b = this.minY + (this.maxY - this.minY) / 2;
        this._children.push(new QuadTreeNode(this._level + 1, this.minX, this.minY, a, b));
        this._children.push(new QuadTreeNode(this._level + 1, a, this.minY, this.maxX, b));
        this._children.push(new QuadTreeNode(this._level +
        1, this.minX, b, a, this.maxY));
        this._children.push(new QuadTreeNode(this._level + 1, a, b, this.maxX, this.maxY));
        for (a = this._objects.length - 1; 0 <= a; a--)this._insertInChild(this._objects[a]) && this.removeObject(this._objects[a])
    }
};
QuadTreeNode.prototype.removeObject = function (a) {
    wade.removeObjectFromArray(a, this._objects)
};
QuadTreeNode.prototype.getObjects = function (a) {
    if (wade.boxIntersectsBox(this, a)) {
        for (var b = [].concat(this._objects), c = 0; c < this._children.length; c++)b = b.concat(this._children[c].getObjects(a));
        return b
    }
    return []
};
QuadTreeNode.prototype.addObjectsInAreaToArray = function (a, b) {
    if (wade.boxIntersectsBox(this, a)) {
        for (var c = 0; c < this._objects.length; c++)wade.boxIntersectsBox(a, this._objects[c].boundingBox) && b.push(this._objects[c]);
        for (c = 0; c < this._children.length; c++)this._children[c].addObjectsInAreaToArray(a, b)
    }
};
QuadTreeNode.prototype.countObjects = function (a) {
    if (wade.boxIntersectsBox(this, a)) {
        for (var b = this._objects.length, c = 0; c < this._children.length; c++)b += this._children[c].countObjects(a);
        return b
    }
    return 0
};
QuadTreeNode.prototype.flagObjects = function (a, b) {
    if (wade.boxIntersectsBox(this, a)) {
        for (var c = 0; c < this._objects.length; c++)wade.boxIntersectsBox(a, this._objects[c].boundingBox) && (this._objects[c][b] = 1);
        for (c = 0; c < this._children.length; c++)this._children[c].flagObjects(a, b)
    }
};
QuadTreeNode.prototype.empty = function () {
    for (var a = this._objects.length = 0; a < this._children.length; a++)this._children[a].empty()
};
QuadTreeNode.prototype._insertInChild = function (a) {
    for (var b = 0; b < this._children.length; b++)if (wade.boxContainsBox(this._children[b], a.boundingBox))return this._children[b].addObject(a), !0;
    return !1
};
function Renderer() {
    var a = {}, b = [], c = 0, d = 0, e = 0, f = "full", g = 1920, i = 1080, l = 0, j = 0, h = 0, m = 0, n = 1, p = {}, t = !0, r = !1, z = 0, y = 0;
    this._createLayerIfNeeded = function (c) {
        a[c] || (a[c] = new Layer(c), t || a[c].setSmoothing(t), b.push(a[c]), b.sort(this._layerSorter))
    };
    this.removeLayer = function (c) {
        a[c] && (wade.removeObjectFromArray(a[c], b), b.sort(this._layerSorter), a[c].removeCanvases(), a[c] = null)
    };
    this.init = function (a) {
        e = a;
        a = $("#" + wade.getContainerName());
        c = parseInt(a.attr("width"));
        d = parseInt(a.attr("height"))
    };
    this.draw = function (a) {
        var s,
            h, m;
        if (e.getSimulationDirtyState() || a) {
            wade.numDrawCalls = 0;
            var n = wade.logDrawTime && console.time && console.timeEnd && 0.02 > Math.random();
            n && console.time("Draw");
            var q = document.getElementById(wade.getContainerName()), p = wade.getForcedOrientation();
            s = wade.getContainerWidth();
            h = wade.getContainerHeight();
            var k = r;
            switch (p) {
                case "landscape":
                    h > s && (r = !r);
                    break;
                case "portrait":
                    s > h && (r = !r);
                    break;
                default:
                    r = !1
            }
            if (r != k) {
                var w = r ? "rotateZ(90deg)" : "translate3d(0, 0, 0)";
                q.style.MozTransform = w;
                q.style.msTransform = w;
                q.style.OTransform =
                    w;
                q.style.webkitTransform = w;
                q.style.transform = w
            }
            w = !1;
            s = wade.getContainerWidth();
            h = wade.getContainerHeight();
            var G = z != s || y != h;
            if (G) {
                var B = {width: s, height: h};
                e.processEvent("onContainerResize", B) || wade.app.onContainerResize && wade.app.onContainerResize(B)
            }
            var v, x;
            if ("full" == f) {
                var B = c, E = d;
                c = Math.max(Math.min(s, g), l);
                d = Math.max(Math.min(h, i), j);
                c > s || d > h ? c / s > d / h ? (d = Math.max(Math.min(Math.min(d, h) * c / s, i), j), v = s + "px", x = Math.floor(s * d / c) + "px") : (c = Math.max(Math.min(Math.min(c, s) * d / h, g), l), v = Math.floor(h * c /
                d) + "px", x = h + "px") : c < s && d < h ? c / s > d / h ? (x = Math.floor(s * d / c) + "px", v = s + "px") : (x = h + "px", v = Math.floor(h * c / d) + "px") : (x = d + "px", v = c + "px");
                if (B != c || E != d)q.setAttribute("width", c.toString()), q.setAttribute("height", d.toString()), e.onResize(B, E, c, d), w = !0
            } else if ("stretchToFit" == f)s / c > h / d ? (v = Math.floor(h * c / d) + "px", x = s + "px") : (v = s + "px", x = Math.floor(s * d / c) + "px"); else if ("container" == f && (B = c, E = d, c = q.getAttribute("width"), d = q.getAttribute("height"), w = B != c || E != d))v = c + "px", x = d + "px", m = !0, e.onResize(B, E, c, d);
            if (m = m || v &&
                x && (v != q.style.width || x != q.style.height) || r != k || r && G)q.style.width = v, q.style.height = x, r ? (k = $(q), "landscape" == p ? (p = (k.outerWidth(!0) - k.innerWidth()) / 2, q.style.marginLeft = p + "px", q.style.marginTop = "auto") : "portrait" == p && (p = (k.outerHeight(!0) - k.innerHeight()) / 2, q.style.marginTop = p + "px", q.style.marginLeft = "auto")) : q.style.margin = "auto";
            y = h;
            z = s;
            for (s = 0; s < b.length; s++)h = b[s], 1 != h.getResolutionFactor() && v && x && v == x && "auto" == v ? h.setCanvasStyleSize(q.getAttribute("width") + "px", q.getAttribute("height") + "px") :
            m && h.setCanvasStyleSize(v, x), w && h.resize(c, d), (!a || !("number" == typeof a && a != h.id || a.indexOf && -1 == a.indexOf(h.id))) && h.draw();
            if (!w)for (s = 0; s < b.length; s++)h = b[s], h.flipIfNeeded();
            n && (console.timeEnd("Draw"), console.log("Number of draw calls: " + wade.numDrawCalls));
            e.clearSimulationDirtyState()
        }
    };
    this.addSprite = function (a) {
        a.getLayer().addSprite(a)
    };
    this.removeSprite = function (a) {
        a.getLayer().removeSprite(a)
    };
    this._layerSorter = function (a, b) {
        return b.id - a.id
    };
    this.getLayer = function (b) {
        this._createLayerIfNeeded(b);
        return a[b]
    };
    this.getLayerSorting = function (b) {
        return a[b].getSorting()
    };
    this.setLayerSorting = function (b, c) {
        this._createLayerIfNeeded(b);
        a[b].setSorting(c)
    };
    this.setLayerTransform = function (b, c, d) {
        this._createLayerIfNeeded(b);
        a[b].setTransform(c, d)
    };
    this.setLayerResolutionFactor = function (b, c) {
        this._createLayerIfNeeded(b);
        a[b].setResolutionFactor(c)
    };
    this.getLayerResolutionFactor = function (b) {
        return a[b] && a[b].getResolutionFactor()
    };
    this.setResolutionFactor = function (a) {
        for (var c = 0; c < b.length; c++)b[c].setResolutionFactor(a)
    };
    this.setLayerSmoothing = function (b, c) {
        this._createLayerIfNeeded(b);
        a[b].setSmoothing(c)
    };
    this.getLayerSmoothing = function (b) {
        return a[b] && a[b].getSmoothing()
    };
    this.setSmoothing = function (a) {
        t = a;
        for (a = 0; a < b.length; a++)b[a].setSmoothing(t)
    };
    this.getSmoothing = function () {
        return t
    };
    this.getScreenWidth = function () {
        return c
    };
    this.getScreenHeight = function () {
        return d
    };
    this.setScreenSize = function (a, e) {
        if (a != c || e != d) {
            c = a;
            d = e;
            for (var g = 0; g < b.length; g++)b[g].resize(c, d)
        }
    };
    this.getMaxScreenWidth = function () {
        return g
    };
    this.getMaxScreenHeight = function () {
        return i
    };
    this.setMaxScreenSize = function (a, b) {
        g = a;
        i = b;
        if (c > g || d > i)e.setSimulationDirtyState(), this.draw()
    };
    this.getMinScreenWidth = function () {
        return l
    };
    this.getMinScreenHeight = function () {
        return j
    };
    this.setMinScreenSize = function (a, b) {
        l = a;
        j = b;
        if (c < l || d < j)e.setSimulationDirtyState(), this.draw()
    };
    this.setCanvasClearing = function (b, c) {
        this._createLayerIfNeeded(b);
        a[b].setCanvasClearing(c)
    };
    this.setWindowMode = function (a) {
        f = a
    };
    this.getWindowMode = function () {
        return f
    };
    this.getCameraPosition =
        function () {
            return {x: h, y: m, z: n}
        };
    this.setCameraPosition = function (a) {
        h = a.x;
        m = a.y;
        n = a.z;
        for (var c = 0; c < b.length; c++)b[c].onCameraPositionChanged(a)
    };
    this.worldPositionToScreen = function (a, b) {
        return this.getLayer(a).worldPositionToScreen(b)
    };
    this.worldDirectionToScreen = function (a, b) {
        return this.getLayer(a).worldDirectionToScreen(b)
    };
    this.worldBoxToScreen = function (a, b) {
        return this.getLayer(a).worldBoxToScreen(b)
    };
    this.worldUnitToScreen = function (a) {
        return this.getLayer(a).worldUnitToScreen()
    };
    this.screenPositionToWorld =
        function (a, b) {
            return this.getLayer(a).screenPositionToWorld(b)
        };
    this.screenDirectionToWorld = function (a, b) {
        return this.getLayer(a).screenDirectionToWorld(b)
    };
    this.screenUnitToWorld = function (a) {
        return this.getLayer(a).screenUnitToWorld()
    };
    this.screenBoxToWorld = function (a, b) {
        return this.getLayer(a).screenBoxToWorld(b)
    };
    this.worldPositionToCanvas = function (a, b) {
        return this.getLayer(a).worldPositionToCanvas(b)
    };
    this.worldDirectionToCanvas = function (a, b) {
        return this.getLayer(a).worldDirectionToCanvas(b)
    };
    this.worldBoxToCanvas = function (a, b) {
        return this.getLayer(a).worldBoxToCanvas(b)
    };
    this.worldUnitToCanvas = function (a) {
        return this.getLayer(a).worldUnitToCanvas()
    };
    this.canvasPositionToWorld = function (a, b) {
        return this.getLayer(a).canvasPositionToWorld(b)
    };
    this.canvasDirectionToWorld = function (a, b) {
        return this.getLayer(a).canvasDirectionToWorld(b)
    };
    this.canvasUnitToWorld = function (a) {
        return this.getLayer(a).canvasUnitToWorld()
    };
    this.canvasBoxToWorld = function (a, b) {
        return this.getLayer(a).canvasBoxToWorld(b)
    };
    this.removeCanvases = function () {
        for (var a = 0; a < b.length; a++)b[a].removeCanvases()
    };
    this.getNumExistingLayers = function () {
        return b.length
    };
    this.recreateCanvases = function () {
        for (var a = 0; a < b.length; a++)b[a].createCanvas()
    };
    this.enableDoubleBuffering = function (a) {
        if (a)for (a = 0; a < b.length; a++)b[a].createSecondaryCanvas(); else for (a = 0; a < b.length; a++)b[a].removeSecondaryCanvas()
    };
    this.isScreenRotated = function () {
        return r
    };
    this.addSpritesInAreaToArray = function (c, d, e) {
        if ("undefined" != typeof e)a[e].addSpritesInAreaToArray(c,
            d); else for (e = 0; e < b.length; e++)b[e].addSpritesInAreaToArray(c, d)
    };
    this.addObjectsInAreaToArray = function (a, b, c) {
        var d = [];
        this.addSpritesInAreaToArray(a, d, c);
        for (a = 0; a < d.length; a++)c = d[a].getSceneObject(), -1 == b.lastIndexOf(c) && b.push(c)
    };
    this.addSpritesInScreenAreaToArray = function (a, c) {
        for (var d = 0; d < b.length; d++) {
            var e = wade.screenBoxToWorld(b[d].id, a);
            b[d].addSpritesInAreaToArray(e, c)
        }
    };
    this.addObjectsInScreenAreaToArray = function (a, b) {
        var c = [];
        this.addSpritesInScreenAreaToArray(a, c);
        for (var d = 0; d < c.length; d++) {
            var e =
                c[d].getSceneObject();
            -1 == b.lastIndexOf(e) && b.push(e)
        }
    };
    this.forceRedraw = function (a) {
        if (a)b[a].forceRedraw(); else for (a = 0; a < b.length; a++)b[a].forceRedraw()
    };
    this.getActiveLayerIds = function () {
        for (var a = [], c = 0; c < b.length; c++)a.push(b[c].id);
        return a
    };
    this.addImageUser = function (a, b) {
        p[a] || (p[a] = []);
        p[a].push(b)
    };
    this.removeImageUser = function (a, b) {
        p[a] && wade.removeObjectFromArray(b, p[a])
    };
    this.removeAllImageUsers = function (a) {
        p[a] && (p[a].length = 0)
    };
    this.getImageUsers = function (a) {
        return p[a]
    };
    this.updateImageUsers =
        function (a) {
            var b = p[a];
            if (b)for (var c = 0; c < b.length; c++)b[c].setDirtyArea && b[c].setDirtyArea(), b[c].setActiveImage(a)
        };
    this.getLayerSettings = function () {
        for (var a = [], c = 0; c < b.length; c++) {
            var d = b[c];
            a[d.id] = {
                scaleFactor: d.getScaleFactor(),
                translateFactor: d.getTranslateFactor(),
                renderMode: d.getRenderMode(),
                useQuadtree: d.isUsingQuadtree()
            }
        }
        return a
    }
}
function SceneManager() {
    var a = [], b = {
        onMouseDown: [],
        onMouseUp: [],
        onMouseMove: [],
        onMouseWheel: [],
        onClick: [],
        onMouseIn: [],
        onMouseOut: [],
        onKeyDown: [],
        onKeyUp: [],
        onKeyPress: [],
        onAppTimer: [],
        onSimulationStep: [],
        onUpdate: [],
        onResize: [],
        onContainerResize: [],
        onDeviceMotion: [],
        onDeviceOrientation: [],
        onSwipeLeft: [],
        onSwipeRight: [],
        onSwipeUp: [],
        onSwipeDown: [],
        onBlur: [],
        onFocus: []
    }, c = wade.cloneObject(b), d = 0, e = !1, f = {};
    this.init = function () {
        this.renderer = new Renderer;
        this.renderer.init(this)
    };
    this.addSceneObject =
        function (c, d, e) {
            a.push(c);
            c.autoListen = d;
            c.addToSceneParams = e ? jQuery.extend(!0, {}, e) : null;
            c.addSpritesToRenderer(this.renderer);
            this.addNamedObject(c);
            if (d && !c.isTemplate())for (var f in b)if (b.hasOwnProperty(f)) {
                var h = c[f];
                if (!h)for (var m = c.getBehaviors(), d = 0; d < m.length && !h; d++)h = m[d][f];
                h && wade.addEventListener(c, f)
            }
            if (c.isTemplate()) {
                f = c.getSpriteCount();
                for (d = 0; d < f; d++)c.getSprite(d).setVisible(!1)
            }
            c.processEvent("onAddToScene", e)
        };
    this.addNamedObject = function (a) {
        var b = a.getName();
        b && (f[b] ? wade.log("Warning: a scene object named " +
        b + " is already present in the scene") : f[b] = a)
    };
    this.removeNamedObject = function (a) {
        a && delete f[a]
    };
    this.changeObjectName = function (a, b) {
        this.removeNamedObject(b);
        this.addNamedObject(a)
    };
    this.getObjectByName = function (a) {
        return f[a]
    };
    this.getSceneObjects = function (b, c) {
        if (b) {
            var d = [], e;
            if ("undefined" == typeof c)for (e = 0; e < a.length; e++)"undefined" != typeof a[e][b] && d.push(a[e]); else for (e = 0; e < a.length; e++)a[e][b] == c && d.push(a[e]);
            return d
        }
        return wade.cloneArray(a)
    };
    this.removeEventListener = function (a, c) {
        wade.removeObjectFromArray(a,
            b[c])
    };
    this.removeGlobalEventListener = function (a, b) {
        wade.removeObjectFromArray(a, c[b])
    };
    this.removeSceneObject = function (d) {
        if (d) {
            d.processEvent("onRemoveFromScene");
            wade.removeObjectFromArray(d, a);
            var e = d.getName();
            e && this.removeNamedObject(e);
            for (var f in b)b.hasOwnProperty(f) && (b[f].length && this.removeEventListener(d, f), c[f].length && this.removeGlobalEventListener(d, f));
            d.unscheduleAll();
            d.removeSpritesFromRenderer()
        }
    };
    this.clear = function () {
        for (var b = a.length - 1; 0 <= b; b--)this.removeSceneObject(a[b])
    };
    this.step = function () {
        var a = wade.logSimulationTime && console.time && console.timeEnd && 0.02 > Math.random();
        a && console.time("Simulation");
        for (var c = b.onSimulationStep, f = 0; f < c.length; f++)c[f].step();
        d += wade.c_timeStep;
        this.processEvent("onUpdate");
        a && console.timeEnd("Simulation");
        e = !0
    };
    this.addEventListener = function (a, d) {
        !b[d] && (b[d] = []);
        !c[d] && (c[d] = []);
        b[d].push(a)
    };
    this.addGlobalEventListener = function (a, d) {
        !b[d] && (b[d] = []);
        !c[d] && (c[d] = []);
        c[d].push(a)
    };
    this.getEventListeners = function (a, c) {
        var d = [], e,
            f;
        switch (a) {
            case "onMouseDown":
            case "onMouseUp":
            case "onMouseMove":
            case "onMouseWheel":
            case "onClick":
            case "onMouseIn":
            case "onMouseOut":
            case "onSwipeLeft":
            case "onSwipeRight":
            case "onSwipeUp":
            case "onSwipeDown":
                var m = {x: c.screenPosition.x, y: c.screenPosition.y};
                for (e = b[a].length - 1; 0 <= e; e--) {
                    f = b[a][e];
                    var n = f.getSpriteAtPosition(m);
                    n.isPresent && (f.eventResponse = {
                        spriteIndex: n.spriteIndex,
                        position: n.relativeWorldPosition,
                        screenPosition: m,
                        topLayer: n.topLayer,
                        button: c.button,
                        value: c.value
                    }, d.push(f))
                }
                d.sort(this.eventListenersSorter);
                break;
            default:
                for (e = b[a].length - 1; 0 <= e; e--)f = b[a][e], f.eventResponse = c, d.push(f)
        }
        return d
    };
    this.eventListenersSorter = function (a, b) {
        return a.eventResponse.topLayer - b.eventResponse.topLayer
    };
    this.isObjectListeneningForEvent = function (a, c) {
        var d = b[c];
        return !!(d && 0 <= d.indexOf(a))
    };
    this.onResize = function (b, c, d, e) {
        for (var f = 0; f < a.length; f++) {
            var m = a[f], n = m.getPosition(), p = m.getAlignment(), t = 0, r = 0;
            switch (p.x) {
                case "right":
                    t = (d - b) / 2;
                    break;
                case "left":
                    t = -(d - b) / 2
            }
            switch (p.y) {
                case "top":
                    r = -(e - c) / 2;
                    break;
                case "bottom":
                    r =
                        (e - c) / 2
            }
            m.setPosition(n.x + t, n.y + r);
            if (m.isMoving() && (t || r))(n = m.getTargetPosition()) && m.moveTo(n.x + t, n.y + r, m.getMovementSpeed())
        }
        b = {width: d, height: e};
        this.processEvent("onResize", b) || wade.app.onResize && wade.app.onResize(b)
    };
    this.processEvent = function (a, b) {
        for (var d = this.getEventListeners(a, b), e = !1, f = 0; f < d.length; f++) {
            var m = d[f];
            if (m.processEvent(a, m.eventResponse)) {
                e = !0;
                break
            }
        }
        d = b && wade.cloneObject(b) || {};
        d.global = !0;
        for (f = 0; f < c[a].length; f++)c[a][f].processEvent(a, d);
        return e
    };
    this.appTimerEvent =
        function () {
            for (var a = 0; a < b.onAppTimer.length; a++)b.onAppTimer[a].processEvent("onAppTimer")
        };
    this.updateMouseInOut = function (a, b) {
        var c, d, e = "undefined" != typeof a.x;
        if (e) {
            var f = this.getEventListeners("onMouseOut", {screenPosition: a});
            for (c = 0; c < f.length && !(d = f[c], !d.getSpriteAtPosition(b).isPresent && d.processEvent("onMouseOut", d.eventResponse)); c++);
        }
        f = this.getEventListeners("onMouseIn", {screenPosition: b});
        for (c = 0; c < f.length && !(d = f[c], (!e || !d.getSpriteAtPosition(a).isPresent) && d.processEvent("onMouseIn",
            d.eventResponse)); c++);
    };
    this.getAppTime = function () {
        return d
    };
    this.getSimulationDirtyState = function () {
        return e
    };
    this.clearSimulationDirtyState = function () {
        e = !1
    };
    this.setSimulationDirtyState = function () {
        e = !0
    };
    this.draw = function (a) {
        this.renderer.draw(a)
    };
    this.exportSceneObjects = function (b, c) {
        for (var d = [], e = 0; e < a.length; e++)(!b || !(-1 != b.indexOf(a[e]) || a[e].getName() && -1 != b.indexOf(a[e].getName()))) && d.push(a[e].serialize(!1, null, c));
        return d
    };
    this.getSceneObjectIndex = function (b) {
        return a.indexOf(b)
    };
    this.setSceneObjectIndex =
        function (b, c) {
            var d = a.indexOf(b);
            return -1 != d && c != d ? (wade.removeObjectFromArrayByIndex(d, a), a.length > c ? (a.splice(c, 0, b), c) : a.push(b) - 1) : -1
        }
}
function SceneObject(a, b, c, d, e) {
    this._behaviors = [];
    this._spriteOffsets = [];
    this._moving = !1;
    this._linearVelocity = {x: 0, y: 0};
    this._animationsPlaying = this._targetPosition = 0;
    this._inScene = !1;
    this._angularVelocity = this._renderer = 0;
    this._isTemplate = !1;
    this._rotationTarget = {valid: !1, value: 0};
    this._timeouts = [];
    this.addToSceneParams = null;
    this.autoListen = !1;
    var f = "object" == typeof a && !$.isArray(a) && !(a instanceof Sprite) && !(a instanceof TextSprite) && a;
    if (f) {
        this._position = {
            x: a.position && a.position.x || 0, y: a.position &&
            a.position.y || 0
        };
        this._rotation = a.rotation || 0;
        this._alignment = {x: a.alignment && a.alignment.x || 0, y: a.alignment && a.alignment.y || 0};
        this._name = a.name;
        this._isTemplate = a.isTemplate;
        this._behaviorClasses = [];
        this._sprites = [];
        if ((b = wade.isDebugMode()) && !this._name)wade.unnamedSceneObjectsCount = (wade.unnamedSceneObjectsCount || 0) + 1, this._name = "Unnamed_Scene_Object_" + wade.unnamedSceneObjectsCount;
        if (a.behaviors)for (c = 0; c < a.behaviors.length; c++)a.behaviors[c].name && this._behaviorClasses.push(window[a.behaviors[c].name]);
        if (a.sprites)for (c = 0; c < a.sprites.length; c++)d = "TextSprite" == a.sprites[c].type ? new TextSprite(a.sprites[c]) : new Sprite(a.sprites[c]), this.addSprite(d, a.spriteOffsets && a.spriteOffsets[c]);
        if (a.functions) {
            var c = "", g;
            for (g in a.functions)if (a.functions.hasOwnProperty(g))if (b)c += "\nthis." + g + " = " + a.functions[g]; else try {
                eval("this." + g + " = " + a.functions[g])
            } catch (i) {
            }
            b && (c += "\n//# sourceURL=SceneObject_" + this._name + ".js", eval(c))
        }
        if (a.properties)for (var l in a.properties)if (a.properties.hasOwnProperty(l))try {
            this[l] =
                JSON.parse(JSON.stringify(a.properties[l]))
        } catch (j) {
        }
    } else this._position = {
        x: c ? c : 0,
        y: d ? d : 0
    }, this._behaviorClasses = b, this._sprites = a, this._alignment = {
        x: 0,
        y: 0
    }, this._rotation = 0, this._name = e || "";
    if (this._sprites) {
        jQuery.isArray(this._sprites) || (this._sprites = [this._sprites]);
        for (g = 0; g < this._sprites.length; g++)this._sprites[g].setSceneObject(this), (b = this._spriteOffsets[g]) ? (b.originalX = b.x = b.x || 0, b.originalY = b.y = b.y || 0, b.angle = b.angle || 0, this._rotation && wade.vec2.rotateInPlace(b, this._rotation), this._sprites[g].setPosition(this._position.x +
        b.x, this._position.y + b.y), this._sprites[g].setRotation(this._rotation + b.angle)) : (this._sprites[g].setPosition(this._position), this._spriteOffsets.push({
            x: 0,
            y: 0,
            originalX: 0,
            originalY: 0,
            angle: 0
        }), this._sprites[g].setRotation(this._rotation)), this._sprites[g].getAnimation && this._sprites[g].getAnimation().isPlaying() && this._animationsPlaying++
    } else this._sprites = [];
    if (this._behaviorClasses) {
        jQuery.isArray(this._behaviorClasses) || (this._behaviorClasses = [this._behaviorClasses]);
        for (g = 0; g < this._behaviorClasses.length; g++)this._behaviors[g] =
            new this._behaviorClasses[g], this._behaviors[g].owner = this
    }
    if (f) {
        "undefined" != typeof a.visible && this.setVisible(a.visible);
        if (a.behaviors)for (g = 0; g < a.behaviors.length; g++)if (a.behaviors[g].properties)for (l in a.behaviors[g].properties)a.behaviors[g].properties.hasOwnProperty(l) && (this._behaviors[g][l] = a.behaviors[g].properties[l]);
        a.addToScene && (a = a.addToScene, wade.addSceneObject(this, a.autoListen, a.params))
    }
}
SceneObject.prototype.setPosition = function (a, b) {
    var c, d;
    "object" == typeof a ? (c = a.x, d = a.y) : (c = a, d = b);
    this._position.x = c;
    this._position.y = d;
    for (c = 0; c < this._sprites.length; c++)this._sprites[c].setPosition(this._position.x + this._spriteOffsets[c].x, this._position.y + this._spriteOffsets[c].y)
};
SceneObject.prototype.getPosition = function () {
    return {x: this._position.x, y: this._position.y}
};
SceneObject.prototype.setRotation = function (a) {
    this._rotation = a;
    for (var b = 0; b < this._sprites.length; b++) {
        var c = this._spriteOffsets[b];
        this._sprites[b].setRotation(a + c.angle);
        var d = wade.vec2.rotate({x: c.originalX, y: c.originalY}, a);
        c.x = d.x;
        c.y = d.y;
        this._sprites[b].setPosition(this._position.x + c.x, this._position.y + c.y)
    }
};
SceneObject.prototype.getRotation = function () {
    return this._rotation
};
SceneObject.prototype.moveTo = function (a, b, c) {
    this._targetPosition = {x: a, y: b};
    var d = a - this._position.x, e = b - this._position.y, f = Math.sqrt(d * d + e * e);
    f > c * wade.c_timeStep ? (this._linearVelocity = {
        x: d * c / f,
        y: e * c / f
    }, !this._animationsPlaying && (!this._moving && !this._angularVelocity) && wade.simulateSceneObject(this, !0), this._moving = !0) : (this.setPosition(a, b), this.stopMoving())
};
SceneObject.prototype.rotateTo = function (a, b) {
    this._rotation %= 6.28318530718;
    a %= 6.28318530718;
    0 > a && (a += 6.28318530718);
    var c = (a - this._rotation) % 6.28318530718;
    0 > c && (c += 6.28318530718);
    c > b * wade.c_timeStep ? (this.setAngularVelocity(b), this._rotationTarget.value = a, this._rotationTarget.valid = !0) : (this.setRotation(a), this.setAngularVelocity(0))
};
SceneObject.prototype.stopMoving = function () {
    !this._animationsPlaying && (!this._angularVelocity && this._moving) && wade.simulateSceneObject(this, !1);
    this._moving = !1;
    this._targetPosition = 0;
    this._linearVelocity.x = this._linearVelocity.y = 0;
    this.processEvent("onMoveComplete")
};
SceneObject.prototype.step = function () {
    if (this._moving)if (this._targetPosition) {
        var a = this._position.x - this._targetPosition.x, b = this._position.y - this._targetPosition.y;
        (this._linearVelocity.x * this._linearVelocity.x + this._linearVelocity.y * this._linearVelocity.y) * wade.c_timeStep * wade.c_timeStep < a * a + b * b ? this.setPosition(this._position.x + this._linearVelocity.x * wade.c_timeStep, this._position.y + this._linearVelocity.y * wade.c_timeStep) : (this.setPosition(this._targetPosition.x, this._targetPosition.y), this.stopMoving())
    } else this.setPosition(this._position.x +
    this._linearVelocity.x * wade.c_timeStep, this._position.y + this._linearVelocity.y * wade.c_timeStep);
    if (a = this._angularVelocity) {
        var a = a * wade.c_timeStep, c = this._rotation, b = c + a;
        if (this._rotationTarget.valid) {
            var d = this._rotationTarget.value, c = d - c;
            0 > c && (c += 6.28318530718);
            Math.abs(c) < Math.abs(a) ? (this.setRotation(d), this.setAngularVelocity(0), this.processEvent("onRotationComplete")) : (b %= 6.28318530718, 0 > b && (b += 6.28318530718), this.setRotation(b))
        } else b %= 6.28318530718, 0 > b && (b += 6.28318530718), this.setRotation(b)
    }
    if (this._animationsPlaying)for (a =
                                         0; a < this._sprites.length; a++)this._sprites[a].step()
};
SceneObject.prototype.playAnimation = function (a, b) {
    for (var c = 0; c < this._sprites.length; c++)this._sprites[c].playAnimation(a, b)
};
SceneObject.prototype.stopAnimation = function () {
    for (var a = 0; a < this._sprites.length; a++)this._sprites[a].stopAnimation()
};
SceneObject.prototype.resumeAnimation = function () {
    for (var a = 0; a < this._sprites.length; a++)this._sprites[a].resumeAnimation()
};
SceneObject.prototype.getBehavior = function (a) {
    if (a) {
        for (var b = 0; b < this._behaviors.length; b++)if (this._behaviors[b].name == a)return this._behaviors[b];
        return null
    }
    return this._behaviors[0]
};
SceneObject.prototype.getBehaviorByIndex = function (a) {
    return this._behaviors[a || 0]
};
SceneObject.prototype.getBehaviors = function () {
    return wade.cloneArray(this._behaviors)
};
SceneObject.prototype.getAlignment = function () {
    return {x: this._alignment.x, y: this._alignment.y}
};
SceneObject.prototype.setAlignment = function (a, b) {
    this._alignment.x = a;
    this._alignment.y = b
};
SceneObject.prototype.processEvent = function (a, b) {
    if (this._isTemplate)return !1;
    switch (a) {
        case "onAnimationStart":
            !this._animationsPlaying && (!this._moving && !this._angularVelocity) && wade.simulateSceneObject(this, !0);
            b.restarting || this._animationsPlaying++;
            break;
        case "onAnimationEnd":
            1 == this._animationsPlaying && (!this._moving && !this._angularVelocity) && wade.simulateSceneObject(this, !1), this._animationsPlaying--
    }
    return this.process(a, b)
};
SceneObject.prototype.process = function (a, b) {
    var c = !1;
    this[a] && (c = this[a](b));
    for (var d = 0; d < this._behaviors.length; d++)this._behaviors[d][a] && (c = c || this._behaviors[d][a](b));
    return c
};
SceneObject.prototype.getSpriteAtPosition = function (a) {
    for (var b = {isPresent: !1, topLayer: 9999, spriteIndex: 0}, c = 0; c < this._sprites.length; c++) {
        var d = this._sprites[c];
        if (d.containsScreenPoint(a) && d.isVisible()) {
            var e = d.getLayer(), f = !b.isPresent || e.id < b.topLayer;
            e.id == b.topLayer && b.isPresent && (f = 0 < e.compareSprites(d, this._sprites[b.spriteIndex]));
            f && (b = {
                isPresent: !0,
                topLayer: e.id,
                spriteIndex: c
            }, d = d.getWorldOffset(a), e = this._spriteOffsets[c], d.x += e.x, d.y += e.y, b.relativeWorldPosition = d)
        }
    }
    return b
};
SceneObject.prototype.setSpriteOffsets = function (a) {
    var b;
    if (jQuery.isArray(a))for (b = this._spriteOffsets.length = 0; b < a.length; b++) {
        var c = this._spriteOffsets[b] = a[b];
        c.x = c.originalX = c.x || 0;
        c.y = c.originalY = c.y || 0;
        c.angle = c.angle || 0;
        this._rotation && wade.vec2.rotateInPlace(c, this._rotation)
    } else a.x = a.originalX = a.x || 0, a.y = a.originalY = a.y || 0, a.angle = a.angle || 0, this._spriteOffsets = [a], this._rotation && wade.vec2.rotateInPlace(a, this._rotation);
    for (b = 0; b < this._spriteOffsets.length; b++)this._sprites[b] && (this._sprites[b].setPosition(this._position.x +
    this._spriteOffsets[b].x, this._position.y + this._spriteOffsets[b].y), this._sprites[b].setRotation(this._rotation + this._spriteOffsets[b].angle))
};
SceneObject.prototype.getSpriteOffset = function (a) {
    a = this._spriteOffsets[a];
    return {x: a.x, y: a.y, angle: a.angle}
};
SceneObject.prototype.setSpriteOffset = function (a, b) {
    var c = this._spriteOffsets[a];
    c.x = c.originalX = b.x || 0;
    c.y = c.originalY = b.y || 0;
    c.angle = b.angle || 0;
    this._rotation && wade.vec2.rotateInPlace(c, this._rotation);
    this._sprites[a] && (this._sprites[a].setPosition(this._position.x + c.x, this._position.y + c.y), this._sprites[a].setRotation(this._rotation + c.angle))
};
SceneObject.prototype.isMoving = function () {
    return this._moving
};
SceneObject.prototype.setVisible = function (a) {
    for (var b = 0; b < this._sprites.length; b++)this._sprites[b].setVisible(a)
};
SceneObject.prototype.addSprite = function (a, b, c) {
    "undefined" == typeof c ? c = this._sprites.length : c > this._sprites.length && (c = this._sprites.length);
    a.setSceneObject(this);
    this._sprites.splice(c, 0, a);
    b = b ? {x: b.x || 0, y: b.y || 0, angle: b.angle || 0, originalX: b.x || 0, originalY: b.y || 0} : {
        x: 0,
        y: 0,
        angle: 0,
        originalX: 0,
        originalY: 0
    };
    this._rotation && wade.vec2.rotateInPlace(b, this._rotation);
    this._spriteOffsets.splice(c, 0, b);
    a.setPosition(this._position.x + b.x, this._position.y + b.y);
    a.setRotation(this._rotation + b.angle);
    this._inScene &&
    this._renderer.addSprite(a);
    return c
};
SceneObject.prototype.removeSpriteByIndex = function (a) {
    this._renderer.removeSprite(this._sprites[a]);
    wade.removeObjectFromArrayByIndex(a, this._sprites);
    wade.removeObjectFromArrayByIndex(a, this._spriteOffsets)
};
SceneObject.prototype.removeSprite = function (a) {
    for (var b = 0; b < this._sprites.length; b++)if (this._sprites[b] == a) {
        this.removeSpriteByIndex(b);
        break
    }
};
SceneObject.prototype.removeAllSprites = function () {
    for (var a = this._sprites.length - 1; 0 <= a; a--)this._renderer.removeSprite(this._sprites[a]);
    this._spriteOffsets.length = 0;
    this._sprites.length = 0
};
SceneObject.prototype.getSprite = function (a) {
    return this._sprites[a ? a : 0]
};
SceneObject.prototype.getSpriteIndex = function (a) {
    return this._sprites.indexOf(a)
};
SceneObject.prototype.isInScene = function () {
    return this._inScene
};
SceneObject.prototype.getSpriteCount = function () {
    return this._sprites.length
};
SceneObject.prototype.addBehavior = function (a) {
    this._behaviorClasses ? this._behaviorClasses.push(a) : this._behaviorClasses = [a];
    a = new a;
    a.owner = this;
    this._behaviors.push(a);
    return a
};
SceneObject.prototype.removeBehavior = function (a) {
    for (var b = 0; b < this._behaviors.length; b++)if (a == this._behaviors[b].name)return wade.removeObjectFromArrayByIndex(b, this._behaviors), wade.removeObjectFromArrayByIndex(b, this._behaviorClasses), !0;
    return !1
};
SceneObject.prototype.removeBehaviorByIndex = function (a) {
    wade.removeObjectFromArrayByIndex(a, this._behaviors)
};
SceneObject.prototype.isAnimating = function () {
    return this._animationsPlaying ? !0 : !1
};
SceneObject.prototype.getTargetPosition = function () {
    return this._targetPosition ? {x: this._targetPosition.x, y: this._targetPosition.y} : null
};
SceneObject.prototype.getTargetRotation = function () {
    return this._rotationTarget.valid ? this._rotationTarget.value : this._rotation
};
SceneObject.prototype.getMovementSpeed = function () {
    return Math.sqrt(this._linearVelocity.x * this._linearVelocity.x + this._linearVelocity.y * this._linearVelocity.y)
};
SceneObject.prototype.overlapsSprite = function (a) {
    for (var b = 0; b < this._sprites.length; b++)if (this._sprites[b].overlapsSprite(a))return !0;
    return !1
};
SceneObject.prototype.overlapsObject = function (a) {
    for (var b = a.getSpriteCount(), c = 0; c < b; c++)if (this.overlapsSprite(a.getSprite(c)))return !0;
    return !1
};
SceneObject.prototype.clone = function () {
    var a = new SceneObject;
    jQuery.extend(a, this);
    a._inScene = 0;
    a._isTemplate = !1;
    a._sprites = [];
    for (var b = 0; b < this._sprites.length; b++) {
        var c = this._sprites[b].clone();
        c._sceneObject = a;
        this._isTemplate && c.setVisible(!0);
        a._sprites.push(c)
    }
    a._position = {x: this._position.x, y: this._position.y};
    a._linearVelocity = {x: this._linearVelocity.x, y: this._linearVelocity.y};
    a._targetPosition = this._targetPosition ? {x: this._targetPosition.x, y: this._targetPosition.y} : 0;
    a._alignment = {
        x: this._alignment.x,
        y: this._alignment.y
    };
    a._spriteOffsets = jQuery.extend(!0, [], this._spriteOffsets);
    a._behaviors = [];
    if (a._behaviorClasses)for (b = 0; b < a._behaviorClasses.length; b++)a._behaviors[b] = "function" == typeof this._behaviors[b].clone ? this._behaviors[b].clone(a) : new this._behaviorClasses[b], a._behaviors[b].owner = a;
    this.simulated && (a.simulated = !1, wade.simulateSceneObject(a, !0));
    return a
};
SceneObject.prototype.serialize = function (a, b, c) {
    for (var d = 0; d < this._behaviors.length; d++)this._behaviors[d].preSerialize && this._behaviors[d].preSerialize();
    var e = {
        type: "SceneObject",
        position: {x: this._position.x, y: this._position.y},
        rotation: this._rotation,
        behaviors: [],
        sprites: [],
        spriteOffsets: [],
        alignment: {x: this._alignment.x || "center", y: this._alignment.y || "center"},
        name: this._name,
        isTemplate: this._isTemplate,
        addToScene: this._inScene ? {autoListen: this.autoListen, params: this.addToSceneParams} : null,
        properties: {}
    };
    if (this._behaviorClasses)for (d = 0; d < this._behaviorClasses.length; d++) {
        var f = this._behaviors[d].name || this._behaviorClasses[d].name;
        if (f) {
            var g;
            if (this._behaviors[d].serialize)g = this._behaviors[d].serialize(); else {
                g = {};
                for (var i in this._behaviors[d])if (this._behaviors[d].hasOwnProperty(i) && "_" != i[0] && "name" != i)try {
                    var l = JSON.stringify(this._behaviors[d][i]);
                    g[i] = JSON.parse(l)
                } catch (j) {
                }
            }
            f = {name: f};
            g && (f.properties = g);
            e.behaviors.push(f)
        } else {
            for (var h in window)try {
                if (window.hasOwnProperty(h) && "function" == typeof window[h] && window[h] == this._behaviorClasses[d]) {
                    f = h;
                    break
                }
            } catch (m) {
            }
            f || wade.log("Warning - trying to export a scene object with an unnamed behavior, which will be skipped. Add a 'name' property to your behaviors to correct this.")
        }
    }
    for (d = 0; d < this._spriteOffsets.length; d++)e.spriteOffsets.push({
        x: this._spriteOffsets[d].x,
        y: this._spriteOffsets[d].y,
        angle: this._spriteOffsets[d].angle
    });
    for (d = 0; d < this._sprites.length; d++)e.sprites.push(this._sprites[d].serialize());
    d = ["autoListen", "addToSceneParams",
        "simulated", "eventResponse"];
    b && (d = d.concat(b));
    for (var n in this)if (this.hasOwnProperty(n) && "_" != n[0] && -1 == d.indexOf(n))if (c && "function" == typeof this[n])e.functions = e.functions || {}, e.functions[n] = this[n].toString(); else try {
        var p = JSON.stringify(this[n]);
        e.properties[n] = JSON.parse(p)
    } catch (t) {
    }
    for (d = this._behaviors.length - 1; 0 <= d; d--)this._behaviors[d].postSerialize && this._behaviors[d].postSerialize();
    return a ? JSON.stringify(e) : e
};
SceneObject.prototype.getOverlappingObjects = function (a, b) {
    for (var c = [], d = 0; d < this._sprites.length; d++)for (var e = this._sprites[d].getOverlappingObjects(a, b), f = 0; f < e.length; f++)(0 == d || -1 == c.indexOf(e[f])) && c.push(e[f]);
    return c
};
SceneObject.prototype.setAngularVelocity = function (a) {
    a ? !this._animationsPlaying && (!this._moving && !this._angularVelocity) && wade.simulateSceneObject(this, !0) : (this._angularVelocity && (!this._animationsPlaying && !this._moving) && wade.simulateSceneObject(this, !1), this._rotationTarget.valid = !1);
    this._angularVelocity = a
};
SceneObject.prototype.getAngularVelocity = function () {
    return this._angularVelocity
};
SceneObject.prototype.setVelocity = function (a) {
    a.x || a.y ? (this._linearVelocity.x = a.x, this._linearVelocity.y = a.y, this._targetPosition = 0, !this._animationsPlaying && (!this._moving && !this._angularVelocity) && wade.simulateSceneObject(this, !0), this._moving = !0) : (this._linearVelocity.x || this._linearVelocity.y) && this.stopMoving()
};
SceneObject.prototype.getVelocity = function () {
    return {x: this._linearVelocity.x, y: this._linearVelocity.y}
};
SceneObject.prototype.schedule = function (a, b, c) {
    if (this.isInScene()) {
        var d = this;
        this._timeouts.push({
            handle: setTimeout(function () {
                d.processEvent(b, c)
            }, a), name: b
        })
    } else wade.log("Warning - Trying to schedule an event for an object that is not in the scene.")
};
SceneObject.prototype.unschedule = function (a) {
    for (var b = this._timeouts.length; 0 <= b; b--)this._timeouts[b].name == a && (clearTimeout(this._timeouts[b].handle), wade.removeObjectFromArrayByIndex(b, this._timeouts))
};
SceneObject.prototype.unscheduleAll = function () {
    for (var a = 0; a < this._timeouts.length; a++)clearTimeout(this._timeouts[a].handle);
    this._timeouts.length = 0
};
SceneObject.prototype.setName = function (a) {
    if (!this._name || this._name != a) {
        var b = this._name;
        this._name = a;
        wade.onObjectNameChange(this, b, this._name)
    }
};
SceneObject.prototype.getName = function () {
    return this._name
};
SceneObject.prototype.listenFor = function (a) {
    wade.addEventListener(this, a)
};
SceneObject.prototype.stopListeningFor = function (a) {
    wade.removeEventListener(this, a)
};
SceneObject.prototype.isListeningFor = function (a) {
    return wade.isEventListener(this, a)
};
SceneObject.prototype.isTemplate = function () {
    return this._isTemplate
};
SceneObject.prototype.setAsTemplate = function (a) {
    "undefined" == typeof a && (a = !0);
    this._isTemplate = a
};
SceneObject.prototype.addSpritesToRenderer = function (a) {
    this._inScene = !0;
    this._renderer = a;
    for (var b = 0; b < this._sprites.length; b++)a.addSprite(this._sprites[b])
};
SceneObject.prototype.removeSpritesFromRenderer = function () {
    if (this._inScene) {
        this._inScene = !1;
        for (var a = 0; a < this._sprites.length; a++)this._sprites[a].isVisible() && this._sprites[a].setDirtyArea(), this._renderer.removeSprite(this._sprites[a])
    }
};
function Sprite(a, b) {
    this._animations = {};
    this._currentAnimation = "default";
    var c = new Animation(a);
    c.sprite = this;
    c.name = this._currentAnimation;
    c.isDefault = !0;
    this._animations[this._currentAnimation] = c;
    this._numAnimations = 1;
    this._scaleFactor = {x: 1, y: 1};
    this._name = "";
    this._drawModifiers = [];
    this.draw = this.drawStatic;
    this.draw_gl = this.drawStatic_gl;
    var d;
    if (c = "object" == typeof a && a) {
        var e = a;
        this._sortPoint = e.sortPoint || {x: 0, y: 0};
        this._layer = wade.getLayer(e.layer || wade.defaultLayer);
        d = this._animations[this._currentAnimation].getFrameSize();
        this._size = e.size ? {x: e.size.x, y: e.size.y} : d;
        this._scaleFactor.x = e.size.x / d.x;
        this._scaleFactor.y = e.size.y / d.y;
        this._sizeWasSet = !e.autoResize;
        this._name = e.name || "";
        this._staticImageName = e.image;
        this._visible = "undefined" == typeof e.visible ? !0 : e.visible;
        d = e.image;
        if (e.animations)for (var f in e.animations)e.animations.hasOwnProperty(f) && this.addAnimation(new Animation(e.animations[f]), !0);
        if (e.properties)for (var g in e.properties)if (e.properties.hasOwnProperty(g))try {
            this[g] = JSON.parse(JSON.stringify(e.properties[g]))
        } catch (i) {
        }
    } else this._staticImageName =
        a, this._sortPoint = {
        x: 0,
        y: 0
    }, this._layer = wade.getLayer(b ? b : wade.defaultLayer), this._size = this._animations[this._currentAnimation].getImageSize(), this._sizeWasSet = !1, this._visible = !0, d = a;
    this._sceneObject = null;
    this._position = {x: 0, y: 0};
    this._rotation = this._cornerY = this._cornerX = 0;
    window.Float32Array && (this._f32PositionAndSize = new Float32Array([0, 0, 0, 0]), this._f32AnimFrameInfo = new Float32Array([0, 0, 1, 1]), this._f32RotationAlpha = new Float32Array([0, 0]));
    this.orientedBoundingBox = {};
    this.boundingBox = {};
    this.updateBoundingBox();
    this.setActiveImage(wade.getFullPathAndFileName(d));
    c && e.drawModifiers && this.setDrawModifiers(e.drawModifiers);
    c && (a.currentAnimation && a.animations && a.animations[a.currentAnimation] && !a.animations[a.currentAnimation].stopped) && this.playAnimation(a.currentAnimation, a.animations[a.currentAnimation].playMode)
}
Sprite.prototype.setPosition = function (a, b) {
    var c, d;
    "object" == typeof a ? (c = a.x, d = a.y) : (c = a, d = b);
    this.setDirtyArea();
    this._position.x = c;
    this._position.y = d;
    this.updateBoundingBox();
    this._cornerX = c - this._size.x / 2;
    this._cornerY = d - this._size.y / 2;
    this.setDirtyArea()
};
Sprite.prototype.getPosition = function () {
    return {x: this._position.x, y: this._position.y}
};
Sprite.prototype.setRotation = function (a) {
    a != this._rotation && (this.setDirtyArea(), this._rotation = a, this.updateOrientedBoundingBox(), this.updateBoundingBox(), this.setDirtyArea())
};
Sprite.prototype.getRotation = function () {
    return this._rotation
};
Sprite.prototype.setSize = function (a, b) {
    this._sizeWasSet = !0;
    if (a != this._size.x || b != this._size.y) {
        this.setDirtyArea();
        this._size = {x: a, y: b};
        var c = this._animations[this._currentAnimation].getFrameSize();
        this._scaleFactor.x = this._size.x / c.x;
        this._scaleFactor.y = this._size.y / c.y;
        this._cornerX = this._position.x - a / 2;
        this._cornerY = this._position.y - b / 2;
        this._rotation && this.updateOrientedBoundingBox();
        this.updateBoundingBox();
        this.setDirtyArea()
    }
};
Sprite.prototype.getSize = function () {
    return {x: this._size.x, y: this._size.y}
};
Sprite.prototype.setSortPoint = function (a, b) {
    this._sortPoint.x = a;
    this._sortPoint.y = b
};
Sprite.prototype.getSortPoint = function () {
    return {x: this._sortPoint.x, y: this._sortPoint.y}
};
Sprite.prototype.addAnimation = function (a, b, c) {
    "string" != typeof a && a instanceof Animation && (c = b, b = a, a = "");
    a = a || b.name;
    a || (wade.unnamedAnimationCount = wade.unnamedAnimationCount + 1 || 1, a = "__wade_unnamed_anim_" + wade.unnamedAnimationCount);
    var d = 1 == this._numAnimations && !this._animations[this._currentAnimation].getImageName(), e = !c && !this._sizeWasSet && d;
    d && (delete this._animations[this._currentAnimation], this._numAnimations = 0);
    this._animations[a] || this._numAnimations++;
    this._animations[a] = b;
    b.name = a;
    b.sprite =
        this;
    1 == this._numAnimations && !c && (this.playAnimation(a), e && "ok" == wade.getLoadingStatus(b.getImageName()) && (a = b.getFrameSize(), this.setSize(a.x, a.y)), this.updateBoundingBox());
    this.draw == this.drawStatic && (this.draw = this.drawAnimated, this.draw_gl = this.drawAnimated_gl)
};
Sprite.prototype.getAnimation = function (a) {
    return this._animations[a || this._currentAnimation]
};
Sprite.prototype.playAnimation = function (a, b) {
    var c = this._animations[a];
    if (c) {
        a != this._currentAnimation && this.setDirtyArea();
        this._currentAnimation = a;
        c.play(b);
        var d = c.getFrameSize();
        this._scaleFactor.x = this._size.x / d.x;
        this._scaleFactor.y = this._size.y / d.y;
        this.setActiveImage(c.getImageName());
        this.updateBoundingBox()
    }
};
Sprite.prototype.getScaleFactor = function () {
    return {x: this._scaleFactor.x, y: this._scaleFactor.y}
};
Sprite.prototype.step = function () {
    var a = this._animations[this._currentAnimation];
    a && a.isPlaying() && a.step()
};
Sprite.prototype.setSceneObject = function (a) {
    if (a != this._sceneObject) {
        var b = this._animations[this._currentAnimation];
        b && b.isPlaying() && (a && a.processEvent("onAnimationStart", this._currentAnimation), this._sceneObject && this._sceneObject.processEvent("onAnimationEnd", this._currentAnimation));
        this._sceneObject = a
    }
};
Sprite.prototype.getSceneObject = function () {
    return this._sceneObject
};
Sprite.prototype.getScreenPositionAndExtents = function () {
    var a = this._layer.worldDirectionToScreen(this.getSize()), b = this._layer.worldPositionToScreen(this._position);
    return {extents: {x: a.x / 2, y: a.y / 2}, position: b}
};
Sprite.prototype.containsScreenPoint = function (a) {
    if (this._rotation)return a = wade.screenPositionToWorld(this._layer.id, a), wade.orientedBoxContainsPoint(this.orientedBoundingBox, a);
    var b = this.getScreenPositionAndExtents(), c = b.position.y - b.extents.y, d = b.position.x + b.extents.x, e = b.position.y + b.extents.y;
    return a.x >= b.position.x - b.extents.x && a.x <= d && a.y >= c && a.y <= e
};
Sprite.prototype.getWorldOffset = function (a) {
    a = this._layer.screenPositionToWorld(a);
    return {x: a.x - this._position.x, y: a.y - this._position.y}
};
Sprite.prototype.setDirtyArea = function () {
    this._layer.isUsingQuadtree() && this._layer.addDirtyArea(this.boundingBox)
};
Sprite.prototype.setVisible = function (a) {
    a != this._visible && (this._visible = a, this.setDirtyArea())
};
Sprite.prototype.isVisible = function () {
    return this._visible
};
Sprite.prototype.setImageFile = function (a, b) {
    this.setDirtyArea();
    this._animations[this._currentAnimation] = new Animation(a, 1, 1, 0);
    if (b || !this._sizeWasSet) {
        var c = this._animations[this._currentAnimation].getFrameSize();
        this.setSize(c.x, c.y)
    }
    this._staticImageName = a;
    this.setActiveImage(wade.getFullPathAndFileName(a));
    this.setDirtyArea()
};
Sprite.prototype.bringToFront = function () {
    !this._sceneObject || !this._sceneObject.isInScene() ? wade.log("Cannot change the order of sprites before they are added to the scene") : this._layer.bringSpriteToFront(this)
};
Sprite.prototype.pushToBack = function () {
    !this._sceneObject || !this._sceneObject.isInScene() ? wade.log("Cannot change the order of sprites before they are added to the scene") : this._layer.pushSpriteToBack(this)
};
Sprite.prototype.putBehindSprite = function (a) {
    this._layer != a._layer ? wade.log("Cannot put a sprite behind another sprite that is on a different layer") : !this._sceneObject || !this._sceneObject.isInScene() || !a._sceneObject || !a._sceneObject.isInScene() ? wade.log("Cannot change the order of sprites before they are added to the scene") : this._layer.putSpriteBehindSprite(this, a)
};
Sprite.prototype.getCurrentAnimation = function () {
    return this._animations[this._currentAnimation]
};
Sprite.prototype.getCurrentAnimationName = function () {
    return this._currentAnimation
};
Sprite.prototype.hasAnimation = function (a) {
    return this._animations[a] ? !0 : !1
};
Sprite.prototype.setDrawFunction = function (a) {
    this.draw = this.draw_gl = a;
    this.setDirtyArea()
};
Sprite.prototype.getDrawFunction = function () {
    return "webgl" == this.getLayer().getRenderMode() ? this.draw_gl : this.draw
};
Sprite.prototype.setDrawModifiers = function (a) {
    var b = "webgl" == this._layer.getRenderMode() ? Sprite.prototype.draw_gl : Sprite.prototype.draw;
    if (a)for (b = this._drawModifiers.length = 0; b < a.length; b++) {
        var c = a[b];
        this._drawModifiers.push(wade.cloneObject(c));
        switch (c.type) {
            case "alpha":
                1 != c.alpha && this.setDrawFunction(wade.drawFunctions.alpha_(c.alpha, this.getDrawFunction()));
                break;
            case "fadeOpacity":
                this.setDrawFunction(wade.drawFunctions.fadeOpacity_(c.start, c.end, c.time, this.getDrawFunction()));
                break;
            case "mirror":
                this.setDrawFunction(wade.drawFunctions.mirror_(this.getDrawFunction()));
                break;
            case "flip":
                this.setDrawFunction(wade.drawFunctions.flip_(this.getDrawFunction()));
                break;
            case "blink":
                this.setDrawFunction(wade.drawFunctions.blink_(c.timeOn, c.timeOff, this.getDrawFunction()))
        }
    } else this.setDrawFunction(b)
};
Sprite.prototype.getDrawModifiers = function () {
    return wade.cloneArray(this._drawModifiers)
};
Sprite.prototype.overlapsSprite = function (a) {
    var b = this._layer.id, c = a.getLayer().id;
    if (b == c)return wade.boxIntersectsBox(this.boundingBox, a.boundingBox);
    b = wade.worldBoxToScreen(b, this.boundingBox);
    a = wade.worldBoxToScreen(c, a.boundingBox);
    return wade.boxIntersectsBox(b, a)
};
Sprite.prototype.getImageName = function () {
    return this._activeImage
};
Sprite.prototype.setLayer = function (a) {
    this._sceneObject && this._sceneObject.isInScene() ? (this._layer && this._layer.removeSprite(this), this._layer = wade.getLayer(a ? a : 1), this._layer.addSprite(this)) : this._layer = wade.getLayer(a ? a : 1)
};
Sprite.prototype.drawToImage = function (a, b, c, d, e) {
    var f = c || {x: 0, y: 0}, c = document.createElement("canvas"), g = c.getContext("2d");
    b || "ok" != wade.getLoadingStatus(a) ? (c.width = this.boundingBox.maxX - this.boundingBox.minX + Math.abs(f.x), c.height = this.boundingBox.maxY - this.boundingBox.minY + Math.abs(f.y)) : (b = wade.getImage(a), c.width = b.width, c.height = b.height, g.drawImage(b, 0, 0));
    b = {x: this._position.x, y: this._position.y};
    this._position.x = f.x + c.width / (2 * (d && d.horizontalScale || 1));
    this._position.y = f.y + c.height / (2 *
    (d && d.verticalScale || 1));
    this._cornerX = this._position.x - this._size.x / 2;
    this._cornerY = this._position.y - this._size.y / 2;
    f = g.globalCompositeOperation;
    e && (g.globalCompositeOperation = e);
    d ? (g.save(), g.setTransform(d.horizontalScale, d.horizontalSkew, d.verticalSkew, d.verticalScale, d.horizontalTranslate, d.verticalTranslate), this.draw(g), g.restore()) : this.draw(g);
    g.globalCompositeOperation = f;
    this._position = b;
    this._cornerX = this._position.x - this._size.x / 2;
    this._cornerY = this._position.y - this._size.y / 2;
    wade.setImage(a,
        c)
};
Sprite.prototype.stopAnimation = function () {
    var a = this._animations[this._currentAnimation];
    a && a.stop()
};
Sprite.prototype.resumeAnimation = function () {
    var a = this._animations[this._currentAnimation];
    a && a.resume()
};
Sprite.prototype.clone = function () {
    var a = new Sprite(null, this._layer.id);
    jQuery.extend(a, this);
    a._sceneObject = 0;
    a.quadTreeNode = 0;
    if (this._animations) {
        a._animations = {};
        for (var b in this._animations)this._animations.hasOwnProperty(b) && (a._animations[b] = this._animations[b].clone(), a._animations[b].sprite = a)
    }
    a._position = {x: this._position.x, y: this._position.y};
    a._sortPoint = {x: this._sortPoint.x, y: this._sortPoint.y};
    a._size = {x: this._size.x, y: this._size.y};
    a._scaleFactor = {x: this._scaleFactor.x, y: this._scaleFactor.y};
    a.boundingBox = jQuery.extend({}, this.boundingBox);
    a.orientedBoundingBox = jQuery.extend({}, this.orientedBoundingBox);
    window.Float32Array && (a._f32AnimFrameInfo = this._f32AnimFrameInfo ? new Float32Array([this._f32AnimFrameInfo[0], this._f32AnimFrameInfo[1], this._f32AnimFrameInfo[2], this._f32AnimFrameInfo[3]]) : new Float32Array([0, 0, 1, 1]), a._f32PositionAndSize = this._f32PositionAndSize ? new Float32Array([this._f32PositionAndSize[0], this._f32PositionAndSize[1], this._f32PositionAndSize[2], this._f32PositionAndSize[3]]) :
        new Float32Array([0, 0, 1, 1]), a._f32RotationAlpha = this._f32RotationAlpha ? new Float32Array([this._f32RotationAlpha[0], this._f32RotationAlpha[1]]) : new Float32Array([0, 0]));
    a._activeImage && wade.addImageUser(a._activeImage, a);
    return a
};
Sprite.prototype.serialize = function (a, b) {
    var c = {
        type: "Sprite",
        animations: {},
        currentAnimation: this.getCurrentAnimationName(),
        sortPoint: {x: this._sortPoint.x, y: this._sortPoint.y},
        layer: this._layer.id,
        size: {x: this._size.x, y: this._size.y},
        autoResize: !this._sizeWasSet,
        visible: this._visible,
        image: this._staticImageName || "",
        name: this._name,
        drawModifiers: wade.cloneArray(this._drawModifiers),
        properties: {}
    }, d;
    for (d in this._animations)this._animations.hasOwnProperty(d) && !this._animations[d].isDefault && (c.animations[d] =
        this._animations[d].serialize());
    d = ["sceneObject", "boundingBox", "orientedBoundingBox", "id", "needsDrawing"];
    b && (d = d.concat(b));
    for (var e in this)if (this.hasOwnProperty(e) && "_" != e[0] && -1 == d.indexOf(e))try {
        var f = JSON.stringify(this[e]);
        c.properties[e] = JSON.parse(f)
    } catch (g) {
    }
    return a ? JSON.stringify(c) : c
};
Sprite.prototype.setName = function (a) {
    this._name = a
};
Sprite.prototype.getName = function () {
    return this._name
};
Sprite.prototype.getOverlappingObjects = function (a, b) {
    var c;
    if ("axis-aligned" == (b || "axis-aligned")) {
        var d;
        a ? (c = wade.worldBoxToScreen(this._layer.id, this.boundingBox), d = wade.getObjectsInScreenArea(c)) : d = wade.getObjectsInArea(this.boundingBox, this._layer.id);
        this._sceneObject && wade.removeObjectFromArray(this._sceneObject, d);
        return d
    }
    c = [];
    d = [];
    a ? (c = wade.worldBoxToScreen(this._layer.id, this.boundingBox), c = wade.getSpritesInScreenArea(c)) : c = wade.getSpritesInArea(this.boundingBox, this._layer.id);
    for (var e =
        this._rotation ? "orientedBox" : "box", f = this._rotation ? this.orientedBoundingBox : this.boundingBox, g = 0; g < c.length; g++) {
        var i = c[g];
        i != this && (i.getRotation() ? wade[e + "IntersectsOrientedBox"](f, i.orientedBoundingBox) && (d.push(i), d.push(i)) : wade[e + "IntersectsBox"](f, i.boundingBox) && d.push(i))
    }
    for (e = c.length = 0; e < d.length; e++)f = d[e].getSceneObject(), -1 == c.lastIndexOf(f) && c.push(f);
    return c
};
Sprite.prototype.getLayerId = function () {
    return this._layer.id
};
Sprite.prototype.cache = function () {
    wade.spriteCacheCount = wade.spriteCacheCount + 1 || 1;
    var a = "__wade_sprite_cache" + wade.spriteCacheCount, b = this._rotation;
    b && (this._rotation = 0, this.updateOrientedBoundingBox(), this.updateBoundingBox());
    this.drawToImage(a, !0);
    b && (this._rotation = b, this.updateOrientedBoundingBox(), this.updateBoundingBox());
    this.setImageFile(a, !0);
    a = this._animations[this._currentAnimation];
    this.draw = (a = !(a && a.isPlaying())) ? Sprite.prototype.drawStatic : Sprite.prototype.draw;
    this.draw_gl = a ? Sprite.prototype.drawStatic_gl :
        Sprite.prototype.draw_gl;
    this.setDirtyArea()
};
Sprite.prototype.getIndexInLayer = function () {
    return this._layer.getIndexOfSprite(this)
};
Sprite.prototype.setIndexInLayer = function (a) {
    this.setDirtyArea();
    return this._layer.setIndexOfSprite(this, a)
};
Sprite.prototype.getLayer = function () {
    return this._layer
};
Sprite.prototype.onAnimationStart = function (a, b) {
    this._sceneObject && this._sceneObject.processEvent("onAnimationStart", {name: a, restarting: b})
};
Sprite.prototype.onAnimationEnd = function (a) {
    this._sceneObject && this._sceneObject.processEvent("onAnimationEnd", {name: a})
};
Sprite.prototype.updateBoundingBox = function () {
    var a = this._animations[this._currentAnimation].getOffset_ref();
    if (this._rotation)this.boundingBox.minX = this._position.x - this.orientedBoundingBox.rx - wade.c_epsilon + a.x, this.boundingBox.minY = this._position.y - this.orientedBoundingBox.ry - wade.c_epsilon + a.y, this.boundingBox.maxX = this._position.x + this.orientedBoundingBox.rx + wade.c_epsilon + a.x, this.boundingBox.maxY = this._position.y + this.orientedBoundingBox.ry + wade.c_epsilon + a.y; else {
        var b = this._size.x / 2, c = this._size.y /
            2;
        this.boundingBox.minX = this._position.x - b - wade.c_epsilon + a.x;
        this.boundingBox.minY = this._position.y - c - wade.c_epsilon + a.y;
        this.boundingBox.maxX = this._position.x + b + wade.c_epsilon + a.x;
        this.boundingBox.maxY = this._position.y + c + wade.c_epsilon + a.y
    }
    this.orientedBoundingBox.centerX = this._position.x + a.x;
    this.orientedBoundingBox.centerY = this._position.y + a.y;
    this._f32PositionAndSize && (this._f32PositionAndSize[0] = this._position.x + a.x, this._f32PositionAndSize[1] = this._position.y + a.y, this._f32PositionAndSize[2] =
        this._size.x, this._f32PositionAndSize[3] = this._size.y);
    this._sceneObject && this._sceneObject.isInScene() && this._layer.onSpritePositionChanged(this)
};
Sprite.prototype.updateOrientedBoundingBox = function () {
    var a = this._size.x / 2, b = this._size.y / 2, c = Math.cos(this._rotation), d = Math.sin(this._rotation), e = a * c, f = a * d, d = b * d, c = b * c, g = e + d, i = f - c, l = e - d, j = f + c;
    this.orientedBoundingBox.rx = Math.max(Math.abs(g), Math.abs(l));
    this.orientedBoundingBox.ry = Math.max(Math.abs(i), Math.abs(j));
    this.orientedBoundingBox.rx0 = g;
    this.orientedBoundingBox.ry0 = i;
    this.orientedBoundingBox.rx1 = l;
    this.orientedBoundingBox.ry1 = j;
    this.orientedBoundingBox.axisXx = e;
    this.orientedBoundingBox.axisXy =
        f;
    this.orientedBoundingBox.axisYx = -d;
    this.orientedBoundingBox.axisYy = c;
    this.orientedBoundingBox.rotation = this._rotation;
    this.orientedBoundingBox.halfWidth = a;
    this.orientedBoundingBox.halfHeight = b;
    this._f32RotationAlpha && (this._f32RotationAlpha[0] = this._rotation)
};
Sprite.prototype.drawStatic = function (a) {
    a.isWebGl ? this.drawStatic_gl(a) : this._visible && (wade.numDrawCalls++, this._rotation && (a.save(), a.translate(this._position.x, this._position.y), a.rotate(this._rotation), a.translate(-this._position.x, -this._position.y)), a.drawImage(this._image, this._cornerX, this._cornerY, this._size.x, this._size.y), this._rotation && a.restore())
};
Sprite.prototype.drawStatic_gl = function (a) {
    a.isWebGl ? this._visible ? (wade.numDrawCalls++, this._f32RotationAlpha[1] = a.globalAlpha, "lighter" == a.globalCompositeOperation && a.blendFuncSeparate(a.SRC_ALPHA, a.ONE, a.SRC_ALPHA, a.ONE), a.uniform4fv(a.uniforms.uPositionAndSize, this._f32PositionAndSize), a.uniform4fv(a.uniforms.uAnimFrameInfo, this._f32AnimFrameInfo), a.uniform2fv(a.uniforms.uRotationAlpha, this._f32RotationAlpha), a.setTextureImage(this._image), a.drawArrays(a.TRIANGLE_STRIP, 0, 4), a.globalCompositeOperation &&
    "sourceOver" != a.globalCompositeOperation && a.blendFuncSeparate(a.SRC_ALPHA, a.ONE_MINUS_SRC_ALPHA, a.ONE, a.ONE_MINUS_SRC_ALPHA)) : a.setTextureImage(this._image, !0) : this.drawStatic(a)
};
Sprite.prototype.drawAnimated = function (a) {
    if (a.isWebGl)this.drawAnimated_gl(a); else if (this._visible) {
        var b = this._animations[this._currentAnimation];
        b && (this._rotation && (a.save(), a.translate(this._position.x, this._position.y), a.rotate(this._rotation), a.translate(-this._position.x, -this._position.y)), b.draw(a, this._position, this._size), this._rotation && a.restore())
    }
};
Sprite.prototype.drawAnimated_gl = function (a) {
    if (a.isWebGl) {
        var b = this._animations[this._currentAnimation];
        b && (this._visible ? ("lighter" == a.globalCompositeOperation && a.blendFuncSeparate(a.SRC_ALPHA, a.ONE, a.SRC_ALPHA, a.ONE), this._f32RotationAlpha[1] = a.globalAlpha, b.draw_gl(a, this._f32PositionAndSize, this._f32RotationAlpha), a.globalCompositeOperation && "sourceOver" != a.globalCompositeOperation && a.blendFuncSeparate(a.SRC_ALPHA, a.ONE_MINUS_SRC_ALPHA, a.ONE, a.ONE_MINUS_SRC_ALPHA)) : a.setTextureImage(wade.getImage(b.getImageName()),
            !0))
    } else this.drawAnimated(a)
};
Sprite.prototype.draw = Sprite.prototype.drawAnimated;
Sprite.prototype.draw_gl = Sprite.prototype.drawAnimated_gl;
Sprite.prototype.setActiveImage = function (a) {
    var b = this._activeImage;
    this._activeImage && b != a && wade.removeImageUser(this._activeImage, this);
    this._activeImage = a;
    this._image = wade.getImage(a, "");
    a && (b != a && wade.addImageUser(a, this), "ok" != wade.getLoadingStatus(a) ? (wade.log("Loading " + a), wade.preloadImage(a)) : ((a = this._animations[this._currentAnimation].getImageName() == wade.getFullPathAndFileName(a)) && this._animations[this._currentAnimation].refreshImage(), this._sizeWasSet || (a ? (a = this._animations[this._currentAnimation].getFrameSize(),
        this.setSize(a.x, a.y)) : this.setSize(this._image.width, this._image.height))))
};
function TextSprite(a, b, c, d, e) {
    "object" == typeof a && a ? (b = a, a = b.text, this._font = b.font || "12px Arial", this._alignment = b.alignment || "left", this._color = b.color || "#000", this._visible = "undefined" != typeof b.visible ? b.visible : !0, this._layer = wade.getLayer(b.layer || wade.defaultLayer), this._maxWidth = b.maxWidth || 0, this._shadowColor = b.shadowColor || "#000", this._shadowBlur = b.shadowBlur || 0, this._shadowOffset = {
        x: b.shadowOffset && b.shadowOffset.x,
        y: b.shadowOffset && b.shadowOffset.y
    }, this._lineSpacing = b.lineSpacing || 1,
        this._maxLines = b.maxLines || 0, this._outlineColor = b.outlineColor || "#000", this._outlineWidth = b.outlineWidth || 0, this._boundsScale = {
        x: b.boundsScale && b.boundsScale.x,
        y: b.boundsScale && b.boundsScale.y
    }, this._sortPoint = {
        x: b.sortPoint && b.sortPoint.x,
        y: b.sortPoint && b.sortPoint.y
    }, this._fixedSize = "undefined" == typeof b.fixedSize ? !1 : b.fixedSize) : (this._font = b || "12px Arial", this._alignment = d || "left", this._color = c || "#000", this._visible = !0, this._layer = wade.getLayer(e || wade.defaultLayer), this._maxWidth = 0, this._shadowColor =
        "#000", this._shadowBlur = 0, this._shadowOffset = {
        x: 0,
        y: 0
    }, this._lineSpacing = 1, this._maxLines = 0, this._outlineColor = "#000", this._outlineWidth = 0, this._boundsScale = {
        x: 1,
        y: 1
    }, this._sortPoint = {x: 0, y: 0}, this._fixedSize = !1);
    this._sceneObject = this._cornerY = this._cornerX = this._image = 0;
    this._position = {x: 0, y: 0};
    this._centerOffset = {x: 0, y: 0};
    this._size = {x: 0, y: 0};
    this._numLines = 1;
    this._lines = [];
    this._lineHeight = 12;
    this._rotation = 0;
    this.orientedBoundingBox = {};
    this.boundingBox = {minX: 0, minY: 0, maxX: 0, maxY: 0};
    window.Float32Array &&
    (this._f32PositionAndSize = new Float32Array([0, 0, 0, 0]), this._f32AnimFrameInfo = new Float32Array([0, 0, 1, 1]), this._f32RotationAlpha = new Float32Array([0, 0]));
    this.setText(a || "")
}
TextSprite.prototype.setPosition = Sprite.prototype.setPosition;
TextSprite.prototype.getPosition = Sprite.prototype.getPosition;
TextSprite.prototype.setSortPoint = Sprite.prototype.setSortPoint;
TextSprite.prototype.getSortPoint = Sprite.prototype.getSortPoint;
TextSprite.prototype.getLayer = Sprite.prototype.getLayer;
TextSprite.prototype.getLayerId = Sprite.prototype.getLayerId;
TextSprite.prototype.getScreenBox = Sprite.prototype.getScreenBox;
TextSprite.prototype.containsScreenPoint = Sprite.prototype.containsScreenPoint;
TextSprite.prototype.getWorldOffset = Sprite.prototype.getWorldOffset;
TextSprite.prototype.updateOrientedBoundingBox = Sprite.prototype.updateOrientedBoundingBox;
TextSprite.prototype.setVisible = Sprite.prototype.setVisible;
TextSprite.prototype.isVisible = Sprite.prototype.isVisible;
TextSprite.prototype.bringToFront = Sprite.prototype.bringToFront;
TextSprite.prototype.pushToBack = Sprite.prototype.pushToBack;
TextSprite.prototype.putBehindSprite = Sprite.prototype.putBehindSprite;
TextSprite.prototype.setDrawFunction = Sprite.prototype.setDrawFunction;
TextSprite.prototype.getDrawFunction = Sprite.prototype.getDrawFunction;
TextSprite.prototype.overlapsSprite = Sprite.prototype.overlapsSprite;
TextSprite.prototype.getRotation = Sprite.prototype.getRotation;
TextSprite.prototype.setRotation = Sprite.prototype.setRotation;
TextSprite.prototype.getSceneObject = Sprite.prototype.getSceneObject;
TextSprite.prototype.getOverlappingObjects = Sprite.prototype.getOverlappingObjects;
TextSprite.prototype.setName = Sprite.prototype.setName;
TextSprite.prototype.getName = Sprite.prototype.getName;
TextSprite.prototype.getIndexInLayer = Sprite.prototype.getIndexInLayer;
TextSprite.prototype.setIndexInLayer = Sprite.prototype.setIndexInLayer;
TextSprite.prototype.setDrawModifiers = Sprite.prototype.setDrawModifiers;
TextSprite.prototype.getDrawModifiers = Sprite.prototype.getDrawModifiers;
TextSprite.prototype.setDirtyArea = function () {
    Sprite.prototype.setDirtyArea.apply(this)
};
TextSprite.prototype.drawToImage = function (a, b, c, d, e) {
    var f = c || {x: 0, y: 0}, c = document.createElement("canvas"), g = c.getContext("2d");
    b || "ok" != wade.getLoadingStatus(a) ? (c.width = this.boundingBox.maxX - this.boundingBox.minX + Math.abs(f.x), c.height = this.boundingBox.maxY - this.boundingBox.minY + Math.abs(f.y)) : (b = wade.getImage(a), c.width = b.width, c.height = b.height, g.drawImage(b, 0, 0));
    b = {x: this._position.x, y: this._position.y};
    this._position.x = f.x + c.width / (2 * (d && d.horizontalScale || 1)) - this._centerOffset.x;
    this._position.y =
        f.y + c.height / (2 * (d && d.verticalScale || 1)) - this._centerOffset.y;
    this._cornerX = this._position.x - this._size.x / 2 + this._centerOffset.x;
    this._cornerY = this._position.y - this._size.y / 2 + this._centerOffset.y;
    f = g.globalCompositeOperation;
    e && (g.globalCompositeOperation = e);
    d ? (g.save(), g.setTransform(d.horizontalScale, d.horizontalSkew, d.verticalSkew, d.verticalScale, d.horizontalTranslate, d.verticalTranslate), this.draw(g), g.restore()) : this.draw(g);
    g.globalCompositeOperation = f;
    this._position = b;
    this._cornerX = this._position.x -
    this._size.x / 2 + this._centerOffset.x;
    this._cornerY = this._position.y - this._size.y / 2 + this._centerOffset.y;
    wade.setImage(a, c)
};
TextSprite.prototype.cache = function () {
    this._cachedImageName || (wade.textSpriteCacheCount = wade.textSpriteCacheCount + 1 || 1, this._cachedImageName = "__wade_TextSprite_cache_" + wade.textSpriteCacheCount);
    var a = this._rotation;
    a && (this._rotation = 0, this.updateOrientedBoundingBox(), this.updateBoundingBox());
    this.drawToImage(this._cachedImageName, !0);
    a && (this._rotation = a, this.updateOrientedBoundingBox(), this.updateBoundingBox());
    this._image = wade.getImage(this._cachedImageName);
    wade.releaseImageReference(this._cachedImageName)
};
TextSprite.prototype.getImageName = function () {
    return this._cachedImageName || "__wade_TextSprite_no_image"
};
TextSprite.prototype.setActiveImage = function () {
};
TextSprite.prototype.getScreenPositionAndExtents = function () {
    var a = {
        x: (this.boundingBox.maxX + this.boundingBox.minX) / 2,
        y: (this.boundingBox.maxY + this.boundingBox.minY) / 2
    }, b = this._layer.worldDirectionToScreen({
        x: this.boundingBox.maxX - this.boundingBox.minX,
        y: this.boundingBox.maxY - this.boundingBox.minY
    }), a = this._layer.worldPositionToScreen(a);
    return {extents: {x: b.x / 2, y: b.y / 2}, position: a}
};
TextSprite.prototype.updateBoundingBox = function () {
    if (this._rotation)this.boundingBox.minX = this._position.x - this.orientedBoundingBox.rx - wade.c_epsilon + this._centerOffset.x, this.boundingBox.minY = this._position.y - this.orientedBoundingBox.ry - wade.c_epsilon + this._centerOffset.y, this.boundingBox.maxX = this._position.x + this.orientedBoundingBox.rx + wade.c_epsilon + this._centerOffset.x, this.boundingBox.maxY = this._position.y + this.orientedBoundingBox.ry + wade.c_epsilon + this._centerOffset.y; else {
        var a = this._size.x /
            2, b = this._size.y / 2;
        this.boundingBox.minX = this._position.x - a - wade.c_epsilon + this._centerOffset.x;
        this.boundingBox.minY = this._position.y - b - wade.c_epsilon + this._centerOffset.y;
        this.boundingBox.maxX = this._position.x + a + wade.c_epsilon + this._centerOffset.x;
        this.boundingBox.maxY = this._position.y + b + wade.c_epsilon + this._centerOffset.y
    }
    this.orientedBoundingBox.centerX = this._position.x + this._centerOffset.x;
    this.orientedBoundingBox.centerY = this._position.y + this._centerOffset.y;
    this._f32PositionAndSize && (this._f32PositionAndSize[0] =
        this.orientedBoundingBox.centerX, this._f32PositionAndSize[1] = this.orientedBoundingBox.centerY, this._f32PositionAndSize[2] = this._size.x, this._f32PositionAndSize[3] = this._size.y);
    this._sceneObject && this._sceneObject.isInScene() && this._layer.onSpritePositionChanged(this)
};
TextSprite.prototype.setText = function (a) {
    this.setDirtyArea();
    this._text = a.toString();
    this._fixedSize || (this._updateSize(), this.setDirtyArea());
    this._image = 0
};
TextSprite.prototype.getText = function () {
    return this._text
};
TextSprite.prototype.setMaxWidth = function (a) {
    this._maxWidth = a;
    !this._fixedSize && this._updateSize();
    this._image = 0
};
TextSprite.prototype.setMaxLines = function (a) {
    if (this._maxLines != a) {
        if (this._maxLines = a)this._numLines = Math.min(this._numLines, this._maxLines);
        !this._fixedSize && this._updateSize();
        this._image = 0
    }
};
TextSprite.prototype.setColor = function (a) {
    this._color = a;
    this.setDirtyArea();
    this._image = 0
};
TextSprite.prototype.setShadow = function (a, b, c, d) {
    this._shadowColor = a;
    this._shadowBlur = b;
    this._shadowOffset = {x: c ? c : 0, y: d ? d : 0};
    this.setDirtyArea();
    this._fixedSize || (this._updateSize(), this.setDirtyArea());
    this._image = 0
};
TextSprite.prototype.setFont = function (a) {
    this._font = a;
    this.setDirtyArea();
    this._fixedSize || (this._updateSize(), this.setDirtyArea());
    this._image = 0
};
TextSprite.prototype.setLineSpacing = function (a) {
    this._lineSpacing = a;
    this.setDirtyArea();
    this._fixedSize || (this._updateSize(), this.setDirtyArea());
    this._image = 0
};
TextSprite.prototype.setAlignment = function (a) {
    this._alignment = a;
    this.setDirtyArea();
    this._fixedSize || (this._updateSize(), this.setDirtyArea());
    this._image = 0
};
TextSprite.prototype.getLine = function (a) {
    return this._lines[a].text
};
TextSprite.prototype.getNumLines = function () {
    return this._numLines
};
TextSprite.prototype.getLineWidth = function (a) {
    return this._lines[a].width
};
TextSprite.prototype.setOutline = function (a, b) {
    this._outlineWidth = a;
    this._outlineColor = b || "#000";
    this.setDirtyArea();
    this._image = 0
};
TextSprite.prototype.clone = function () {
    var a = new TextSprite;
    jQuery.extend(a, this);
    a._sceneObject = 0;
    a.quadTreeNode = 0;
    a._position = {x: this._position.x, y: this._position.y};
    a._sortPoint = {x: this._sortPoint.x, y: this._sortPoint.y};
    a._boundsScale = {x: this._boundsScale.x, y: this._boundsScale.y};
    a._shadowOffset = {x: this._shadowOffset.x, y: this._shadowOffset.y};
    a._centerOffset = {x: this._centerOffset.x, y: this._centerOffset.y};
    a._size = {x: this._size.x, y: this._size.y};
    a.boundingBox = jQuery.extend({}, this.boundingBox);
    a.orientedBoundingBox =
        jQuery.extend({}, this.orientedBoundingBox);
    window.Float32Array && (a._f32AnimFrameInfo = this._f32AnimFrameInfo ? new Float32Array([this._f32AnimFrameInfo[0], this._f32AnimFrameInfo[1], this._f32AnimFrameInfo[2], this._f32AnimFrameInfo[3]]) : new Float32Array([0, 0, 1, 1]), a._f32PositionAndSize = this._f32PositionAndSize ? new Float32Array([this._f32PositionAndSize[0], this._f32PositionAndSize[1], this._f32PositionAndSize[2], this._f32PositionAndSize[3]]) : new Float32Array([0, 0, 1, 1]), a._f32RotationAlpha = this._f32RotationAlpha ?
        new Float32Array([this._f32RotationAlpha[0], this._f32RotationAlpha[1]]) : new Float32Array([0, 0]));
    this._cachedImageName && (a._cachedImageName = 0, a.cache());
    return a
};
TextSprite.prototype.serialize = function (a, b) {
    var c = {
        type: "TextSprite",
        text: this._text,
        font: this._font,
        alignment: this._alignment,
        color: this._color,
        visible: this._visible,
        layer: this._layer.id,
        maxWidth: this._maxWidth,
        shadowColor: this._shadowColor,
        shadowBlur: this._shadowBlur,
        shadowOffset: {x: this._shadowOffset.x, y: this._shadowOffset.y},
        lineSpacing: this._lineSpacing,
        maxLines: this._maxLines,
        outlineColor: this._outlineColor,
        outlineWidth: this._outlineWidth,
        boundsScale: {x: this._boundsScale.x, y: this._boundsScale.y},
        sortPoint: {x: this._sortPoint.x, y: this._sortPoint.y},
        fixedSize: this._fixedSize,
        properties: {}
    }, d;
    for (d in this._animations)this._animations.hasOwnProperty(d) && !this._animations[d].isDefault && (c.animations[d] = this._animations[d].serialize());
    d = ["sceneObject", "boundingBox", "orientedBoundingBox", "id", "needsDrawing"];
    b && (d = d.concat(b));
    for (var e in this)if (this.hasOwnProperty(e) && "_" != e[0] && -1 == d.indexOf(e))try {
        var f = JSON.stringify(this[e]);
        c.properties[e] = JSON.parse(f)
    } catch (g) {
    }
    return a ? JSON.stringify(c) :
        c
};
TextSprite.prototype.scaleBounds = function (a, b) {
    this._boundsScale = {x: a, y: b};
    this._updateSize();
    this._image = 0
};
TextSprite.prototype.setFixedSize = function (a) {
    "undefined" == typeof a && (a = !0);
    this._fixedSize = a
};
TextSprite.prototype.getSize = function () {
    return {x: this._size.x, y: this._size.y}
};
TextSprite.prototype._updateSize = function () {
    var a = wade.getInternalContext();
    this._lines.length = 0;
    var b = $('<span style="white-space:nowrap">' + this._text.replace("<", "< ") + "</span>").css({font: this._font}), c = $('<div style="display: inline-block; width: 1px; height: 0px;"></div>'), d = $('<div style="white-space:nowrap"></div>');
    d.append(b, c);
    $("body").append(d);
    c.css({verticalAlign: "bottom"});
    var e = c.offset().top - b.offset().top;
    c.css({verticalAlign: "baseline"});
    e || (e = 3 * a.measureText("m").width + this._outlineWidth);
    this._centerOffset.y = e / 2 + (b.offset().top - c.offset().top);
    d.remove();
    this._lineHeight = e;
    this._refresh(0, this._lines, a);
    this._numLines = this._lines.length;
    for (b = a = 0; b < this._lines.length; b++)a = Math.max(a, this._lines[b].width);
    this._size.x = a;
    this._size.y = e + (this._numLines - 1) * this._lineSpacing * e;
    this._centerOffset.y += (this._size.y - e) / 2;
    switch (this._alignment) {
        case "left":
            this._centerOffset.x = a / 2;
            break;
        case "right":
            this._centerOffset.x = -a / 2;
            break;
        case "center":
            this._centerOffset.x = 0
    }
    this._shadowColor && (this._size.x +=
        Math.abs(this._shadowOffset.x) + Math.max(8, 2 * this._shadowBlur), this._size.y += Math.abs(this._shadowOffset.y) + Math.max(8, 2 * this._shadowBlur));
    this._outlineWidth && (this._size.x += this._outlineWidth, this._size.y += this._outlineWidth);
    this._size.x += 3;
    this._size.y += 3;
    this._size.x *= this._boundsScale.x;
    this._size.y *= this._boundsScale.y;
    this.updateBoundingBox()
};
TextSprite.prototype._calculateHeight = function () {
    return height
};
TextSprite.prototype.draw = function (a) {
    if (a.isWebGl)TextSprite.prototype.draw_gl.call(this, a); else if (this._visible && this._text)if (this._image) {
        this._cornerX = this._position.x - this._size.x / 2 + this._centerOffset.x;
        this._cornerY = this._position.y - this._size.y / 2 + this._centerOffset.y;
        var b = this._position.x, c = this._position.y;
        this._position.x = this.orientedBoundingBox.centerX;
        this._position.y = this.orientedBoundingBox.centerY;
        Sprite.prototype.drawStatic.call(this, a);
        this._position.x = b;
        this._position.y = c
    } else this._refresh(1,
        0, a)
};
TextSprite.prototype.draw_gl = function (a) {
    a.isWebGl ? this._visible && this._text && (this._image || this.cache(), this._activeImage = this._cachedImageName, this._cornerX = this.boundingBox.minX, this._cornerY = this.boundingBox.minY, Sprite.prototype.drawStatic_gl.call(this, a)) : TextSprite.prototype.draw.call(this, a)
};
TextSprite.prototype.step = function () {
};
TextSprite.prototype.playAnimation = function () {
};
TextSprite.prototype.setSceneObject = function (a) {
    this._sceneObject = a
};
TextSprite.prototype._refresh = function (a, b, c) {
    c = c || wade.getInternalContext();
    this._rotation && (c.save(), c.translate(this._position.x + this._centerOffset.x, this._position.y + this._centerOffset.y), c.rotate(this._rotation), c.translate(-this._position.x - this._centerOffset.x, -this._position.y - this._centerOffset.y));
    c.font = this._font;
    c.fillStyle = this._color;
    c.textAlign = this._alignment;
    this._shadowColor && (c.shadowColor = this._shadowColor, c.shadowBlur = this._shadowBlur, c.shadowOffsetX = this._shadowOffset.x, c.shadowOffsetY =
        this._shadowOffset.y);
    if (this._outlineWidth) {
        var d = c.strokeStyle, e = c.lineWidth;
        c.lineWidth = this._outlineWidth;
        c.strokeStyle = this._outlineColor
    }
    if (!this._maxWidth && 0 > this._text.indexOf("\n"))a && (c.fillText(this._text, this._position.x, this._position.y), this._outlineWidth && c.strokeText(this._text, this._position.x, this._position.y)), b && b.push({
        width: c.measureText(this._text).width + this._outlineWidth,
        text: this._text
    }); else {
        for (var f = 0, g = this._text.split("\n"), i = 0; i < g.length && (!this._maxLines || f < this._maxLines); i++) {
            for (var l =
                g[i].split(" "), j = 1, h; 0 < l.length && j <= l.length && (!this._maxLines || f < this._maxLines);)h = l.slice(0, j).join(" "), c.measureText(h).width + this._outlineWidth > this._maxWidth && 0 < this._maxWidth ? (1 == j && (j = 2), h = l.slice(0, j - 1).join(" "), a && (c.fillText(h, this._position.x, this._position.y + this._lineHeight * this._lineSpacing * f), this._outlineWidth && c.strokeText(this._text, this._position.x, this._position.y)), b && b.push({
                width: c.measureText(h).width + this._outlineWidth,
                text: h
            }), f++, l = l.splice(j - 1), j = 1) : j++;
            0 < j && (h = l.join(" "),
            a && (c.fillText(h, this._position.x, this._position.y + this._lineHeight * this._lineSpacing * f), this._outlineWidth && c.strokeText(this._text, this._position.x, this._position.y)), b && b.push({
                width: c.measureText(h).width + this._outlineWidth,
                text: h
            }), f++)
        }
        this._numLines = f
    }
    this._shadowColor && (c.shadowColor = "rgba(0, 0, 0, 0)");
    this._outlineWidth && (c.strokeStyle = d, c.lineWidth = e);
    this._rotation && c.restore()
};
function Wade() {
    var a = 0, b = 0, c = 0, d = 0, e = 0, f = 0, g = !1, i = !1, l = "", j = 1, h = [], m = [], n = 0, p = !1, t = 1, r = "none", z = new Image, y = [], u, s, A, D, C, q = 1, F = "wade_main_div";
    z.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVQIW2NkAAIAAAoAAggA9GkAAAAASUVORK5CYII=";
    this.app = 0;
    this.c_timeStep = 1 / 60;
    this.defaultLayer = 1;
    this._appData = 0;
    this.c_epsilon = 1E-4;
    this.init = function (k, e, f) {
        var f = f || {}, g = f.forceReload, v = f.updateCallback;
        F = f.container || "wade_main_div";
        var x = function () {
            var a = window.applicationCache;
            if (a)if (a.status == a.UPDATEREADY)wade.log("a new version of the app is available"), v ? v() : (alert("A new version is available.\nPlease press OK to restart."), a.swapCache(), window.location.reload(!0), window.location = window.location); else {
                try {
                    a.update()
                } catch (b) {
                }
                a.addEventListener("updateready", x, !1)
            }
        };
        x();
        k && (l = k.substr(0, Math.max(k.lastIndexOf("/"), k.lastIndexOf("\\")) + 1));
        for (var h = 0, i = ["ms", "moz", "webkit", "o"], j = 0; j < i.length && !window.requestAnimationFrame; j++)window.requestAnimationFrame = window[i[j] +
        "RequestAnimationFrame"], window.cancelAnimationFrame = window[i[j] + "CancelAnimationFrame"] || window[i[j] + "CancelRequestAnimationFrame"];
        window.requestAnimationFrame || (window.requestAnimationFrame = function (a) {
            var b = (new Date).getTime(), c = Math.max(0, 16 - (b - h)), k = window.setTimeout(function () {
                a(b + c)
            }, c);
            h = b + c;
            return k
        });
        window.cancelAnimationFrame || (window.cancelAnimationFrame = function (a) {
            clearTimeout(a)
        });
        i = "undefined" == typeof f.audio || f.audio;
        b = new AssetLoader;
        b.init(!1, i);
        c = new AssetLoader;
        c.init(!0, i);
        a = new SceneManager;
        a.init();
        d = new InputManager;
        ("undefined" == typeof f.input || f.input) && d.init();
        A = document.createElement("canvas");
        A.width = A.height = 256;
        D = A.getContext("2d");
        this.proceduralImages.init();
        C = !!f.debug;
        this._appData = e ? e : {};
        k ? b.loadAppScript(k, g) : App ? this.instanceApp() : wade.log("Warning - App is not defined.");
        this.event_mainLoop()
    };
    this.stop = function () {
        e && cancelAnimationFrame(e);
        f && clearTimeout(f);
        this.setLoadingImages([])
    };
    this.stopInputEvents = function () {
        d.deinit()
    };
    this.restartInputEvents =
        function () {
            d.init()
        };
    this.cancelInputEvents = function (a) {
        d.cancelEvents(a)
    };
    this.getBasePath = function () {
        return l
    };
    this.setBasePath = function (a) {
        l = a || ""
    };
    this.getFullPathAndFileName = function (a) {
        if (!a || "procedural_" == a.substr(0, 11))return a;
        var b = a[0];
        return "\\" == b || "/" == b || -1 != a.indexOf(":") ? a : l + a
    };
    this.loadScript = function (a, c, d, e, f) {
        a = this.getFullPathAndFileName(a);
        b.loadScript(a, c, d, e, f)
    };
    this.preloadScript = function (a, b, d, e, f) {
        a = this.getFullPathAndFileName(a);
        c.loadScript(a, b, d, e, f)
    };
    this.getScript =
        function (a) {
            a = this.getFullPathAndFileName(a);
            return b.getScript(a)
        };
    this.setScript = function (a, c) {
        var d = this.getFullPathAndFileName(a);
        b.setScript(d, c)
    };
    this.loadJson = function (a, c, d, e, f) {
        a = this.getFullPathAndFileName(a);
        b.loadJson(a, c, d, e, f)
    };
    this.preloadJson = function (a, b, d, e, f) {
        a = this.getFullPathAndFileName(a);
        c.loadJson(a, b, d, e, f)
    };
    this.getJson = function (a) {
        a = this.getFullPathAndFileName(a);
        return b.getJson(a)
    };
    this.setJson = function (a, c) {
        var d = this.getFullPathAndFileName(a);
        b.setJson(d, c)
    };
    this.loadImage =
        function (a, c, d) {
            a = this.getFullPathAndFileName(a);
            b.loadImage(a, c, d)
        };
    this.loadImages = function (a) {
        for (var b = 0; b < a.length; b++)this.loadImage(a[b])
    };
    this.preloadImage = function (a, b, d) {
        a = this.getFullPathAndFileName(a);
        c.loadImage(a, b, d)
    };
    this.unloadImage = function (a) {
        a = this.getFullPathAndFileName(a);
        b.unloadImage(a);
        c.unloadImage(a)
    };
    this.unloadAllImages = function () {
        b.unloadAllImages();
        c.unloadAllImages()
    };
    this.getImage = function (a, c) {
        if (a) {
            var d = this.getFullPathAndFileName(a);
            return b.getImage(d, c)
        }
        return z
    };
    this.setImage = function (c, d) {
        var e = this.getFullPathAndFileName(c);
        b.setImage(e, d);
        a.renderer.updateImageUsers(e)
    };
    this.loadAudio = function (a, c, d, e, f) {
        a = this.getFullPathAndFileName(a);
        b.loadAudio(a, c, d, e, f)
    };
    this.preloadAudio = function (a, b, d, e, f) {
        a = this.getFullPathAndFileName(a);
        c.loadAudio(a, b, d, e, f)
    };
    this.unloadAudio = function (a) {
        a = this.getFullPathAndFileName(a);
        b.unloadAudio(a);
        c.unloadAudio(a)
    };
    this.unloadAllAudio = function () {
        b.unloadAllAudio();
        c.unloadAllAudio()
    };
    this.setAudio = function (a, c) {
        var d =
            this.getFullPathAndFileName(a);
        b.setAudio(d, c)
    };
    this.playAudio = function (a, c, d) {
        var e = this.getAudio(a), f = b.getWebAudioContext();
        if (f) {
            var g = f.createBufferSource();
            g.buffer = e;
            g.loop = !!c;
            g.connect(f.destination);
            g.endEventFired = !1;
            g.onended = function () {
                g.endEventFired = !0;
                d && d()
            };
            g.start(0);
            y.push(g);
            if (d && !c) {
                var h = function () {
                    g.playbackState != g.FINISHED_STATE ? setTimeout(h, wade.c_timeStep) : g.onended && !g.endEventFired && (g.endEventFired = !0, g.onended())
                };
                g.checkEnded = setTimeout(h, 1E3 * g.buffer.duration + wade.c_timeStep)
            }
        } else e.alreadyPlayed && !e.ended && (e = new Audio(e.src), this.setAudio(a, e)), e.loop = c, e.alreadyPlayed = !0, c && e.addEventListener("ended", function () {
            this.currentTime = 0;
            this.play()
        }, !1), e.play(), y.push(e);
        return y.length
    };
    this.stopAudio = function (a) {
        if (a = y[a - 1])a.stop(), a.checkEnded && clearTimeout(a.checkEnded)
    };
    this.playAudioIfAvailable = function (a, b, c) {
        return "ok" == this.getLoadingStatus(this.getFullPathAndFileName(a)) ? this.playAudio(a, b, c) : 0
    };
    this.playAudioSegment = function (a, c, d, e) {
        var c = c || 0, a = this.getAudio(this.getFullPathAndFileName(a)),
            f = b.getWebAudioContext();
        if (f) {
            var g = f.createBufferSource();
            g.buffer = a;
            g.connect(f.destination);
            g.endEventFired = !1;
            g.onended = function () {
                g.endEventFired = !0;
                e && e()
            };
            g.start(c);
            if (e) {
                var h = function () {
                    g.playbackState != g.FINISHED_STATE ? setTimeout(h, wade.c_timeStep) : g.onended && !g.endEventFired && (g.endEventFired = !0, g.onended())
                };
                g.checkEnded = setTimeout(h, 1E3 * (g.buffer.duration - c) + wade.c_timeStep)
            }
            d && g.stop(d);
            y.push(g)
        } else d = d || a.duration, a.alreadyPlayed && !a.ended && (a = new Audio(a.src)), a.addEventListener("timeupdate",
            function () {
                this.currentTime >= d && (this.pause(), this.ended = !0, e && e())
            }, !1), a.alreadyPlayed = !0, a.play(), y.push(a);
        return y.length - 1
    };
    this.playAudioSegmentIfAvailable = function (a, b, c, d) {
        "ok" == this.getLoadingStatus(this.getFullPathAndFileName(a)) && this.playAudioSegment(a, b, c, d)
    };
    this.loadFont = function (a, c, d) {
        a = this.getFullPathAndFileName(a);
        b.loadFont(a, c, d)
    };
    this.preloadFont = function (a, b, d) {
        a = this.getFullPathAndFileName(a);
        c.loadFont(a, b, d)
    };
    this.getFont = function (a) {
        a = this.getFullPathAndFileName(a);
        return b.getFont(a)
    };
    this.setFont = function (a, c) {
        var d = this.getFullPathAndFileName(a);
        b.setFont(d, c)
    };
    this.getLoadingStatus = function (a) {
        a = this.getFullPathAndFileName(a);
        return b.getLoadingStatus(a)
    };
    this.instanceApp = function () {
        this.app = new App;
        this.app.appData = this._appData;
        this.app.load && this.app.load();
        g = !1;
        i = !0
    };
    this.initializeApp = function () {
        g = !0;
        var a = 0 <= navigator.userAgent.indexOf("Android") && -1 == navigator.userAgent.indexOf("Firefox") && !(window.chrome && window.chrome.app) && !this.isWebGlSupported();
        this.enableDoubleBuffering(a);
        this.app.init ? (this.app.init(), f = setTimeout(function () {
            wade.event_appTimerEvent()
        }, 1E3 * j)) : wade.log("Warning: Unable to initialize app. App.init function is missing.")
    };
    this.processEvent = function (b, c) {
        return a.processEvent(b, c)
    };
    this.addEventListener = function (b, c) {
        a.addEventListener(b, c)
    };
    this.removeEventListener = function (b, c) {
        a.removeEventListener(b, c)
    };
    this.isEventListener = function (b, c) {
        return a.isObjectListeneningForEvent(b, c)
    };
    this.addGlobalEventListener = function (b, c) {
        a.addGlobalEventListener(b,
            c)
    };
    this.removeGlobalEventListener = function (b, c) {
        a.removeGlobalEventListener(b, c)
    };
    this.getCameraPosition = function () {
        return a.renderer.getCameraPosition()
    };
    this.setCameraPosition = function (b) {
        a.renderer.setCameraPosition(b)
    };
    this.getAppTime = function () {
        return a.getAppTime()
    };
    this.setAppTimerInterval = function (a) {
        j = a
    };
    this.removeObjectFromArrayByIndex = function (a, b) {
        if (0 <= a) {
            var c = b.slice(a + 1 || b.length);
            b.length = a;
            return b.push.apply(b, c)
        }
        return b
    };
    this.removeObjectFromArray = function (a, b) {
        var c = b.lastIndexOf(a);
        return -1 != c ? this.removeObjectFromArrayByIndex(c, b) : b
    };
    this.addSceneObject = function (b, c, d) {
        a.addSceneObject(b, c, d);
        return b
    };
    this.removeSceneObject = function (b) {
        a.removeSceneObject("string" == typeof b ? this.getSceneObject(b) : b)
    };
    this.removeSceneObjects = function (b) {
        for (var c = 0; c < b.length; c++)a.removeSceneObject(b[c])
    };
    this.clearScene = function () {
        a.clear()
    };
    this.getLayerSorting = function (b) {
        return a.renderer.getLayerSorting(b)
    };
    this.setLayerSorting = function (b, c) {
        a.renderer.setLayerSorting(b, c)
    };
    this.setLayerTransform =
        function (b, c, d) {
            a.renderer.setLayerTransform(b, c, d)
        };
    this.setLayerResolutionFactor = function (b, c) {
        a.renderer.setLayerResolutionFactor(b, c)
    };
    this.getLayerResolutionFactor = function (b) {
        return a.renderer.getLayerResolutionFactor(b)
    };
    this.setResolutionFactor = function (b) {
        t = b;
        a.renderer.setResolutionFactor(t)
    };
    this.getResolutionFactor = function () {
        return t
    };
    this.getScreenWidth = function () {
        return a.renderer.getScreenWidth()
    };
    this.getScreenHeight = function () {
        return a.renderer.getScreenHeight()
    };
    this.setScreenSize =
        function (b, c) {
            a.renderer.setScreenSize(b, c)
        };
    this.getContainerWidth = function () {
        return this.isScreenRotated() ? window.innerHeight : window.innerWidth
    };
    this.getContainerHeight = function () {
        return this.isScreenRotated() ? window.innerWidth : window.innerHeight
    };
    this.setCanvasClearing = function (b, c) {
        a.renderer.setCanvasClearing(b, c)
    };
    this.setWindowMode = function (b) {
        a.renderer.setWindowMode(b)
    };
    this.getWindowMode = function () {
        return a.renderer.getWindowMode()
    };
    this.loadPage = function (a) {
        self.location = a
    };
    this.cloneObject =
        function (a) {
            return jQuery.extend(!0, {}, a)
        };
    this.cloneArray = function (a) {
        return jQuery.extend(!0, [], a)
    };
    this.simulateSceneObject = function (b, c) {
        c ? b.simulated || (a.addEventListener(b, "onSimulationStep"), b.simulated = !0) : b.simulated && (a.removeEventListener(b, "onSimulationStep"), b.simulated = !1)
    };
    this.setMaxScreenSize = function (b, c) {
        a.renderer.setMaxScreenSize(b, c)
    };
    this.getMaxScreenWidth = function () {
        return a.renderer.getMaxScreenWidth()
    };
    this.getMaxScreenHeight = function () {
        return a.renderer.getMaxScreenHeight()
    };
    this.setMinScreenSize = function (b, c) {
        return a.renderer.setMinScreenSize(b, c)
    };
    this.getMinScreenWidth = function () {
        return a.renderer.getMinScreenWidth()
    };
    this.getMinScreenHeight = function () {
        return a.renderer.getMinScreenHeight()
    };
    this.createCanvas = function (a) {
        var a = a || 1, b = document.getElementById(F), c = $("#" + F), d = parseInt(c.attr("width")), c = parseInt(c.attr("height")), e = document.createElement("canvas");
        e.width = Math.round(d * a);
        e.height = Math.round(c * a);
        e.style.position = b.style.position;
        e.style.margin = "auto";
        e.style.top = 0;
        e.style.left = 0;
        e.style.right = 0;
        e.style.bottom = 0;
        e.style.backfaceVisibility = e.style.WebkitBackfaceVisibility = e.style.MozBackfaceVisibility = e.style.OBackfaceVisibility = "hidden";
        var a = e.style.width.toString().toLowerCase(), f = e.style.height.toString().toLowerCase();
        a == f && "auto" == a ? (e.style.width = d + "px", e.style.height = c + "px") : (e.style.width = b.style.width, e.style.height = b.style.height);
        e.style.MozTransform = e.style.msTransform = e.style.OTransform = e.style.WebkitTransform = e.style.transform = "translate3d(0,0,0)";
        b.appendChild(e);
        return e
    };
    this.deleteCanvases = function () {
        a.renderer.removeCanvases()
    };
    this.recreateCanvases = function () {
        a.renderer.recreateCanvases()
    };
    this.isAppInitialized = function () {
        return g
    };
    this.boxContainsBox = function (a, b) {
        return a.minX < b.minX && a.maxX > b.maxX && a.minY < b.minY && a.maxY > b.maxY
    };
    this.boxIntersectsBox = function (a, b) {
        return !(a.maxX < b.minX || a.minX > b.maxX || a.maxY < b.minY || a.minY > b.maxY)
    };
    this.boxContainsPoint = function (a, b) {
        return b.x >= a.minX && b.x <= a.maxX && b.y >= a.minY && b.y <= a.maxY
    };
    this.orientedBoxContainsPoint =
        function (a, b) {
            var c = Math.sin(a.rotation), d = Math.cos(a.rotation), e = b.x - a.centerX, f = b.y - a.centerY, g = d * e + c * f, c = d * f - c * e;
            return g >= -a.halfWidth && g <= a.halfWidth && c >= -a.halfHeight && c <= a.halfHeight
        };
    this.orientedBoxIntersectsOrientedBox = function (a, b) {
        var c = b.centerX - a.centerX, d = b.centerY - a.centerY, e = a.axisXx, f = a.axisXy, g = a.axisYx, h = a.axisYy, i = b.axisXx, j = b.axisXy, l = b.axisYx, m = b.axisYy;
        return !(Math.abs(c * e + d * f) > e * e + f * f + Math.abs(i * e + j * f) + Math.abs(l * e + m * f) || Math.abs(c * g + d * h) > g * g + h * h + Math.abs(i * g + j * h) + Math.abs(l *
        g + m * h) || Math.abs(c * i + d * j) > i * i + j * j + Math.abs(i * e + j * f) + Math.abs(i * g + j * h) || Math.abs(c * l + d * m) > l * l + m * m + Math.abs(l * e + m * f) + Math.abs(l * g + m * h))
    };
    this.boxIntersectsOrientedBox = function (a, b) {
        var c = (a.minX + a.maxX) / 2 - b.centerX, d = (a.minY + a.maxY) / 2 - b.centerY, e = (a.maxX - a.minX) / 2, f = (a.maxY - a.minY) / 2, g = b.axisXx, h = b.axisXy, i = b.axisYx, j = b.axisYy;
        return !(Math.abs(c * e) > e * e + Math.abs(g * e) + Math.abs(i * e) || Math.abs(d * f) > f * f + Math.abs(h * f) + Math.abs(j * f) || Math.abs(c * g + d * h) > g * g + h * h + Math.abs(g * e) + Math.abs(h * f) || Math.abs(c * i + d * j) >
        i * i + j * j + Math.abs(i * e) + Math.abs(j * f))
    };
    this.orientedBoxIntersectsBox = function (a, b) {
        return this.boxIntersectsOrientedBox(b, a)
    };
    this.expandBox = function (a, b) {
        a.minX = Math.min(a.minX, b.minX);
        a.minY = Math.min(a.minY, b.minY);
        a.maxX = Math.max(a.maxX, b.maxX);
        a.maxY = Math.max(a.maxY, b.maxY)
    };
    this.clampBoxToBox = function (a, b) {
        a.minX = Math.max(a.minX, b.minX);
        a.minY = Math.max(a.minY, b.minY);
        a.maxX = Math.min(a.maxX, b.maxX);
        a.maxY = Math.min(a.maxY, b.maxY)
    };
    this.postObject = function (a, b, c, d) {
        b = {data: JSON.stringify(b)};
        d &&
        jQuery.extend(b, d);
        $.ajax({type: "POST", url: a, data: b, complete: c, dataType: "json"})
    };
    this.setGlobalLoadingCallback = function (a) {
        b.setGlobalCallback(a)
    };
    this.setMainLoopCallback = function (a, b, c) {
        for (var b = b || "_wade_default", d = 0; d < m.length && m[d].name != b; d++);
        m[d] = {func: a, name: b, priority: c || 0};
        m.sort(function (a, b) {
            return b.priority - a.priority
        })
    };
    this.setLoadingImages = function (a, b) {
        for (var c = 0; c < h.length; c++)document.body.removeChild(h[c]);
        h.length = 0;
        jQuery.isArray(a) || (a = [a]);
        for (c = 0; c < a.length; c++) {
            var d =
                document.createElement("img");
            d.className = "loadingImage_class";
            d.style.display = "none";
            var e = document.getElementById("container");
            document.body.insertBefore(d, e);
            d.src = this.getFullPathAndFileName(a[c]);
            h.push(d);
            b && d.addEventListener("click", function () {
                window.open(b, "_blank")
            })
        }
    };
    this.worldPositionToScreen = function (b, c) {
        return a.renderer.worldPositionToScreen(b, c)
    };
    this.worldDirectionToScreen = function (b, c) {
        return a.renderer.worldDirectionToScreen(b, c)
    };
    this.worldBoxToScreen = function (b, c) {
        return a.renderer.worldBoxToScreen(b,
            c)
    };
    this.worldUnitToScreen = function (b) {
        return a.renderer.worldUnitToScreen(b)
    };
    this.screenPositionToWorld = function (b, c) {
        return a.renderer.screenPositionToWorld(b, c)
    };
    this.screenDirectionToWorld = function (b, c) {
        return a.renderer.screenDirectionToWorld(b, c)
    };
    this.screenBoxToWorld = function (b, c) {
        return a.renderer.screenBoxToWorld(b, c)
    };
    this.screenUnitToWorld = function (b) {
        return a.renderer.screenUnitToWorld(b)
    };
    this.worldPositionToCanvas = function (b, c) {
        return a.renderer.worldPositionToCanvas(b, c)
    };
    this.worldDirectionToCanvas =
        function (b, c) {
            return a.renderer.worldDirectionToCanvas(b, c)
        };
    this.worldBoxToCanvas = function (b, c) {
        return a.renderer.worldBoxToCanvas(b, c)
    };
    this.worldUnitToCanvas = function (b) {
        return a.renderer.worldUnitToCanvas(b)
    };
    this.canvasPositionToWorld = function (b, c) {
        return a.renderer.canvasPositionToWorld(b, c)
    };
    this.canvasDirectionToWorld = function (b, c) {
        return a.renderer.canvasDirectionToWorld(b, c)
    };
    this.canvasBoxToWorld = function (b, c) {
        return a.renderer.canvasBoxToWorld(b, c)
    };
    this.canvasUnitToWorld = function (b) {
        return a.renderer.canvasUnitToWorld(b)
    };
    this.setMinimumInputEventInterval = function (a, b) {
        d.setMinimumIntervalBetweenEvents(a, b)
    };
    this.isMouseDown = function () {
        return d.isMouseDown()
    };
    this.isKeyDown = function (a) {
        return d.isKeyDown(a)
    };
    this.unpackSpriteSheet = function (a, b, c, d, e) {
        for (var c = c || 1, d = d || 1, f = this.getImage(a), g = f.width / c, f = f.height / d, h = 0; h < b.length && h < c * d; h++) {
            var i = document.createElement("canvas");
            i.width = g;
            i.height = f;
            (new Animation(a, c, d, 1, !1, h, h)).draw(i.getContext("2d"), {x: g / 2, y: f / 2}, {x: g, y: f});
            wade.setImage(b[h] || a + "_" + h, i)
        }
        e &&
        this.unloadImage(a)
    };
    this.storeLocalObject = function (a, b) {
        localStorage.setItem(a, JSON.stringify(b))
    };
    this.retrieveLocalObject = function (a) {
        return (a = localStorage.getItem(a)) && JSON.parse(a)
    };
    this.enableDoubleBuffering = function (b) {
        "undefined" == typeof b && (b = !0);
        p != b && (a.renderer.enableDoubleBuffering(b), p = b)
    };
    this.isDoubleBufferingEnabled = function () {
        return p
    };
    this.setFullScreen = function (a) {
        var b = document.documentElement;
        a || "undefined" == typeof a ? a = b.requestFullScreen || b.requestFullscreen || b.mozRequestFullScreen ||
        b.mozRequestFullscreen || b.webkitRequestFullScreen || b.webkitRequestFullscreen || b.msRequestFullScreen || b.msRequestFullscreen : (b = document, a = b.exitFullscreen || b.msExitFullscreen || b.mozCancelFullScreen || b.webkitCancelFullScreen);
        a && a.call(b)
    };
    this.setLayerSmoothing = function (b, c) {
        "undefined" == typeof c && (c = !0);
        a.renderer.setLayerSmoothing(b, c)
    };
    this.getLayerSmoothing = function (b) {
        return a.renderer.getLayerSmoothing(b)
    };
    this.setSmoothing = function (b) {
        "undefined" == typeof b && (b = !0);
        a.renderer.setSmoothing(b)
    };
    this.getSmoothing = function () {
        return a.renderer.getSmoothing()
    };
    this.setClickTolerance = function (a) {
        d.setClickTolerance(a)
    };
    this.getMousePosition = function () {
        return d.getMousePosition()
    };
    this.isWebAudioSupported = function () {
        return !!b.getWebAudioContext()
    };
    this.forceOrientation = function (b) {
        if (r != b) {
            switch (b) {
                case "landscape":
                    r = "landscape";
                    break;
                case "portrait":
                    r = "portrait";
                    break;
                default:
                    r = "none"
            }
            a.setSimulationDirtyState();
            a.draw()
        }
    };
    this.getForcedOrientation = function () {
        return r
    };
    this.isScreenRotated =
        function () {
            return a.renderer.isScreenRotated()
        };
    this.moveCamera = function (a, b, c) {
        "object" != typeof a || "number" != typeof a.x || "number" != typeof a.y || "number" != typeof a.z ? wade.log("Warning - invalid destination for wade.moveCamera(). It needs to be an object with x, y, and z fields.") : "number" != typeof b && "function" != typeof b ? wade.log("Warning - invalid speed for wade.moveCamera(). It needs to be a number, or a function that returns a number.") : this.setMainLoopCallback(function () {
            var d = wade.getCameraPosition(),
                e = a.x - d.x, f = a.y - d.y, g = a.z - d.z, h = Math.sqrt(e * e + f * f + g * g), i = "number" == typeof b ? b : b(h) || 0;
            h <= i * wade.c_timeStep ? (wade.setCameraPosition(a), wade.setMainLoopCallback(0, "_wade_camera"), c && c(), wade.app.onCameraMoveComplete && wade.app.onCameraMoveComplete()) : wade.setCameraPosition({
                x: d.x + e * i * wade.c_timeStep / h,
                y: d.y + f * i * wade.c_timeStep / h,
                z: d.z + g * i * wade.c_timeStep / h
            })
        }, "_wade_camera")
    };
    this.setCameraTarget = function (a, b, c) {
        a ? (b = b || 0, c = c || {x: 0, y: 0}, this.setMainLoopCallback(function () {
            if (a.isInScene()) {
                var d = a.getPosition(),
                    e = wade.getCameraPosition();
                d.x += c.x;
                d.y += c.y;
                d.z = e.z;
                if (b) {
                    var e = {
                        x: d.x * (1 - b) + e.x * b,
                        y: d.y * (1 - b) + e.y * b,
                        z: d.z * (1 - b) + e.z * b
                    }, f = e.x - d.x, g = e.y - d.y, h = e.z - d.z;
                    f * f + g * g + h * h > b * b && (d = e)
                }
                wade.setCameraPosition(d)
            }
        }, "_wade_cameraTarget")) : this.setMainLoopCallback(0, "_wade_cameraTarget")
    };
    this.getObjectsInArea = function (b, c) {
        var d = [];
        a.renderer.addObjectsInAreaToArray(b, d, c);
        return d
    };
    this.getObjectsInScreenArea = function (b) {
        var c = [];
        a.renderer.addObjectsInScreenAreaToArray(b, c);
        return c
    };
    this.getSpritesInArea = function (b,
                                      c) {
        var d = [];
        a.renderer.addSpritesInAreaToArray(b, d, c);
        return d
    };
    this.getSpritesInScreenArea = function (b) {
        var c = [];
        a.renderer.addSpritesInScreenAreaToArray(b, c);
        return c
    };
    this.getSceneObject = function (b) {
        return a.getObjectByName(b)
    };
    this.getSceneObjects = function (b, c) {
        return a.getSceneObjects(b, c)
    };
    this.getImageData = function (a, c, d, e, f) {
        var g = this.getFullPathAndFileName(a), g = b.getImage(g), h;
        if (g.getContext)h = g.getContext("2d"); else {
            var i = g, g = document.createElement("canvas");
            g.width = i.width;
            g.height = i.height;
            h = g.getContext("2d");
            h.drawImage(i, 0, 0);
            wade.setImage(a, g)
        }
        return h.getImageData(c || 0, d || 0, e || g.width, f || g.height)
    };
    this.putImageData = function (c, d, e, f, g, h, i, j) {
        var e = e || 0, f = f || 0, g = g || 0, h = h || 0, i = i || d.width, j = j || d.height, l = this.getFullPathAndFileName(c), m, n;
        if ("ok" == b.getLoadingStatus(l))if (m = b.getImage(l), m.getContext)n = m.getContext("2d"); else {
            var p = m;
            m = document.createElement("canvas");
            m.width = p.width;
            m.height = p.height;
            n = m.getContext("2d");
            n.drawImage(p, 0, 0);
            wade.setImage(c, m)
        } else m = document.createElement("canvas"),
            m.width = i, m.height = j, n = m.getContext("2d"), wade.setImage(c, m);
        n.putImageData(d, g, h, e, f, i, j);
        a.renderer.updateImageUsers(l)
    };
    this.enableMultitouch = function (a) {
        "undefined" == typeof a && (a = !0);
        d.enableMultitouch(a)
    };
    this.isMultitouchEnabled = function () {
        return d.isMultitouchEnabled()
    };
    this.getVersion = function () {
        return "1.6"
    };
    this.requireVersion = function (a, b, c) {
        for (var d = ["1", "6"], e = a.split("."), f = 0; f < e.length; f++) {
            var g = d[f] || 0;
            if (g > e[f])break; else if (g < e[f]) {
                c = c || "A newer version of WADE is required (" + a +
                ")";
                switch (b) {
                    case "alert":
                        alert(c);
                        break;
                    case "console":
                        wade.log(c)
                }
                return !1
            }
        }
        return !0
    };
    this.getLoadingPercentage = function () {
        return b.getPercentageComplete()
    };
    this.setLoadingBar = function (a, b, c, d) {
        if (a) {
            var a = document.createElement("div"), e = document.createElement("div");
            a.style.backgroundColor = c || "black";
            a.style.borderRadius = "13px";
            a.style.padding = "3px";
            a.style.width = "50%";
            a.style.height = "20px";
            a.style.position = "absolute";
            a.style.left = b ? 2 * b.x + "px" : 0;
            a.style.right = 0;
            a.style.top = b ? 2 * b.y + "px" : 0;
            a.style.bottom =
                0;
            a.style.margin = "auto";
            e.style.backgroundColor = d || "lightgreen";
            e.style.borderRadius = "10px";
            e.style.height = "20px";
            e.style.width = 0;
            a.appendChild(e);
            a.id = "__wade_loading_bar";
            u = a;
            u.inner = e;
            document.body.appendChild(a)
        } else u && document.body.removeChild(u), u = null
    };
    this.areGamepadsSupported = function () {
        return !(!navigator.webkitGetGamepads && !navigator.getGamepads)
    };
    this.enableGamepads = function () {
        d.enableGamepads()
    };
    this.getImageDataURL = function (a) {
        var b = wade.getImage(a);
        if (b.toDataURL)return b.toDataURL();
        (new Sprite(a)).drawToImage(a, !0);
        return wade.getImage(a).toDataURL()
    };
    this.getLayerDataURL = function (a) {
        return this.getLayer(a).toDataURL()
    };
    this.log = function (a) {
        console.log(a)
    };
    this.forceRedraw = function (b) {
        a.setSimulationDirtyState();
        a.renderer.forceRedraw(b)
    };
    this.forEachPixel = function (a, b, c) {
        for (var d = this.getImageData(a), e = 0; e < d.width; e++)for (var f = 0; f < d.height; f++) {
            var g = 4 * (e + f * d.width), h = b(d.data[g], d.data[g + 1], d.data[g + 2], d.data[g + 3], e, f);
            h && (d.data[g] = h.r || 0, d.data[g + 1] = h.g || 0, d.data[g + 2] =
                h.b || 0, d.data[g + 3] = h.a || 0)
        }
        wade.putImageData(c || a, d)
    };
    this.getLayerCanvas = function (a) {
        return wade.getLayer(a || 1).getCanvas()
    };
    this.drawLayerToImage = function (a, b, c, d, e, f) {
        var g = wade.getLayerCanvas(a), h = "__wade_layer" + a;
        wade.setImage(h, g);
        g = new Sprite(h);
        h = wade.getLayerOpacity(a);
        1 != h && g.setDrawFunction(wade.drawFunctions.alpha_(h, g.draw));
        e || (a = this.getLayerResolutionFactor(a), e = {
            horizontalScale: 1 / a,
            verticalScale: 1 / a,
            horizontalSkew: 0,
            verticalSkew: 0,
            horizontalTranslate: 0,
            verticalTranslate: 0
        });
        g.drawToImage(b,
            c, d, e, f)
    };
    this.screenCapture = function (b) {
        var c = a.renderer.getActiveLayerIds();
        if (c.length) {
            var d = new Sprite(null, c[0]);
            d.setSize(wade.getScreenWidth(), wade.getScreenHeight());
            d.setDrawFunction(wade.drawFunctions.transparent_());
            d.drawToImage(b, !0);
            for (d = 0; d < c.length; d++)wade.drawLayerToImage(c[d], b)
        }
    };
    this.setLayerOpacity = function (a, b) {
        this.getLayer(a).setOpacity(b)
    };
    this.getLayerOpacity = function (a) {
        a = parseFloat(this.getLayer(a).getOpacity());
        return isNaN(a) ? 1 : a
    };
    this.getContainerName = function () {
        return F
    };
    this.fadeInLayer = function (a, b, c) {
        var d = "__wade_fadeLayer_" + a;
        wade.setLayerOpacity(a, 0);
        this.setMainLoopCallback(function () {
            var e = wade.getLayerOpacity(a), e = Math.min(1, e + wade.c_timeStep / b);
            1 - e < wade.c_epsilon && (e = 1);
            wade.setLayerOpacity(a, e);
            1 == e && (wade.setMainLoopCallback(null, d), c && c())
        }, d)
    };
    this.fadeOutLayer = function (a, b, c) {
        var d = "__wade_fadeLayer_" + a;
        wade.setLayerOpacity(a, 1);
        this.setMainLoopCallback(function () {
            var e = wade.getLayerOpacity(a), e = Math.max(0, e - wade.c_timeStep / b);
            e < wade.c_epsilon && (e =
                0);
            wade.setLayerOpacity(a, e);
            0 == e && (wade.setMainLoopCallback(null, d), c && c())
        }, d)
    };
    this.clearCanvas = function (a) {
        this.getLayer(a).clear()
    };
    this.draw = function (b) {
        a.draw(b)
    };
    this.exportScene = function (b, c, d) {
        c = {sceneObjects: a.exportSceneObjects(c, d)};
        c.layers = a.renderer.getLayerSettings();
        c.minScreenSize = {x: wade.getMinScreenWidth(), y: wade.getMinScreenHeight()};
        c.maxScreenSize = {x: wade.getMaxScreenWidth(), y: wade.getMaxScreenHeight()};
        c.orientation = wade.getForcedOrientation();
        c.windowMode = wade.getWindowMode();
        c.defaultLayer = wade.defaultLayer || 1;
        return b ? JSON.stringify(c) : c
    };
    this.importScene = function (a, b, c, d, e) {
        b && wade.setLoadingBar(!0, b.position, b.backColor, b.foreColor);
        var f = a.sceneObjects;
        if (f) {
            for (var b = a.images || [], g = 0; g < f.length; g++)if (f[g].sprites)for (var h = 0; h < f[g].sprites.length; h++)if (f[g].sprites[h].image && -1 == b.indexOf(f[g].sprites[h].image) && b.push(f[g].sprites[h].image), f[g].sprites[h].animations)for (var i in f[g].sprites[h].animations)if (f[g].sprites[h].animations.hasOwnProperty(i)) {
                var j =
                    f[g].sprites[h].animations[i].image;
                j && "procedural_" != j.substr(0, 11) && -1 == b.indexOf(j) && b.push(j)
            }
            var m = 0, l = b.length;
            i = function () {
                if (++m == l) {
                    e && wade.clearScene();
                    if (a.scripts)for (var b = 0; b < a.scripts.length; b++)eval.call(window, wade.getScript(a.scripts[b]));
                    a.minScreenSize && wade.setMinScreenSize(a.minScreenSize.x, a.minScreenSize.y);
                    a.maxScreenSize && wade.setMaxScreenSize(a.maxScreenSize.x, a.maxScreenSize.y);
                    a.windowMode && wade.setWindowMode(a.windowMode);
                    a.orientation && wade.forceOrientation(a.orientation);
                    if (a.layers)for (b = 0; b < a.layers.length; b++)if (a.layers[b]) {
                        var d = "undefined" != typeof a.layers[b].useQuadtree ? a.layers[b].useQuadtree : !0;
                        wade.setLayerTransform(b, "number" != typeof a.layers[b].scaleFactor ? 1 : a.layers[b].scaleFactor, "number" != typeof a.layers[b].translateFactor ? 1 : a.layers[b].translateFactor);
                        wade.setLayerRenderMode(b, "webgl" == a.layers[b].renderMode ? "webgl" : "2d");
                        wade.useQuadtree(b, d)
                    }
                    a.defaultLayer && (wade.defaultLayer = a.defaultLayer);
                    for (b = 0; b < f.length; b++)new SceneObject(f[b]);
                    c && c()
                }
            };
            d = d ? "pre" : "";
            if (a.json) {
                l += a.json.length;
                for (g = 0; g < a.json.length; g++)wade[d + "loadJson"](a.json[g], i)
            }
            if (a.audio) {
                l += a.audio.length;
                for (g = 0; g < a.audio.length; g++)wade[d + "loadAudio"](a.audio[g], !1, !1, i)
            }
            if (a.fonts) {
                l += a.fonts.length;
                for (g = 0; g < a.fonts.length; g++)wade[d + "loadFont"](a.fonts[g], i)
            }
            if (a.scripts) {
                l += a.scripts.length;
                for (g = 0; g < a.scripts.length; g++)wade[d + "loadScript"](a.scripts[g], i, !1, null, !0)
            }
            if (b.length)for (g = 0; g < b.length; g++)wade[d + "loadImage"](b[g], i);
            l || (l = 1, i())
        } else c && setTimeout(c,
            0)
    };
    this.loadScene = function (a, b, c, d) {
        wade.loadJson(a, null, function (a) {
            wade.importScene(a, b, c, !1, d)
        })
    };
    this.preloadScene = function (a, b, c, d) {
        wade.preloadJson(a, null, function (a) {
            wade.importScene(a, b, c, !0, d)
        })
    };
    this.useQuadtree = function (a, b) {
        "undefined" == typeof b && (b = !0);
        this.getLayer(a).useQuadtree(b)
    };
    this.isUsingQuadtree = function (a) {
        return this.getLayer(a).isUsingQuadtree()
    };
    this.pauseSimulation = function (a) {
        if (a)for (var b = 0; b < m.length; b++) {
            if (m[b].name == a) {
                m[b].paused = !0;
                break
            }
        } else s = !0
    };
    this.resumeSimulation =
        function (a) {
            var b;
            if (a)for (b = 0; b < m.length; b++) {
                if (m[b].name == a) {
                    m[b].paused = !1;
                    break
                }
            } else {
                for (b = 0; b < m.length; b++)m[b].paused = !1;
                s = !1
            }
        };
    this.setCatchUpBuffer = function (a) {
        q = a
    };
    this.getCatchUpBuffer = function () {
        return q
    };
    this.preventIframe = function () {
        if (!window.location || !window.top.location || !location || !top.location || window.location !== window.top.location || location !== top.location)wade = 0
    };
    this.siteLock = function (a) {
        var b = "localhost";
        try {
            b = top.location.hostname
        } catch (c) {
            try {
                b = this.getHostName(top.location.origin)
            } catch (d) {
                try {
                    b =
                        this.getHostName(top.location.href)
                } catch (e) {
                }
            }
        }
        b = b.toLowerCase();
        b != a.toLowerCase() && ("localhost" != b && "127.0.0.1" != b) && (wade = 0)
    };
    this.getHostName = function (a) {
        var b = URL || webkitURL;
        try {
            a = (new b(a)).hostname
        } catch (c) {
            b = a.indexOf("//"), -1 != b && (a = a.substr(b + 2)), b = a.indexOf("/"), -1 != b && (a = a.substr(0, b)), b = a.indexOf(":"), -1 != b && (a = a.substr(0, b)), b = a.indexOf("?"), -1 != b && (a = a.substr(0, b))
        }
        return a
    };
    this.whitelistReferrers = function (a) {
        var b = document.referrer;
        if (b) {
            var b = this.getHostName(b), c;
            if ("string" == typeof a)c = [a.toLowerCase()]; else if ($.isArray(a)) {
                c = [];
                for (var d = 0; d < a.length; d++)c.push(a[d].toLowerCase())
            } else return;
            b && -1 == c.indexOf(b.toLowerCase()) && (wade = 0)
        }
    };
    this.blacklistReferrers = function (a) {
        var b = document.referrer;
        if (b && (b = this.getHostName(b))) {
            var c;
            if ("string" == typeof a)c = [a.toLowerCase()]; else if ($.isArray(a)) {
                c = [];
                for (var d = 0; d < a.length; d++)c.push(a[d].toLowerCase())
            } else return;
            b && -1 != c.indexOf(b.toLowerCase()) && (wade = 0)
        }
    };
    this.removeLayer = function (b) {
        a.renderer.removeLayer(b)
    };
    this.setLayer3DTransform = function (a, b, c, d, e) {
        this.getLayer(a).set3DTransform(b || "translate3d(0, 0, 0)", c || "50% 50%", d, e)
    };
    this.skipMissedFrames = function () {
        n = (new Date).getTime()
    };
    this.getSceneObjectIndex = function (b) {
        return a.getSceneObjectIndex(b)
    };
    this.setSceneObjectIndex = function (b, c) {
        return a.setSceneObjectIndex(b, c)
    };
    this.setSwipeTolerance = function (a, b) {
        d.setSwipeTolerance(a, b || 3)
    };
    this.setLayerRenderMode = function (a, b) {
        this.getLayer(a).setRenderMode(b)
    };
    this.getLayerRenderMode = function (a) {
        return this.getLayer(a).getRenderMode()
    };
    this.isWebGlSupported = function () {
        try {
            var a = document.createElement("canvas"), b = a.getContext("webgl") || a.getContext("experimental-webgl")
        } catch (c) {
            return !1
        }
        return !!b
    };
    this.isDebugMode = function () {
        return !!C
    };
    this.doNothing = function () {
    };
    this.getAudio = function (a) {
        a = this.getFullPathAndFileName(a);
        return b.getAudio(a)
    };
    this.playSilentSound = function () {
        var a = b.getWebAudioContext();
        if (a) {
            var c = a.createOscillator();
            c.frequency.value = 440;
            var d = a.createGainNode();
            d.gain.value = 0;
            c.connect(d);
            d.connect(a.destination);
            c.start ? c.start(0) : c.noteOn(0);
            c.stop ? c.stop(0.001) : c.noteOff(0.001)
        } else {
            a = new Audio;
            a.src = "data:audio/wav;base64,UklGRjoAAABXQVZFZm10IBAAAAABAAEA6AcAANAPAAACABAAZGF0YQYAAAAAAAAAAAA%3D";
            try {
                a.play()
            } catch (e) {
            }
        }
    };
    this.event_mainLoopCallback_ = function () {
        var a = this;
        return function () {
            a.event_mainLoop()
        }
    };
    this.event_mainLoop = function () {
        var c;
        e = requestAnimationFrame(this.event_mainLoopCallback_());
        if (b.isFinishedLoading()) {
            for (c = 0; c < h.length; c++)"none" != h[c].style.display && (h[c].style.display = "none");
            u && "none" != u.style.display && (u.style.display = "none");
            if (g) {
                a.draw();
                c = (new Date).getTime();
                var d = 0, f = Math.round((c - n) / (1E3 * wade.c_timeStep));
                n ? d = Math.min(3, f) : n = c;
                d && (f > q / wade.c_timeStep ? (d = 1, n = c) : n += 1E3 * d * wade.c_timeStep);
                for (c = 0; c < d && !s; c++) {
                    a.step();
                    for (f = 0; f < m.length; f++)if (!m[f].paused) {
                        var j = m[f].func;
                        j && j()
                    }
                }
                s && a.setSimulationDirtyState()
            } else i && this.initializeApp()
        } else {
            n = (new Date).getTime();
            for (c = 0; c < h.length; c++)h[c].src && (h[c].style.display = "inline");
            u && (u.inner.style.width = this.getLoadingPercentage() +
            "%")
        }
    };
    this.event_appTimerEvent = function () {
        f = setTimeout("wade.event_appTimerEvent();", 1E3 * j);
        a.appTimerEvent()
    };
    this.onObjectNameChange = function (b, c) {
        b.isInScene() && a.changeObjectName(b, c)
    };
    this.getLayer = function (b) {
        return a.renderer.getLayer(b)
    };
    this.updateMouseInOut = function (b, c) {
        a.updateMouseInOut(b, c)
    };
    this.addImageUser = function (b, c) {
        a.renderer.addImageUser(b, c)
    };
    this.removeImageUser = function (b, c) {
        a.renderer.removeImageUser(b, c)
    };
    this.removeAllImageUsers = function (b) {
        a.renderer.removeAllImageUsers(b)
    };
    this.getInternalContext = function () {
        return D
    };
    this.getImageUsers = function (b) {
        return a.renderer.getImageUsers(b)
    };
    this.releaseImageReference = function (a) {
        b.releaseImageReference(this.getFullPathAndFileName(a))
    };
    window.console || (window.console = {});
    window.console.log || (window.console.log = function () {
    })
}
wade = new Wade;
function Wade_drawFunctions() {
    this.gradientFill_ = function (a, b) {
        return function (c) {
            if (this._visible)if (c.isWebGl)wade.log("wade.drawFunctions.gradientFill_ is not available in webgl mode"); else {
                var d = !this._gradient || this._gradient.colors != b || this._gradient.direction != a || this._gradient.size.x != this._size.x || this._gradient.size.y != this._size.y || this._gradient.position.x != this._position.x || this._gradient.position.y != this._position.y, e = 0.5 * wade.screenUnitToWorld(this._layer.id);
                if (d && 2 <= b.length) {
                    this._gradient =
                    {
                        colors: b,
                        direction: a,
                        size: {x: this._size.x, y: this._size.y},
                        position: {x: this._position.x, y: this._position.y}
                    };
                    this._gradient.gradient = c.createLinearGradient((this._position.x - this._size.x / 2 + e) * a.x, (this._position.y - this._size.y / 2 + e) * a.y, (this._position.x + this._size.x / 2 - e) * a.x, (this._position.y + this._size.y / 2 - e) * a.y);
                    for (d = 0; d < b.length; d++)this._gradient.gradient.addColorStop(d / (b.length - 1), b[d])
                }
                this._gradient && this._gradient.gradient ? (c.save(), this._rotation && (c.translate(this._position.x, this._position.y),
                    c.rotate(this._rotation), c.translate(-this._position.x, -this._position.y)), c.fillStyle = this._gradient.gradient, c.fillRect(this._position.x - this._size.x / 2 + e, this._position.y - this._size.y / 2 + e, this._size.x - e, this._size.y - e), c.restore()) : wade.log("Warning: attempting to draw a sprite with an invalid linear gradient")
            }
        }
    };
    this.solidFill_ = function (a) {
        return function (b) {
            if (this._visible)if (b.isWebGl)wade.log("wade.drawFunctions.solidFill_ is not available in webgl mode"); else {
                this._rotation && (b.save(), b.translate(this._position.x,
                    this._position.y), b.rotate(this._rotation), b.translate(-this._position.x, -this._position.y));
                var c = b.fillStyle, d = 0.5 * wade.screenUnitToWorld(this._layer.id);
                b.fillStyle = a;
                b.fillRect(this._position.x - this._size.x / 2 + d, this._position.y - this._size.y / 2 + d, this._size.x - d, this._size.y - d);
                b.fillStyle = c;
                this._rotation && b.restore()
            }
        }
    };
    this.solidFillInt_ = function (a) {
        return function (b) {
            if (this._visible)if (b.isWebGl)wade.log("wade.drawFunctions.solidFillInt_ is not available in webgl mode"); else {
                this._rotation &&
                (b.save(), b.translate(this._position.x, this._position.y), b.rotate(this._rotation), b.translate(-this._position.x, -this._position.y));
                var c = b.fillStyle, d = 0.5 * wade.screenUnitToWorld(this._layer.id);
                b.fillStyle = a;
                b.fillRect(Math.floor(this._position.x - this._size.x / 2 + d), Math.floor(this._position.y - this._size.y / 2 + d), Math.floor(this._size.x - d), Math.floor(this._size.y - d));
                b.fillStyle = c;
                this._rotation && b.restore()
            }
        }
    };
    this.drawRect_ = function (a, b) {
        return function (c) {
            if (this._visible)if (c.isWebGl)wade.log("wade.drawFunctions.drawRect_ is not available in webgl mode");
            else {
                this._rotation && (c.save(), c.translate(this._position.x, this._position.y), c.rotate(this._rotation), c.translate(-this._position.x, -this._position.y));
                var d = c.fillStyle, e = c.lineWidth, f = 0.5 * wade.screenUnitToWorld(this._layer.id);
                c.strokeStyle = a;
                c.lineWidth = b;
                c.strokeRect(this._position.x - this._size.x / 2 + b + f, this._position.y - this._size.y / 2 + b + f, this._size.x - 2 * b - f, this._size.y - 2 * b - f);
                c.fillStyle = d;
                c.lineWidth = e;
                this._rotation && c.restore()
            }
        }
    };
    this.radialGradientCircle_ = function (a, b) {
        b = b || "rgba(0, 0, 0, 0)";
        return function (c) {
            if (this._visible)if (c.isWebGl)wade.log("wade.drawFunctions.radialGradientCircle_ is not available in webgl mode"); else {
                var d = 0.5 * wade.screenUnitToWorld(this._layer.id), e = Math.min(this._size.x, this._size.y) / 2 - d;
                if (!this._gradient || this._gradient.colors != a || this._gradient.minRadius != e || this._gradient.position.x != this._position.x || this._gradient.position.y != this._position.y) {
                    this._gradient = {colors: a, minRadius: e, position: {x: this._position.x, y: this._position.y}};
                    this._gradient.gradient =
                        c.createRadialGradient(this._position.x, this._position.y, 0, this._position.x, this._position.y, e);
                    for (e = 0; e < a.length; e++)this._gradient.gradient.addColorStop(e / a.length, a[e]);
                    this._gradient.gradient.addColorStop(1, b)
                }
                c.save();
                this._rotation && (c.translate(this._position.x, this._position.y), c.rotate(this._rotation), c.translate(-this._position.x, -this._position.y));
                c.fillStyle = this._gradient.gradient;
                c.fillRect(this._position.x - this._size.x / 2 + d, this._position.y - this._size.y / 2 + d, this._size.x - d, this._size.y -
                d);
                c.restore()
            }
        }
    };
    this.solidFade_ = function (a, b, c, d, e, f, g, i, l, j) {
        var h = 0;
        return function (m) {
            if (this._visible)if (m.isWebGl)wade.log("wade.drawFunctions.solidFade_ is not available in webgl mode"); else {
                if (!this._animations.__fade) {
                    var n = new Animation("", 1, 1, 1, !0);
                    this.addAnimation("__fade", n)
                }
                this.playAnimation("__fade");
                var n = m.fillStyle, p = h / l, t = Math.floor(a * (1 - p) + e * p), r = Math.floor(b * (1 - p) + f * p), z = Math.floor(c * (1 - p) + g * p), p = d * (1 - p) + i * p;
                this._rotation && (m.save(), m.translate(this._position.x, this._position.y),
                    m.rotate(this._rotation), m.translate(-this._position.x, -this._position.y));
                m.fillStyle = "rgba(" + t + "," + r + "," + z + "," + p + ")";
                t = 0.5 * wade.screenUnitToWorld(this._layer.id);
                m.fillRect(this._position.x - this._size.x / 2 + t, this._position.y - this._size.y / 2 + t, this._size.x - t, this._size.y - t);
                m.fillStyle = n;
                this._rotation && m.restore();
                h < l && (h++, h == l && j && j())
            }
        }
    };
    this.grid_ = function (a, b, c, d) {
        return function (e) {
            if (this._visible)if (e.isWebGl)wade.log("wade.drawFunctions.grid_ is not available in webgl mode"); else {
                d = d || 1;
                e.save();
                e.lineWidth = d;
                e.strokeStyle = c;
                e.lineJoin = "round";
                e.lineCap = "round";
                this._rotation && (e.translate(this._position.x, this._position.y), e.rotate(this._rotation), e.translate(-this._position.x, -this._position.y));
                for (var f = 0.5 * wade.screenUnitToWorld(this._layer.id) * d, g = (this._size.x - 2 * f) / a, i = (this._size.y - 2 * f) / b, l = this._position.x - this._size.x / 2 + f, j = this._position.y - this._size.y / 2 + f, h = this._position.x + this._size.x / 2 - f, f = this._position.y + this._size.y / 2 - f, m = l, n = j, p = 0; p <= b; p++)e.beginPath(), e.moveTo(l,
                    n), e.lineTo(h, n), e.stroke(), n += i;
                for (i = 0; i <= a; i++)e.beginPath(), e.moveTo(m, j), e.lineTo(m, f), e.stroke(), m += g;
                e.restore()
            }
        }
    };
    this.alpha_ = function (a, b) {
        return function (c) {
            if (this._visible) {
                var d = c.globalAlpha;
                c.globalAlpha = a;
                b.call(this, c);
                c.globalAlpha = d
            }
        }
    };
    this.blink_ = function (a, b, c) {
        var d = 1, e = a;
        return function (f) {
            if (this._visible) {
                if (0 > (e -= wade.c_timeStep))e = d ? b : a, d = !d;
                d && c.call(this, f);
                this.setDirtyArea()
            }
        }
    };
    this.fadeOpacity_ = function (a, b, c, d, e) {
        var f = (b - a) * wade.c_timeStep / c, g = a, d = d || Sprite.prototype.draw,
            i = function (c) {
                if (this._visible) {
                    var j = g;
                    g = Math[b > a ? "min" : "max"](b, g + f);
                    var h = c.globalAlpha;
                    c.globalAlpha = g;
                    d.call(this, c);
                    c.globalAlpha = h;
                    g == b && 1 == g ? this.getDrawFunction() == i && this.setDrawFunction(d) : g != j && this.setDirtyArea();
                    g == b && (e && e(), e = null)
                }
            };
        return i
    };
    this.resizeOverTime_ = function (a, b, c, d, e, f, g) {
        var i = (c - a) * wade.c_timeStep / e, l = a, j = (d - b) * wade.c_timeStep / e, h = b, f = f || Sprite.prototype.draw, m = function (e) {
            this._visible && (l = Math[c > a ? "min" : "max"](c, l + i), h = Math[d > b ? "min" : "max"](d, h + j), this.setSize(l,
                h), f.call(this, e), l == c && h == d && (m == this.getDrawFunction() && this.setDrawFunction(f), g && g(), g = null))
        };
        return m
    };
    this.resizePeriodically_ = function (a, b, c, d, e, f) {
        var g = 1, i = (c - a) * wade.c_timeStep / e, l = a, j = (d - b) * wade.c_timeStep / e, h = b, f = f || Sprite.prototype.draw;
        return function (e) {
            if (this._visible) {
                var n = 1 == g ? c : a, p = 1 == g ? b : d, t = 1 == g ? d : b;
                l = Math[n > (1 == g ? a : c) ? "min" : "max"](n, l + i * g);
                h = Math[t > p ? "min" : "max"](t, h + j * g);
                this.setSize(l, h);
                f.call(this, e);
                l == n && h == t && (g *= -1)
            }
        }
    };
    this.mirror_ = function (a) {
        a = a || Sprite.prototype.draw;
        return function (b) {
            b.isWebGl ? (this._f32AnimFrameInfo[2] *= -1, this._animations[this._currentAnimation].mirror()) : b.scale(-1, 1);
            var c = this._position.x, d = this._cornerX;
            this._position.x *= -1;
            this._cornerX = this._position.x - this._size.x / 2;
            a.call(this, b);
            this._position.x = c;
            this._cornerX = d;
            b.isWebGl ? (this._f32AnimFrameInfo[2] *= -1, this._animations[this._currentAnimation].mirror()) : b.scale(-1, 1)
        }
    };
    this.flip_ = function (a) {
        a = a || Sprite.prototype.draw;
        return function (b) {
            b.isWebGl ? (this._f32AnimFrameInfo[3] *= -1, this._animations[this._currentAnimation].flip()) :
                b.scale(1, -1);
            var c = this._position.y, d = this._cornerY;
            this._position.y *= -1;
            this._cornerY = this._position.y - this._size.y / 2;
            a.call(this, b);
            this._position.y = c;
            this._cornerY = d;
            b.isWebGl ? (this._f32AnimFrameInfo[3] *= -1, this._animations[this._currentAnimation].flip()) : b.scale(1, -1)
        }
    };
    this.composite_ = function (a, b) {
        b = b || Sprite.prototype.draw;
        return function (c) {
            if (a != c.globalCompositeOperation) {
                var d = c.globalCompositeOperation;
                c.globalCompositeOperation = a;
                b.call(this, c);
                c.globalCompositeOperation = d
            } else b.call(this,
                c)
        }
    };
    this.boundingBox_ = function (a, b, c) {
        a = a || "red";
        b = b || "blue";
        c = c || Sprite.prototype.draw;
        return function (d) {
            if (this._visible)if (d.isWebGl)wade.log("wade.drawFunctions.boundingBox_ is not available in webgl mode"); else {
                d.save();
                d.lineWidth = 1;
                var e = 0.5 * wade.screenUnitToWorld(this._layer.id);
                if (this._rotation) {
                    d.strokeStyle = b;
                    d.lineJoin = "round";
                    d.lineCap = "round";
                    d.beginPath();
                    var f = -this.orientedBoundingBox.axisXx - this.orientedBoundingBox.axisYx, g = -this.orientedBoundingBox.axisXx + this.orientedBoundingBox.axisYx,
                        i = this.orientedBoundingBox.axisXx + this.orientedBoundingBox.axisYx, l = this.orientedBoundingBox.axisXx - this.orientedBoundingBox.axisYx, j = -this.orientedBoundingBox.axisXy - this.orientedBoundingBox.axisYy, h = -this.orientedBoundingBox.axisXy + this.orientedBoundingBox.axisYy, m = this.orientedBoundingBox.axisXy + this.orientedBoundingBox.axisYy, n = this.orientedBoundingBox.axisXy - this.orientedBoundingBox.axisYy, f = f + (0 < f ? -e : e), g = g + (0 < g ? -e : e), l = l + (0 < l ? -e : e), i = i + (0 < i ? -e : e), j = j + (0 < j ? -e : e), h = h + (0 < h ? -e : e), n = n + (0 < n ? -e : e),
                        m = m + (0 < m ? -e : e);
                    d.moveTo(this.orientedBoundingBox.centerX + f, this.orientedBoundingBox.centerY + j);
                    d.lineTo(this.orientedBoundingBox.centerX + g, this.orientedBoundingBox.centerY + h);
                    d.lineTo(this.orientedBoundingBox.centerX + i, this.orientedBoundingBox.centerY + m);
                    d.lineTo(this.orientedBoundingBox.centerX + l, this.orientedBoundingBox.centerY + n);
                    d.lineTo(this.orientedBoundingBox.centerX + f, this.orientedBoundingBox.centerY + j);
                    d.stroke()
                }
                d.strokeStyle = a;
                d.beginPath();
                d.moveTo(this.boundingBox.minX + e, this.boundingBox.minY +
                e);
                d.lineTo(this.boundingBox.maxX - e, this.boundingBox.minY + e);
                d.lineTo(this.boundingBox.maxX - e, this.boundingBox.maxY - e);
                d.lineTo(this.boundingBox.minX + e, this.boundingBox.maxY - e);
                d.lineTo(this.boundingBox.minX + e, this.boundingBox.minY + e);
                d.stroke();
                d.restore();
                c.call(this, d)
            }
        }
    };
    this.transparent_ = function () {
        return function () {
        }
    }
}
wade.drawFunctions = new Wade_drawFunctions;
function Wade_vec2() {
    this.add = function (a, b) {
        return {x: a.x + b.x, y: a.y + b.y}
    };
    this.sub = function (a, b) {
        return {x: a.x - b.x, y: a.y - b.y}
    };
    this.mul = function (a, b) {
        return {x: a.x * b.x, y: a.y * b.y}
    };
    this.div = function (a, b) {
        return {x: a.x / b.x, y: a.y / b.y}
    };
    this.dot = function (a, b) {
        return a.x * b.x + a.y * b.y
    };
    this.lengthSquared = function (a) {
        return a.x * a.x + a.y * a.y
    };
    this.length = function (a) {
        return Math.sqrt(a.x * a.x + a.y * a.y)
    };
    this.normalize = function (a) {
        var b = Math.sqrt(a.x * a.x + a.y * a.y);
        return {x: a.x / b, y: a.y / b}
    };
    this.normalizeIfPossible = function (a) {
        var b =
            Math.sqrt(a.x * a.x + a.y * a.y);
        return b < wade.c_epsilon ? {x: a.x, y: a.y} : {x: a.x / b, y: a.y / b}
    };
    this.scale = function (a, b) {
        return {x: a.x * b, y: a.y * b}
    };
    this.clamp = function (a, b, c) {
        return {x: Math.min(Math.max(a.x, b), c), y: Math.min(Math.max(a.y, b), c)}
    };
    this.rotate = function (a, b) {
        var c = Math.sin(b), d = Math.cos(b);
        return {x: d * a.x - c * a.y, y: c * a.x + d * a.y}
    };
    this.addInPlace = function (a, b) {
        a.x += b.x;
        a.y += b.y
    };
    this.subInPlace = function (a, b) {
        a.x -= b.x;
        a.y -= b.y
    };
    this.mulInPlace = function (a, b) {
        a.x *= b.x;
        a.y *= b.y
    };
    this.divInPlace = function (a, b) {
        a.x /=
            b.x;
        a.y /= b.y
    };
    this.normalizeInPlace = function (a) {
        var b = Math.sqrt(a.x * a.x + a.y * a.y);
        a.x /= b;
        a.y /= b
    };
    this.normalizeInPlaceIfPossible = function (a) {
        var b = Math.sqrt(a.x * a.x + a.y * a.y);
        b < wade.c_epsilon && (a.x /= b, a.y /= b)
    };
    this.scaleInPlace = function (a, b) {
        a.x *= b;
        a.y *= b
    };
    this.clampInPlace = function (a, b, c) {
        a.x = Math.min(Math.max(a.x, b), c);
        a.y = Math.min(Math.max(a.y, b), c)
    };
    this.rotateInPlace = function (a, b) {
        var c = Math.sin(b), d = Math.cos(b), e = c * a.x + d * a.y;
        a.x = d * a.x - c * a.y;
        a.y = e
    }
}
wade.vec2 = new Wade_vec2;
wade.proceduralImages = new function () {
    var a = [];
    this.init = function () {
        var b = new Sprite;
        b.setSize(32, 32);
        b.setDrawFunction(wade.drawFunctions.solidFill_("white"));
        b.drawToImage("procedural_square", !0);
        a.push("procedural_square");
        b.setDrawFunction(function (a) {
            var b = this.getPosition();
            a.closePath();
            a.beginPath();
            a.fillStyle = "white";
            a.arc(b.x, b.y, 16, 0, 2 * Math.PI, !1);
            a.fill()
        });
        b.drawToImage("procedural_circle", !0);
        a.push("procedural_circle");
        b.setDrawFunction(wade.drawFunctions.radialGradientCircle_(["white"],
            "rgba(255, 255, 255, 0)"));
        b.drawToImage("procedural_fadingCircle", !0);
        a.push("procedural_fadingCircle");
        b.setDrawFunction(function (a) {
            var b = this.getPosition();
            a.closePath();
            a.beginPath();
            a.fillStyle = "white";
            a.moveTo(-32 / 6 + b.x, -32 / 6 + b.y);
            a.lineTo(0 + b.x, -16 + b.y);
            a.lineTo(32 / 6 + b.x, -32 / 6 + b.y);
            a.lineTo(16 + b.x, 0 + b.y);
            a.lineTo(32 / 6 + b.x, 32 / 6 + b.y);
            a.lineTo(0 + b.x, 16 + b.y);
            a.lineTo(-32 / 6 + b.x, 32 / 6 + b.y);
            a.lineTo(-16 + b.x, 0 + b.y);
            a.lineTo(-32 / 6 + b.x, -32 / 6 + b.y);
            a.fill()
        });
        b.drawToImage("procedural_star", !0);
        a.push("procedural_star");
        wade.removeLayer(1)
    };
    this.list = function () {
        return wade.cloneArray(a)
    }
};
