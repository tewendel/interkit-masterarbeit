var app = (function () {
    'use strict';

    var CameraSource$1;
    (function (CameraSource) {
        CameraSource["Prompt"] = "PROMPT";
        CameraSource["Camera"] = "CAMERA";
        CameraSource["Photos"] = "PHOTOS";
    })(CameraSource$1 || (CameraSource$1 = {}));
    var CameraDirection$1;
    (function (CameraDirection) {
        CameraDirection["Rear"] = "REAR";
        CameraDirection["Front"] = "FRONT";
    })(CameraDirection$1 || (CameraDirection$1 = {}));
    var CameraResultType$1;
    (function (CameraResultType) {
        CameraResultType["Uri"] = "uri";
        CameraResultType["Base64"] = "base64";
        CameraResultType["DataUrl"] = "dataUrl";
    })(CameraResultType$1 || (CameraResultType$1 = {}));
    var FilesystemDirectory$1;
    (function (FilesystemDirectory) {
        /**
         * The Documents directory
         * On iOS it's the app's documents directory.
         * Use this directory to store user-generated content.
         * On Android it's the Public Documents folder, so it's accessible from other apps.
         * It's not accesible on Android 10 unless the app enables legacy External Storage
         * by adding `android:requestLegacyExternalStorage="true"` in the `application` tag
         * in the `AndroidManifest.xml`
         */
        FilesystemDirectory["Documents"] = "DOCUMENTS";
        /**
         * The Data directory
         * On iOS it will use the Documents directory
         * On Android it's the directory holding application files.
         * Files will be deleted when the application is uninstalled.
         */
        FilesystemDirectory["Data"] = "DATA";
        /**
         * The Cache directory
         * Can be deleted in cases of low memory, so use this directory to write app-specific files
         * that your app can re-create easily.
         */
        FilesystemDirectory["Cache"] = "CACHE";
        /**
         * The external directory
         * On iOS it will use the Documents directory
         * On Android it's the directory on the primary shared/external
         * storage device where the application can place persistent files it owns.
         * These files are internal to the applications, and not typically visible
         * to the user as media.
         * Files will be deleted when the application is uninstalled.
         */
        FilesystemDirectory["External"] = "EXTERNAL";
        /**
         * The external storage directory
         * On iOS it will use the Documents directory
         * On Android it's the primary shared/external storage directory.
         * It's not accesible on Android 10 unless the app enables legacy External Storage
         * by adding `android:requestLegacyExternalStorage="true"` in the `application` tag
         * in the `AndroidManifest.xml`
         */
        FilesystemDirectory["ExternalStorage"] = "EXTERNAL_STORAGE";
    })(FilesystemDirectory$1 || (FilesystemDirectory$1 = {}));
    var FilesystemEncoding$1;
    (function (FilesystemEncoding) {
        FilesystemEncoding["UTF8"] = "utf8";
        FilesystemEncoding["ASCII"] = "ascii";
        FilesystemEncoding["UTF16"] = "utf16";
    })(FilesystemEncoding$1 || (FilesystemEncoding$1 = {}));
    var HapticsImpactStyle$1;
    (function (HapticsImpactStyle) {
        HapticsImpactStyle["Heavy"] = "HEAVY";
        HapticsImpactStyle["Medium"] = "MEDIUM";
        HapticsImpactStyle["Light"] = "LIGHT";
    })(HapticsImpactStyle$1 || (HapticsImpactStyle$1 = {}));
    var HapticsNotificationType$1;
    (function (HapticsNotificationType) {
        HapticsNotificationType["SUCCESS"] = "SUCCESS";
        HapticsNotificationType["WARNING"] = "WARNING";
        HapticsNotificationType["ERROR"] = "ERROR";
    })(HapticsNotificationType$1 || (HapticsNotificationType$1 = {}));
    var KeyboardStyle$1;
    (function (KeyboardStyle) {
        KeyboardStyle["Dark"] = "DARK";
        KeyboardStyle["Light"] = "LIGHT";
    })(KeyboardStyle$1 || (KeyboardStyle$1 = {}));
    var KeyboardResize$1;
    (function (KeyboardResize) {
        KeyboardResize["Body"] = "body";
        KeyboardResize["Ionic"] = "ionic";
        KeyboardResize["Native"] = "native";
        KeyboardResize["None"] = "none";
    })(KeyboardResize$1 || (KeyboardResize$1 = {}));
    var ActionSheetOptionStyle$1;
    (function (ActionSheetOptionStyle) {
        ActionSheetOptionStyle["Default"] = "DEFAULT";
        ActionSheetOptionStyle["Destructive"] = "DESTRUCTIVE";
        ActionSheetOptionStyle["Cancel"] = "CANCEL";
    })(ActionSheetOptionStyle$1 || (ActionSheetOptionStyle$1 = {}));
    //
    var PermissionType$1;
    (function (PermissionType) {
        PermissionType["Camera"] = "camera";
        PermissionType["Photos"] = "photos";
        PermissionType["Geolocation"] = "geolocation";
        PermissionType["Notifications"] = "notifications";
        PermissionType["ClipboardRead"] = "clipboard-read";
        PermissionType["ClipboardWrite"] = "clipboard-write";
        PermissionType["Microphone"] = "microphone";
    })(PermissionType$1 || (PermissionType$1 = {}));
    var PhotosAlbumType$1;
    (function (PhotosAlbumType) {
        /**
         * Album is a "smart" album (such as Favorites or Recently Added)
         */
        PhotosAlbumType["Smart"] = "smart";
        /**
         * Album is a cloud-shared album
         */
        PhotosAlbumType["Shared"] = "shared";
        /**
         * Album is a user-created album
         */
        PhotosAlbumType["User"] = "user";
    })(PhotosAlbumType$1 || (PhotosAlbumType$1 = {}));
    var StatusBarStyle$1;
    (function (StatusBarStyle) {
        /**
         * Light text for dark backgrounds.
         */
        StatusBarStyle["Dark"] = "DARK";
        /**
         * Dark text for light backgrounds.
         */
        StatusBarStyle["Light"] = "LIGHT";
    })(StatusBarStyle$1 || (StatusBarStyle$1 = {}));
    var StatusBarAnimation$1;
    (function (StatusBarAnimation) {
        /**
         * No animation during show/hide.
         */
        StatusBarAnimation["None"] = "NONE";
        /**
         * Slide animation during show/hide.
         */
        StatusBarAnimation["Slide"] = "SLIDE";
        /**
         * Fade animation during show/hide.
         */
        StatusBarAnimation["Fade"] = "FADE";
    })(StatusBarAnimation$1 || (StatusBarAnimation$1 = {}));

    var CapacitorWeb$1 = /** @class */ (function () {
        function CapacitorWeb() {
            var _this = this;
            this.platform = 'web';
            this.isNative = false;
            // Need to assign here to avoid having to define every plugin but still
            // get the typed benefits of the provided plugins in PluginRegistry
            this.Plugins = {};
            // Gracefully degrade in non-Proxy supporting engines, e.g. IE11. This
            // effectively means that trying to access an unavailable plugin will
            // locally throw, but this is still better than throwing a syntax error.
            if (typeof Proxy !== 'undefined') {
                // Build a proxy for the Plugins object that returns the "Noop Plugin"
                // if a plugin isn't available
                this.Plugins = new Proxy(this.Plugins, {
                    get: function (target, prop) {
                        if (typeof target[prop] === 'undefined') {
                            var thisRef_1 = _this;
                            return new Proxy({}, {
                                get: function (_target, _prop) {
                                    if (typeof _target[_prop] === 'undefined') {
                                        return thisRef_1.pluginMethodNoop.bind(thisRef_1, _target, _prop, prop);
                                    }
                                    else {
                                        return _target[_prop];
                                    }
                                }
                            });
                        }
                        else {
                            return target[prop];
                        }
                    }
                });
            }
        }
        CapacitorWeb.prototype.pluginMethodNoop = function (_target, _prop, pluginName) {
            return Promise.reject(pluginName + " does not have web implementation.");
        };
        CapacitorWeb.prototype.getPlatform = function () {
            return this.platform;
        };
        CapacitorWeb.prototype.isPluginAvailable = function (name) {
            return this.Plugins.hasOwnProperty(name);
        };
        CapacitorWeb.prototype.convertFileSrc = function (filePath) {
            return filePath;
        };
        CapacitorWeb.prototype.handleError = function (e) {
            console.error(e);
        };
        return CapacitorWeb;
    }());

    // Create our default Capacitor instance, which will be
    // overridden on native platforms
    var Capacitor$2 = (function (globalThis) {
        // Create a new CapacitorWeb instance if one doesn't already exist on globalThis
        // Ensure the global is assigned the same Capacitor instance,
        // then export Capacitor so it can be imported in other modules
        return globalThis.Capacitor = (globalThis.Capacitor || new CapacitorWeb$1());
    })(
    // figure out the current globalThis, such as "window", "self" or "global"
    // ensure errors are not thrown in an node SSR environment or web worker
    typeof self !== 'undefined' ? self : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : {});
    var Plugins$1 = Capacitor$2.Plugins;

    var WebPluginRegistry$1 = /** @class */ (function () {
        function WebPluginRegistry() {
            this.plugins = {};
            this.loadedPlugins = {};
        }
        WebPluginRegistry.prototype.addPlugin = function (plugin) {
            this.plugins[plugin.config.name] = plugin;
        };
        WebPluginRegistry.prototype.getPlugin = function (name) {
            return this.plugins[name];
        };
        WebPluginRegistry.prototype.loadPlugin = function (name) {
            var plugin = this.getPlugin(name);
            if (!plugin) {
                console.error("Unable to load web plugin " + name + ", no such plugin found.");
                return;
            }
            plugin.load();
        };
        WebPluginRegistry.prototype.getPlugins = function () {
            var p = [];
            for (var name_1 in this.plugins) {
                p.push(this.plugins[name_1]);
            }
            return p;
        };
        return WebPluginRegistry;
    }());
    var WebPlugins$1 = new WebPluginRegistry$1();
    var WebPlugin$1 = /** @class */ (function () {
        function WebPlugin(config, pluginRegistry) {
            this.config = config;
            this.loaded = false;
            this.listeners = {};
            this.windowListeners = {};
            if (!pluginRegistry) {
                WebPlugins$1.addPlugin(this);
            }
            else {
                pluginRegistry.addPlugin(this);
            }
        }
        WebPlugin.prototype.addWindowListener = function (handle) {
            window.addEventListener(handle.windowEventName, handle.handler);
            handle.registered = true;
        };
        WebPlugin.prototype.removeWindowListener = function (handle) {
            if (!handle) {
                return;
            }
            window.removeEventListener(handle.windowEventName, handle.handler);
            handle.registered = false;
        };
        WebPlugin.prototype.addListener = function (eventName, listenerFunc) {
            var _this = this;
            var listeners = this.listeners[eventName];
            if (!listeners) {
                this.listeners[eventName] = [];
            }
            this.listeners[eventName].push(listenerFunc);
            // If we haven't added a window listener for this event and it requires one,
            // go ahead and add it
            var windowListener = this.windowListeners[eventName];
            if (windowListener && !windowListener.registered) {
                this.addWindowListener(windowListener);
            }
            return {
                remove: function () {
                    _this.removeListener(eventName, listenerFunc);
                }
            };
        };
        WebPlugin.prototype.removeListener = function (eventName, listenerFunc) {
            var listeners = this.listeners[eventName];
            if (!listeners) {
                return;
            }
            var index = listeners.indexOf(listenerFunc);
            this.listeners[eventName].splice(index, 1);
            // If there are no more listeners for this type of event,
            // remove the window listener
            if (!this.listeners[eventName].length) {
                this.removeWindowListener(this.windowListeners[eventName]);
            }
        };
        WebPlugin.prototype.removeAllListeners = function () {
            this.listeners = {};
            for (var listener in this.windowListeners) {
                this.removeWindowListener(this.windowListeners[listener]);
            }
            this.windowListeners = {};
        };
        WebPlugin.prototype.notifyListeners = function (eventName, data) {
            var listeners = this.listeners[eventName];
            if (listeners) {
                listeners.forEach(function (listener) { return listener(data); });
            }
        };
        WebPlugin.prototype.hasListeners = function (eventName) {
            return !!this.listeners[eventName].length;
        };
        WebPlugin.prototype.registerWindowListener = function (windowEventName, pluginEventName) {
            var _this = this;
            this.windowListeners[pluginEventName] = {
                registered: false,
                windowEventName: windowEventName,
                pluginEventName: pluginEventName,
                handler: function (event) {
                    _this.notifyListeners(pluginEventName, event);
                }
            };
        };
        WebPlugin.prototype.requestPermissions = function () {
            if (Capacitor.isNative) {
                return Capacitor.nativePromise(this.config.name, 'requestPermissions', {});
            }
            else {
                return Promise.resolve({ results: [] });
            }
        };
        WebPlugin.prototype.load = function () {
            this.loaded = true;
        };
        return WebPlugin;
    }());
    var shouldMergeWebPlugin$1 = function (plugin) {
        return plugin.config.platforms && plugin.config.platforms.indexOf(Capacitor.platform) >= 0;
    };
    /**
     * For all our known web plugins, merge them into the global plugins
     * registry if they aren't already existing. If they don't exist, that
     * means there's no existing native implementation for it.
     * @param knownPlugins the Capacitor.Plugins global registry.
     */
    var mergeWebPlugins$1 = function (knownPlugins) {
        var plugins = WebPlugins$1.getPlugins();
        for (var _i = 0, plugins_1 = plugins; _i < plugins_1.length; _i++) {
            var plugin = plugins_1[_i];
            mergeWebPlugin$1(knownPlugins, plugin);
        }
    };
    var mergeWebPlugin$1 = function (knownPlugins, plugin) {
        // If we already have a plugin registered (meaning it was defined in the native layer),
        // then we should only overwrite it if the corresponding web plugin activates on
        // a certain platform. For example: Geolocation uses the WebPlugin on Android but not iOS
        if (knownPlugins.hasOwnProperty(plugin.config.name) && !shouldMergeWebPlugin$1(plugin)) {
            return;
        }
        knownPlugins[plugin.config.name] = plugin;
    };

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    /* global Reflect, Promise */

    var extendStatics$1 = function(d, b) {
        extendStatics$1 = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics$1(d, b);
    };

    function __extends$1(d, b) {
        extendStatics$1(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    function __awaiter$2(thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    function __generator$1(thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (_) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    }

    var AccessibilityPluginWeb$1 = /** @class */ (function (_super) {
        __extends$1(AccessibilityPluginWeb, _super);
        function AccessibilityPluginWeb() {
            return _super.call(this, {
                name: 'Accessibility',
                platforms: ['web']
            }) || this;
        }
        AccessibilityPluginWeb.prototype.isScreenReaderEnabled = function () {
            throw new Error('Feature not available in the browser');
        };
        AccessibilityPluginWeb.prototype.speak = function (options) {
            if (!('speechSynthesis' in window)) {
                return Promise.reject('Browser does not support the Speech Synthesis API');
            }
            var utterance = new SpeechSynthesisUtterance(options.value);
            if (options.language) {
                utterance.lang = options.language;
            }
            window.speechSynthesis.speak(utterance);
            return Promise.resolve();
        };
        return AccessibilityPluginWeb;
    }(WebPlugin$1));
    new AccessibilityPluginWeb$1();

    var AppPluginWeb$1 = /** @class */ (function (_super) {
        __extends$1(AppPluginWeb, _super);
        function AppPluginWeb() {
            var _this = _super.call(this, {
                name: 'App',
                platforms: ['web']
            }) || this;
            if (typeof document !== 'undefined') {
                document.addEventListener('visibilitychange', _this.handleVisibilityChange.bind(_this), false);
            }
            return _this;
        }
        AppPluginWeb.prototype.exitApp = function () {
            throw new Error('Method not implemented.');
        };
        AppPluginWeb.prototype.canOpenUrl = function (_options) {
            return Promise.resolve({ value: true });
        };
        AppPluginWeb.prototype.openUrl = function (_options) {
            return Promise.resolve({ completed: true });
        };
        AppPluginWeb.prototype.getLaunchUrl = function () {
            return Promise.resolve({ url: '' });
        };
        AppPluginWeb.prototype.getState = function () {
            return Promise.resolve({ isActive: document.hidden !== true });
        };
        AppPluginWeb.prototype.handleVisibilityChange = function () {
            var data = {
                isActive: document.hidden !== true
            };
            this.notifyListeners('appStateChange', data);
        };
        return AppPluginWeb;
    }(WebPlugin$1));
    new AppPluginWeb$1();

    var BrowserPluginWeb$1 = /** @class */ (function (_super) {
        __extends$1(BrowserPluginWeb, _super);
        function BrowserPluginWeb() {
            return _super.call(this, {
                name: 'Browser',
                platforms: ['web']
            }) || this;
        }
        BrowserPluginWeb.prototype.open = function (options) {
            return __awaiter$2(this, void 0, void 0, function () {
                return __generator$1(this, function (_a) {
                    this._lastWindow = window.open(options.url, options.windowName || '_blank');
                    return [2 /*return*/, Promise.resolve()];
                });
            });
        };
        BrowserPluginWeb.prototype.prefetch = function (_options) {
            return __awaiter$2(this, void 0, void 0, function () {
                return __generator$1(this, function (_a) {
                    // Does nothing
                    return [2 /*return*/, Promise.resolve()];
                });
            });
        };
        BrowserPluginWeb.prototype.close = function () {
            return __awaiter$2(this, void 0, void 0, function () {
                return __generator$1(this, function (_a) {
                    this._lastWindow && this._lastWindow.close();
                    return [2 /*return*/, Promise.resolve()];
                });
            });
        };
        return BrowserPluginWeb;
    }(WebPlugin$1));
    new BrowserPluginWeb$1();

    var CameraPluginWeb$1 = /** @class */ (function (_super) {
        __extends$1(CameraPluginWeb, _super);
        function CameraPluginWeb() {
            return _super.call(this, {
                name: 'Camera',
                platforms: ['web']
            }) || this;
        }
        CameraPluginWeb.prototype.getPhoto = function (options) {
            return __awaiter$2(this, void 0, void 0, function () {
                var _this = this;
                return __generator$1(this, function (_a) {
                    return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter$2(_this, void 0, void 0, function () {
                            var cameraModal_1;
                            var _this = this;
                            return __generator$1(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (!options.webUseInput) return [3 /*break*/, 1];
                                        this.fileInputExperience(options, resolve);
                                        return [3 /*break*/, 7];
                                    case 1:
                                        if (!customElements.get('pwa-camera-modal')) return [3 /*break*/, 6];
                                        cameraModal_1 = document.createElement('pwa-camera-modal');
                                        document.body.appendChild(cameraModal_1);
                                        _a.label = 2;
                                    case 2:
                                        _a.trys.push([2, 4, , 5]);
                                        return [4 /*yield*/, cameraModal_1.componentOnReady()];
                                    case 3:
                                        _a.sent();
                                        cameraModal_1.addEventListener('onPhoto', function (e) { return __awaiter$2(_this, void 0, void 0, function () {
                                            var photo, _a;
                                            return __generator$1(this, function (_b) {
                                                switch (_b.label) {
                                                    case 0:
                                                        photo = e.detail;
                                                        if (!(photo === null)) return [3 /*break*/, 1];
                                                        reject('User cancelled photos app');
                                                        return [3 /*break*/, 4];
                                                    case 1:
                                                        if (!(photo instanceof Error)) return [3 /*break*/, 2];
                                                        reject(photo.message);
                                                        return [3 /*break*/, 4];
                                                    case 2:
                                                        _a = resolve;
                                                        return [4 /*yield*/, this._getCameraPhoto(photo, options)];
                                                    case 3:
                                                        _a.apply(void 0, [_b.sent()]);
                                                        _b.label = 4;
                                                    case 4:
                                                        cameraModal_1.dismiss();
                                                        document.body.removeChild(cameraModal_1);
                                                        return [2 /*return*/];
                                                }
                                            });
                                        }); });
                                        cameraModal_1.present();
                                        return [3 /*break*/, 5];
                                    case 4:
                                        _a.sent();
                                        this.fileInputExperience(options, resolve);
                                        return [3 /*break*/, 5];
                                    case 5: return [3 /*break*/, 7];
                                    case 6:
                                        console.error("Unable to load PWA Element 'pwa-camera-modal'. See the docs: https://capacitorjs.com/docs/pwa-elements.");
                                        this.fileInputExperience(options, resolve);
                                        _a.label = 7;
                                    case 7: return [2 /*return*/];
                                }
                            });
                        }); })];
                });
            });
        };
        CameraPluginWeb.prototype.fileInputExperience = function (options, resolve) {
            var input = document.querySelector('#_capacitor-camera-input');
            var cleanup = function () {
                input.parentNode && input.parentNode.removeChild(input);
            };
            if (!input) {
                input = document.createElement('input');
                input.id = '_capacitor-camera-input';
                input.type = 'file';
                document.body.appendChild(input);
            }
            input.accept = 'image/*';
            input.capture = true;
            if (options.source === CameraSource$1.Photos || options.source === CameraSource$1.Prompt) {
                input.removeAttribute('capture');
            }
            else if (options.direction === CameraDirection$1.Front) {
                input.capture = 'user';
            }
            else if (options.direction === CameraDirection$1.Rear) {
                input.capture = 'environment';
            }
            input.addEventListener('change', function (_e) {
                var file = input.files[0];
                var format = 'jpeg';
                if (file.type === 'image/png') {
                    format = 'png';
                }
                else if (file.type === 'image/gif') {
                    format = 'gif';
                }
                if (options.resultType === CameraResultType$1.DataUrl || options.resultType === CameraResultType$1.Base64) {
                    var reader_1 = new FileReader();
                    reader_1.addEventListener('load', function () {
                        if (options.resultType === CameraResultType$1.DataUrl) {
                            resolve({
                                dataUrl: reader_1.result,
                                format: format
                            });
                        }
                        else if (options.resultType === CameraResultType$1.Base64) {
                            var b64 = reader_1.result.split(',')[1];
                            resolve({
                                base64String: b64,
                                format: format
                            });
                        }
                        cleanup();
                    });
                    reader_1.readAsDataURL(file);
                }
                else {
                    resolve({
                        webPath: URL.createObjectURL(file),
                        format: format
                    });
                    cleanup();
                }
            });
            input.click();
        };
        CameraPluginWeb.prototype._getCameraPhoto = function (photo, options) {
            return new Promise(function (resolve, reject) {
                var reader = new FileReader();
                var format = photo.type.split('/')[1];
                if (options.resultType === CameraResultType$1.Uri) {
                    resolve({
                        webPath: URL.createObjectURL(photo),
                        format: format
                    });
                }
                else {
                    reader.readAsDataURL(photo);
                    reader.onloadend = function () {
                        var r = reader.result;
                        if (options.resultType === CameraResultType$1.DataUrl) {
                            resolve({
                                dataUrl: r,
                                format: format
                            });
                        }
                        else {
                            resolve({
                                base64String: r.split(',')[1],
                                format: format
                            });
                        }
                    };
                    reader.onerror = function (e) {
                        reject(e);
                    };
                }
            });
        };
        return CameraPluginWeb;
    }(WebPlugin$1));
    new CameraPluginWeb$1();

    var ClipboardPluginWeb$1 = /** @class */ (function (_super) {
        __extends$1(ClipboardPluginWeb, _super);
        function ClipboardPluginWeb() {
            return _super.call(this, {
                name: 'Clipboard',
                platforms: ['web']
            }) || this;
        }
        ClipboardPluginWeb.prototype.write = function (options) {
            return __awaiter$2(this, void 0, void 0, function () {
                var blob, clipboardItemInput;
                var _a;
                return __generator$1(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (!navigator.clipboard) {
                                return [2 /*return*/, Promise.reject('Clipboard API not available in this browser')];
                            }
                            if (!(options.string !== undefined || options.url)) return [3 /*break*/, 2];
                            if (!navigator.clipboard.writeText) {
                                return [2 /*return*/, Promise.reject('Writting to clipboard not supported in this browser')];
                            }
                            return [4 /*yield*/, navigator.clipboard.writeText(options.string !== undefined ? options.string : options.url)];
                        case 1:
                            _b.sent();
                            return [3 /*break*/, 10];
                        case 2:
                            if (!options.image) return [3 /*break*/, 9];
                            if (!navigator.clipboard.write) {
                                return [2 /*return*/, Promise.reject('Setting images not supported in this browser')];
                            }
                            _b.label = 3;
                        case 3:
                            _b.trys.push([3, 7, , 8]);
                            return [4 /*yield*/, fetch(options.image)];
                        case 4: return [4 /*yield*/, (_b.sent()).blob()];
                        case 5:
                            blob = _b.sent();
                            clipboardItemInput = new ClipboardItem((_a = {}, _a[blob.type] = blob, _a));
                            return [4 /*yield*/, navigator.clipboard.write([clipboardItemInput])];
                        case 6:
                            _b.sent();
                            return [3 /*break*/, 8];
                        case 7:
                            _b.sent();
                            return [2 /*return*/, Promise.reject('Failed to write image')];
                        case 8: return [3 /*break*/, 10];
                        case 9: return [2 /*return*/, Promise.reject('Nothing to write')];
                        case 10: return [2 /*return*/, Promise.resolve()];
                    }
                });
            });
        };
        ClipboardPluginWeb.prototype.read = function () {
            return __awaiter$2(this, void 0, void 0, function () {
                var clipboardItems, type, clipboardBlob, data;
                return __generator$1(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!navigator.clipboard) {
                                return [2 /*return*/, Promise.reject('Clipboard API not available in this browser')];
                            }
                            if (!!navigator.clipboard.read) return [3 /*break*/, 1];
                            if (!navigator.clipboard.readText) {
                                return [2 /*return*/, Promise.reject('Reading from clipboard not supported in this browser')];
                            }
                            return [2 /*return*/, this.readText()];
                        case 1:
                            _a.trys.push([1, 5, , 6]);
                            return [4 /*yield*/, navigator.clipboard.read()];
                        case 2:
                            clipboardItems = _a.sent();
                            type = clipboardItems[0].types[0];
                            return [4 /*yield*/, clipboardItems[0].getType(type)];
                        case 3:
                            clipboardBlob = _a.sent();
                            return [4 /*yield*/, this._getBlobData(clipboardBlob, type)];
                        case 4:
                            data = _a.sent();
                            return [2 /*return*/, Promise.resolve({ value: data, type: type })];
                        case 5:
                            _a.sent();
                            return [2 /*return*/, this.readText()];
                        case 6: return [2 /*return*/];
                    }
                });
            });
        };
        ClipboardPluginWeb.prototype.readText = function () {
            return __awaiter$2(this, void 0, void 0, function () {
                var text;
                return __generator$1(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, navigator.clipboard.readText()];
                        case 1:
                            text = _a.sent();
                            return [2 /*return*/, Promise.resolve({ value: text, type: 'text/plain' })];
                    }
                });
            });
        };
        ClipboardPluginWeb.prototype._getBlobData = function (clipboardBlob, type) {
            return new Promise(function (resolve, reject) {
                var reader = new FileReader();
                if (type.includes('image')) {
                    reader.readAsDataURL(clipboardBlob);
                }
                else {
                    reader.readAsText(clipboardBlob);
                }
                reader.onloadend = function () {
                    var r = reader.result;
                    resolve(r);
                };
                reader.onerror = function (e) {
                    reject(e);
                };
            });
        };
        return ClipboardPluginWeb;
    }(WebPlugin$1));
    new ClipboardPluginWeb$1();

    var FilesystemPluginWeb$1 = /** @class */ (function (_super) {
        __extends$1(FilesystemPluginWeb, _super);
        function FilesystemPluginWeb() {
            var _this = _super.call(this, {
                name: 'Filesystem',
                platforms: ['web']
            }) || this;
            _this.DEFAULT_DIRECTORY = FilesystemDirectory$1.Data;
            _this.DB_VERSION = 1;
            _this.DB_NAME = 'Disc';
            _this._writeCmds = ['add', 'put', 'delete'];
            return _this;
        }
        FilesystemPluginWeb.prototype.initDb = function () {
            return __awaiter$2(this, void 0, void 0, function () {
                var _this = this;
                return __generator$1(this, function (_a) {
                    if (this._db !== undefined) {
                        return [2 /*return*/, this._db];
                    }
                    if (!('indexedDB' in window)) {
                        throw new Error('This browser doesn\'t support IndexedDB');
                    }
                    return [2 /*return*/, new Promise(function (resolve, reject) {
                            var request = indexedDB.open(_this.DB_NAME, _this.DB_VERSION);
                            request.onupgradeneeded = FilesystemPluginWeb.doUpgrade;
                            request.onsuccess = function () {
                                _this._db = request.result;
                                resolve(request.result);
                            };
                            request.onerror = function () { return reject(request.error); };
                            request.onblocked = function () {
                                console.warn('db blocked');
                            };
                        })];
                });
            });
        };
        FilesystemPluginWeb.doUpgrade = function (event) {
            var eventTarget = event.target;
            var db = eventTarget.result;
            switch (event.oldVersion) {
                case 0:
                case 1:
                default:
                    if (db.objectStoreNames.contains('FileStorage')) {
                        db.deleteObjectStore('FileStorage');
                    }
                    var store = db.createObjectStore('FileStorage', { keyPath: 'path' });
                    store.createIndex('by_folder', 'folder');
            }
        };
        FilesystemPluginWeb.prototype.dbRequest = function (cmd, args) {
            return __awaiter$2(this, void 0, void 0, function () {
                var readFlag;
                return __generator$1(this, function (_a) {
                    readFlag = this._writeCmds.indexOf(cmd) !== -1 ? 'readwrite' : 'readonly';
                    return [2 /*return*/, this.initDb()
                            .then(function (conn) {
                            return new Promise(function (resolve, reject) {
                                var tx = conn.transaction(['FileStorage'], readFlag);
                                var store = tx.objectStore('FileStorage');
                                var req = store[cmd].apply(store, args);
                                req.onsuccess = function () { return resolve(req.result); };
                                req.onerror = function () { return reject(req.error); };
                            });
                        })];
                });
            });
        };
        FilesystemPluginWeb.prototype.dbIndexRequest = function (indexName, cmd, args) {
            return __awaiter$2(this, void 0, void 0, function () {
                var readFlag;
                return __generator$1(this, function (_a) {
                    readFlag = this._writeCmds.indexOf(cmd) !== -1 ? 'readwrite' : 'readonly';
                    return [2 /*return*/, this.initDb()
                            .then(function (conn) {
                            return new Promise(function (resolve, reject) {
                                var tx = conn.transaction(['FileStorage'], readFlag);
                                var store = tx.objectStore('FileStorage');
                                var index = store.index(indexName);
                                var req = index[cmd].apply(index, args);
                                req.onsuccess = function () { return resolve(req.result); };
                                req.onerror = function () { return reject(req.error); };
                            });
                        })];
                });
            });
        };
        FilesystemPluginWeb.prototype.getPath = function (directory, uriPath) {
            directory = directory || this.DEFAULT_DIRECTORY;
            var cleanedUriPath = uriPath !== undefined ? uriPath.replace(/^[/]+|[/]+$/g, '') : '';
            var fsPath = '/' + directory;
            if (uriPath !== '')
                fsPath += '/' + cleanedUriPath;
            return fsPath;
        };
        FilesystemPluginWeb.prototype.clear = function () {
            return __awaiter$2(this, void 0, void 0, function () {
                var conn, tx, store;
                return __generator$1(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.initDb()];
                        case 1:
                            conn = _a.sent();
                            tx = conn.transaction(['FileStorage'], 'readwrite');
                            store = tx.objectStore('FileStorage');
                            store.clear();
                            return [2 /*return*/, {}];
                    }
                });
            });
        };
        /**
         * Read a file from disk
         * @param options options for the file read
         * @return a promise that resolves with the read file data result
         */
        FilesystemPluginWeb.prototype.readFile = function (options) {
            return __awaiter$2(this, void 0, void 0, function () {
                var path, entry;
                return __generator$1(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            path = this.getPath(options.directory, options.path);
                            return [4 /*yield*/, this.dbRequest('get', [path])];
                        case 1:
                            entry = _a.sent();
                            if (entry === undefined)
                                throw Error('File does not exist.');
                            return [2 /*return*/, { data: entry.content }];
                    }
                });
            });
        };
        /**
         * Write a file to disk in the specified location on device
         * @param options options for the file write
         * @return a promise that resolves with the file write result
         */
        FilesystemPluginWeb.prototype.writeFile = function (options) {
            return __awaiter$2(this, void 0, void 0, function () {
                var path, data, doRecursive, occupiedEntry, encoding, parentPath, parentEntry, subDirIndex, parentArgPath, now, pathObj;
                return __generator$1(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            path = this.getPath(options.directory, options.path);
                            data = options.data;
                            doRecursive = options.recursive;
                            return [4 /*yield*/, this.dbRequest('get', [path])];
                        case 1:
                            occupiedEntry = _a.sent();
                            if (occupiedEntry && occupiedEntry.type === 'directory')
                                throw ('The supplied path is a directory.');
                            encoding = options.encoding;
                            parentPath = path.substr(0, path.lastIndexOf('/'));
                            return [4 /*yield*/, this.dbRequest('get', [parentPath])];
                        case 2:
                            parentEntry = _a.sent();
                            if (!(parentEntry === undefined)) return [3 /*break*/, 4];
                            subDirIndex = parentPath.indexOf('/', 1);
                            if (!(subDirIndex !== -1)) return [3 /*break*/, 4];
                            parentArgPath = parentPath.substr(subDirIndex);
                            return [4 /*yield*/, this.mkdir({ path: parentArgPath, directory: options.directory, recursive: doRecursive })];
                        case 3:
                            _a.sent();
                            _a.label = 4;
                        case 4:
                            now = Date.now();
                            pathObj = {
                                path: path,
                                folder: parentPath,
                                type: 'file',
                                size: data.length,
                                ctime: now,
                                mtime: now,
                                content: !encoding && data.indexOf(',') >= 0 ? data.split(',')[1] : data,
                            };
                            return [4 /*yield*/, this.dbRequest('put', [pathObj])];
                        case 5:
                            _a.sent();
                            return [2 /*return*/, {
                                    uri: pathObj.path
                                }];
                    }
                });
            });
        };
        /**
         * Append to a file on disk in the specified location on device
         * @param options options for the file append
         * @return a promise that resolves with the file write result
         */
        FilesystemPluginWeb.prototype.appendFile = function (options) {
            return __awaiter$2(this, void 0, void 0, function () {
                var path, data, parentPath, now, ctime, occupiedEntry, parentEntry, subDirIndex, parentArgPath, pathObj;
                return __generator$1(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            path = this.getPath(options.directory, options.path);
                            data = options.data;
                            parentPath = path.substr(0, path.lastIndexOf('/'));
                            now = Date.now();
                            ctime = now;
                            return [4 /*yield*/, this.dbRequest('get', [path])];
                        case 1:
                            occupiedEntry = _a.sent();
                            if (occupiedEntry && occupiedEntry.type === 'directory')
                                throw ('The supplied path is a directory.');
                            return [4 /*yield*/, this.dbRequest('get', [parentPath])];
                        case 2:
                            parentEntry = _a.sent();
                            if (!(parentEntry === undefined)) return [3 /*break*/, 4];
                            subDirIndex = parentPath.indexOf('/', 1);
                            if (!(subDirIndex !== -1)) return [3 /*break*/, 4];
                            parentArgPath = parentPath.substr(subDirIndex);
                            return [4 /*yield*/, this.mkdir({ path: parentArgPath, directory: options.directory, recursive: true })];
                        case 3:
                            _a.sent();
                            _a.label = 4;
                        case 4:
                            if (occupiedEntry !== undefined) {
                                data = occupiedEntry.content + data;
                                ctime = occupiedEntry.ctime;
                            }
                            pathObj = {
                                path: path,
                                folder: parentPath,
                                type: 'file',
                                size: data.length,
                                ctime: ctime,
                                mtime: now,
                                content: data
                            };
                            return [4 /*yield*/, this.dbRequest('put', [pathObj])];
                        case 5:
                            _a.sent();
                            return [2 /*return*/, {}];
                    }
                });
            });
        };
        /**
         * Delete a file from disk
         * @param options options for the file delete
         * @return a promise that resolves with the deleted file data result
         */
        FilesystemPluginWeb.prototype.deleteFile = function (options) {
            return __awaiter$2(this, void 0, void 0, function () {
                var path, entry, entries;
                return __generator$1(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            path = this.getPath(options.directory, options.path);
                            return [4 /*yield*/, this.dbRequest('get', [path])];
                        case 1:
                            entry = _a.sent();
                            if (entry === undefined)
                                throw Error('File does not exist.');
                            return [4 /*yield*/, this.dbIndexRequest('by_folder', 'getAllKeys', [IDBKeyRange.only(path)])];
                        case 2:
                            entries = _a.sent();
                            if (entries.length !== 0)
                                throw Error('Folder is not empty.');
                            return [4 /*yield*/, this.dbRequest('delete', [path])];
                        case 3:
                            _a.sent();
                            return [2 /*return*/, {}];
                    }
                });
            });
        };
        /**
         * Create a directory.
         * @param options options for the mkdir
         * @return a promise that resolves with the mkdir result
         */
        FilesystemPluginWeb.prototype.mkdir = function (options) {
            return __awaiter$2(this, void 0, void 0, function () {
                var path, doRecursive, parentPath, depth, parentEntry, occupiedEntry, parentArgPath, now, pathObj;
                return __generator$1(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            path = this.getPath(options.directory, options.path);
                            doRecursive = options.recursive;
                            parentPath = path.substr(0, path.lastIndexOf('/'));
                            depth = (path.match(/\//g) || []).length;
                            return [4 /*yield*/, this.dbRequest('get', [parentPath])];
                        case 1:
                            parentEntry = _a.sent();
                            return [4 /*yield*/, this.dbRequest('get', [path])];
                        case 2:
                            occupiedEntry = _a.sent();
                            if (depth === 1)
                                throw Error('Cannot create Root directory');
                            if (occupiedEntry !== undefined)
                                throw Error('Current directory does already exist.');
                            if (!doRecursive && depth !== 2 && parentEntry === undefined)
                                throw Error('Parent directory must exist');
                            if (!(doRecursive && depth !== 2 && parentEntry === undefined)) return [3 /*break*/, 4];
                            parentArgPath = parentPath.substr(parentPath.indexOf('/', 1));
                            return [4 /*yield*/, this.mkdir({
                                    path: parentArgPath,
                                    directory: options.directory,
                                    recursive: doRecursive
                                })];
                        case 3:
                            _a.sent();
                            _a.label = 4;
                        case 4:
                            now = Date.now();
                            pathObj = { path: path, folder: parentPath, type: 'directory', size: 0, ctime: now, mtime: now };
                            return [4 /*yield*/, this.dbRequest('put', [pathObj])];
                        case 5:
                            _a.sent();
                            return [2 /*return*/, {}];
                    }
                });
            });
        };
        /**
         * Remove a directory
         * @param options the options for the directory remove
         */
        FilesystemPluginWeb.prototype.rmdir = function (options) {
            return __awaiter$2(this, void 0, void 0, function () {
                var path, directory, recursive, fullPath, entry, readDirResult, _i, _a, entry_1, entryPath, entryObj;
                return __generator$1(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            path = options.path, directory = options.directory, recursive = options.recursive;
                            fullPath = this.getPath(directory, path);
                            return [4 /*yield*/, this.dbRequest('get', [fullPath])];
                        case 1:
                            entry = _b.sent();
                            if (entry === undefined)
                                throw Error('Folder does not exist.');
                            if (entry.type !== 'directory')
                                throw Error('Requested path is not a directory');
                            return [4 /*yield*/, this.readdir({ path: path, directory: directory })];
                        case 2:
                            readDirResult = _b.sent();
                            if (readDirResult.files.length !== 0 && !recursive)
                                throw Error('Folder is not empty');
                            _i = 0, _a = readDirResult.files;
                            _b.label = 3;
                        case 3:
                            if (!(_i < _a.length)) return [3 /*break*/, 9];
                            entry_1 = _a[_i];
                            entryPath = path + "/" + entry_1;
                            return [4 /*yield*/, this.stat({ path: entryPath, directory: directory })];
                        case 4:
                            entryObj = _b.sent();
                            if (!(entryObj.type === 'file')) return [3 /*break*/, 6];
                            return [4 /*yield*/, this.deleteFile({ path: entryPath, directory: directory })];
                        case 5:
                            _b.sent();
                            return [3 /*break*/, 8];
                        case 6: return [4 /*yield*/, this.rmdir({ path: entryPath, directory: directory, recursive: recursive })];
                        case 7:
                            _b.sent();
                            _b.label = 8;
                        case 8:
                            _i++;
                            return [3 /*break*/, 3];
                        case 9: return [4 /*yield*/, this.dbRequest('delete', [fullPath])];
                        case 10:
                            _b.sent();
                            return [2 /*return*/, {}];
                    }
                });
            });
        };
        /**
         * Return a list of files from the directory (not recursive)
         * @param options the options for the readdir operation
         * @return a promise that resolves with the readdir directory listing result
         */
        FilesystemPluginWeb.prototype.readdir = function (options) {
            return __awaiter$2(this, void 0, void 0, function () {
                var path, entry, entries, names;
                return __generator$1(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            path = this.getPath(options.directory, options.path);
                            return [4 /*yield*/, this.dbRequest('get', [path])];
                        case 1:
                            entry = _a.sent();
                            if (options.path !== '' && entry === undefined)
                                throw Error('Folder does not exist.');
                            return [4 /*yield*/, this.dbIndexRequest('by_folder', 'getAllKeys', [IDBKeyRange.only(path)])];
                        case 2:
                            entries = _a.sent();
                            names = entries.map(function (e) {
                                return e.substring(path.length + 1);
                            });
                            return [2 /*return*/, { files: names }];
                    }
                });
            });
        };
        /**
         * Return full File URI for a path and directory
         * @param options the options for the stat operation
         * @return a promise that resolves with the file stat result
         */
        FilesystemPluginWeb.prototype.getUri = function (options) {
            return __awaiter$2(this, void 0, void 0, function () {
                var path, entry;
                return __generator$1(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            path = this.getPath(options.directory, options.path);
                            return [4 /*yield*/, this.dbRequest('get', [path])];
                        case 1:
                            entry = _a.sent();
                            if (!(entry === undefined)) return [3 /*break*/, 3];
                            return [4 /*yield*/, this.dbRequest('get', [path + '/'])];
                        case 2:
                            entry = (_a.sent());
                            _a.label = 3;
                        case 3:
                            if (entry === undefined)
                                throw Error('Entry does not exist.');
                            return [2 /*return*/, {
                                    uri: entry.path
                                }];
                    }
                });
            });
        };
        /**
         * Return data about a file
         * @param options the options for the stat operation
         * @return a promise that resolves with the file stat result
         */
        FilesystemPluginWeb.prototype.stat = function (options) {
            return __awaiter$2(this, void 0, void 0, function () {
                var path, entry;
                return __generator$1(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            path = this.getPath(options.directory, options.path);
                            return [4 /*yield*/, this.dbRequest('get', [path])];
                        case 1:
                            entry = _a.sent();
                            if (!(entry === undefined)) return [3 /*break*/, 3];
                            return [4 /*yield*/, this.dbRequest('get', [path + '/'])];
                        case 2:
                            entry = (_a.sent());
                            _a.label = 3;
                        case 3:
                            if (entry === undefined)
                                throw Error('Entry does not exist.');
                            return [2 /*return*/, {
                                    type: entry.type,
                                    size: entry.size,
                                    ctime: entry.ctime,
                                    mtime: entry.mtime,
                                    uri: entry.path
                                }];
                    }
                });
            });
        };
        /**
         * Rename a file or directory
         * @param options the options for the rename operation
         * @return a promise that resolves with the rename result
         */
        FilesystemPluginWeb.prototype.rename = function (options) {
            return __awaiter$2(this, void 0, void 0, function () {
                return __generator$1(this, function (_a) {
                    return [2 /*return*/, this._copy(options, true)];
                });
            });
        };
        /**
         * Copy a file or directory
         * @param options the options for the copy operation
         * @return a promise that resolves with the copy result
         */
        FilesystemPluginWeb.prototype.copy = function (options) {
            return __awaiter$2(this, void 0, void 0, function () {
                return __generator$1(this, function (_a) {
                    return [2 /*return*/, this._copy(options, false)];
                });
            });
        };
        /**
         * Function that can perform a copy or a rename
         * @param options the options for the rename operation
         * @param doRename whether to perform a rename or copy operation
         * @return a promise that resolves with the result
         */
        FilesystemPluginWeb.prototype._copy = function (options, doRename) {
            if (doRename === void 0) { doRename = false; }
            return __awaiter$2(this, void 0, void 0, function () {
                var to, from, fromDirectory, toDirectory, fromPath, toPath, toObj, toPathComponents, toPath_1, toParentDirectory, fromObj, updateTime, _a, file, contents, _i, contents_1, filename;
                var _this = this;
                return __generator$1(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            to = options.to, from = options.from, fromDirectory = options.directory, toDirectory = options.toDirectory;
                            if (!to || !from) {
                                throw Error('Both to and from must be provided');
                            }
                            // If no "to" directory is provided, use the "from" directory
                            if (!toDirectory) {
                                toDirectory = fromDirectory;
                            }
                            fromPath = this.getPath(fromDirectory, from);
                            toPath = this.getPath(toDirectory, to);
                            // Test that the "to" and "from" locations are different
                            if (fromPath === toPath) {
                                return [2 /*return*/, {}];
                            }
                            if (toPath.startsWith(fromPath)) {
                                throw Error('To path cannot contain the from path');
                            }
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 3, , 6]);
                            return [4 /*yield*/, this.stat({
                                    path: to,
                                    directory: toDirectory
                                })];
                        case 2:
                            toObj = _b.sent();
                            return [3 /*break*/, 6];
                        case 3:
                            _b.sent();
                            toPathComponents = to.split('/');
                            toPathComponents.pop();
                            toPath_1 = toPathComponents.join('/');
                            if (!(toPathComponents.length > 0)) return [3 /*break*/, 5];
                            return [4 /*yield*/, this.stat({
                                    path: toPath_1,
                                    directory: toDirectory,
                                })];
                        case 4:
                            toParentDirectory = _b.sent();
                            if (toParentDirectory.type !== 'directory') {
                                throw new Error('Parent directory of the to path is a file');
                            }
                            _b.label = 5;
                        case 5: return [3 /*break*/, 6];
                        case 6:
                            // Cannot overwrite a directory
                            if (toObj && toObj.type === 'directory') {
                                throw new Error('Cannot overwrite a directory with a file');
                            }
                            return [4 /*yield*/, this.stat({
                                    path: from,
                                    directory: fromDirectory,
                                })];
                        case 7:
                            fromObj = _b.sent();
                            updateTime = function (path, ctime, mtime) { return __awaiter$2(_this, void 0, void 0, function () {
                                var fullPath, entry;
                                return __generator$1(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            fullPath = this.getPath(toDirectory, path);
                                            return [4 /*yield*/, this.dbRequest('get', [fullPath])];
                                        case 1:
                                            entry = _a.sent();
                                            entry.ctime = ctime;
                                            entry.mtime = mtime;
                                            return [4 /*yield*/, this.dbRequest('put', [entry])];
                                        case 2:
                                            _a.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            }); };
                            _a = fromObj.type;
                            switch (_a) {
                                case 'file': return [3 /*break*/, 8];
                                case 'directory': return [3 /*break*/, 15];
                            }
                            return [3 /*break*/, 28];
                        case 8: return [4 /*yield*/, this.readFile({
                                path: from,
                                directory: fromDirectory
                            })];
                        case 9:
                            file = _b.sent();
                            if (!doRename) return [3 /*break*/, 11];
                            return [4 /*yield*/, this.deleteFile({
                                    path: from,
                                    directory: fromDirectory
                                })];
                        case 10:
                            _b.sent();
                            _b.label = 11;
                        case 11: 
                        // Write the file to the new location
                        return [4 /*yield*/, this.writeFile({
                                path: to,
                                directory: toDirectory,
                                data: file.data
                            })];
                        case 12:
                            // Write the file to the new location
                            _b.sent();
                            if (!doRename) return [3 /*break*/, 14];
                            return [4 /*yield*/, updateTime(to, fromObj.ctime, fromObj.mtime)];
                        case 13:
                            _b.sent();
                            _b.label = 14;
                        case 14: 
                        // Resolve promise
                        return [2 /*return*/, {}];
                        case 15:
                            if (toObj) {
                                throw Error('Cannot move a directory over an existing object');
                            }
                            _b.label = 16;
                        case 16:
                            _b.trys.push([16, 20, , 21]);
                            // Create the to directory
                            return [4 /*yield*/, this.mkdir({
                                    path: to,
                                    directory: toDirectory,
                                    recursive: false,
                                })];
                        case 17:
                            // Create the to directory
                            _b.sent();
                            if (!doRename) return [3 /*break*/, 19];
                            return [4 /*yield*/, updateTime(to, fromObj.ctime, fromObj.mtime)];
                        case 18:
                            _b.sent();
                            _b.label = 19;
                        case 19: return [3 /*break*/, 21];
                        case 20:
                            _b.sent();
                            return [3 /*break*/, 21];
                        case 21: return [4 /*yield*/, this.readdir({
                                path: from,
                                directory: fromDirectory,
                            })];
                        case 22:
                            contents = (_b.sent()).files;
                            _i = 0, contents_1 = contents;
                            _b.label = 23;
                        case 23:
                            if (!(_i < contents_1.length)) return [3 /*break*/, 26];
                            filename = contents_1[_i];
                            // Move item from the from directory to the to directory
                            return [4 /*yield*/, this._copy({
                                    from: from + "/" + filename,
                                    to: to + "/" + filename,
                                    directory: fromDirectory,
                                    toDirectory: toDirectory,
                                }, doRename)];
                        case 24:
                            // Move item from the from directory to the to directory
                            _b.sent();
                            _b.label = 25;
                        case 25:
                            _i++;
                            return [3 /*break*/, 23];
                        case 26:
                            if (!doRename) return [3 /*break*/, 28];
                            return [4 /*yield*/, this.rmdir({
                                    path: from,
                                    directory: fromDirectory
                                })];
                        case 27:
                            _b.sent();
                            _b.label = 28;
                        case 28: return [2 /*return*/, {}];
                    }
                });
            });
        };
        FilesystemPluginWeb._debug = true;
        return FilesystemPluginWeb;
    }(WebPlugin$1));
    new FilesystemPluginWeb$1();

    var extend$1 = function (target) {
        var objs = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            objs[_i - 1] = arguments[_i];
        }
        objs.forEach(function (o) {
            if (o && typeof (o) === 'object') {
                for (var k in o) {
                    if (o.hasOwnProperty(k)) {
                        target[k] = o[k];
                    }
                }
            }
        });
        return target;
    };
    var uuid4$1 = function () {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    };

    var GeolocationPluginWeb$1 = /** @class */ (function (_super) {
        __extends$1(GeolocationPluginWeb, _super);
        function GeolocationPluginWeb() {
            return _super.call(this, {
                name: 'Geolocation',
                platforms: ['web']
            }) || this;
        }
        GeolocationPluginWeb.prototype.getCurrentPosition = function (options) {
            var _this = this;
            return new Promise(function (resolve, reject) {
                return _this.requestPermissions().then(function (_result) {
                    window.navigator.geolocation.getCurrentPosition(function (pos) {
                        resolve(pos);
                    }, function (err) {
                        reject(err);
                    }, extend$1({
                        enableHighAccuracy: true,
                        timeout: 10000,
                        maximumAge: 0
                    }, options));
                });
            });
        };
        GeolocationPluginWeb.prototype.watchPosition = function (options, callback) {
            var id = window.navigator.geolocation.watchPosition(function (pos) {
                callback(pos);
            }, function (err) {
                callback(null, err);
            }, extend$1({
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }, options));
            return "" + id;
        };
        GeolocationPluginWeb.prototype.clearWatch = function (options) {
            window.navigator.geolocation.clearWatch(parseInt(options.id, 10));
            return Promise.resolve();
        };
        return GeolocationPluginWeb;
    }(WebPlugin$1));
    new GeolocationPluginWeb$1();

    var DevicePluginWeb$1 = /** @class */ (function (_super) {
        __extends$1(DevicePluginWeb, _super);
        function DevicePluginWeb() {
            return _super.call(this, {
                name: 'Device',
                platforms: ['web']
            }) || this;
        }
        DevicePluginWeb.prototype.getInfo = function () {
            return __awaiter$2(this, void 0, void 0, function () {
                var ua, uaFields;
                return __generator$1(this, function (_a) {
                    ua = navigator.userAgent;
                    uaFields = this.parseUa(ua);
                    return [2 /*return*/, Promise.resolve({
                            model: uaFields.model,
                            platform: 'web',
                            appVersion: '',
                            appBuild: '',
                            appId: '',
                            appName: '',
                            operatingSystem: uaFields.operatingSystem,
                            osVersion: uaFields.osVersion,
                            manufacturer: navigator.vendor,
                            isVirtual: false,
                            uuid: this.getUid()
                        })];
                });
            });
        };
        DevicePluginWeb.prototype.getBatteryInfo = function () {
            return __awaiter$2(this, void 0, void 0, function () {
                var battery;
                return __generator$1(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            battery = {};
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, navigator.getBattery()];
                        case 2:
                            battery = _a.sent();
                            return [3 /*break*/, 4];
                        case 3:
                            _a.sent();
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/, Promise.resolve({
                                batteryLevel: battery.level,
                                isCharging: battery.charging
                            })];
                    }
                });
            });
        };
        DevicePluginWeb.prototype.getLanguageCode = function () {
            return __awaiter$2(this, void 0, void 0, function () {
                return __generator$1(this, function (_a) {
                    return [2 /*return*/, {
                            value: navigator.language
                        }];
                });
            });
        };
        DevicePluginWeb.prototype.parseUa = function (_ua) {
            var uaFields = {};
            var start = _ua.indexOf('(') + 1;
            var end = _ua.indexOf(') AppleWebKit');
            if (_ua.indexOf(') Gecko') !== -1) {
                end = _ua.indexOf(') Gecko');
            }
            var fields = _ua.substring(start, end);
            if (_ua.indexOf('Android') !== -1) {
                uaFields.model = fields.replace('; wv', '').split('; ').pop().split(' Build')[0];
                uaFields.osVersion = fields.split('; ')[1];
            }
            else {
                uaFields.model = fields.split('; ')[0];
                if (navigator.oscpu) {
                    uaFields.osVersion = navigator.oscpu;
                }
                else {
                    if (_ua.indexOf('Windows') !== -1) {
                        uaFields.osVersion = fields;
                    }
                    else {
                        var lastParts = fields.split('; ').pop().replace(' like Mac OS X', '').split(' ');
                        uaFields.osVersion = lastParts[lastParts.length - 1].replace(/_/g, '.');
                    }
                }
            }
            if (/android/i.test(_ua)) {
                uaFields.operatingSystem = 'android';
            }
            else if (/iPad|iPhone|iPod/.test(_ua) && !window.MSStream) {
                uaFields.operatingSystem = 'ios';
            }
            else if (/Win/.test(_ua)) {
                uaFields.operatingSystem = 'windows';
            }
            else if (/Mac/i.test(_ua)) {
                uaFields.operatingSystem = 'mac';
            }
            else {
                uaFields.operatingSystem = 'unknown';
            }
            return uaFields;
        };
        DevicePluginWeb.prototype.getUid = function () {
            var uid = window.localStorage.getItem('_capuid');
            if (uid) {
                return uid;
            }
            uid = uuid4$1();
            window.localStorage.setItem('_capuid', uid);
            return uid;
        };
        return DevicePluginWeb;
    }(WebPlugin$1));
    new DevicePluginWeb$1();

    var LocalNotificationsPluginWeb$1 = /** @class */ (function (_super) {
        __extends$1(LocalNotificationsPluginWeb, _super);
        function LocalNotificationsPluginWeb() {
            var _this = _super.call(this, {
                name: 'LocalNotifications',
                platforms: ['web']
            }) || this;
            _this.pending = [];
            return _this;
        }
        LocalNotificationsPluginWeb.prototype.createChannel = function (channel) {
            throw new Error('Feature not available in the browser. ' + channel.id);
        };
        LocalNotificationsPluginWeb.prototype.deleteChannel = function (channel) {
            throw new Error('Feature not available in the browser. ' + channel.id);
        };
        LocalNotificationsPluginWeb.prototype.listChannels = function () {
            throw new Error('Feature not available in the browser');
        };
        LocalNotificationsPluginWeb.prototype.sendPending = function () {
            var _this = this;
            var toRemove = [];
            var now = +new Date;
            this.pending.forEach(function (localNotification) {
                if (localNotification.schedule && localNotification.schedule.at) {
                    if (+localNotification.schedule.at <= now) {
                        _this.buildNotification(localNotification);
                        toRemove.push(localNotification);
                    }
                }
            });
            console.log('Sent pending, removing', toRemove);
            this.pending = this.pending.filter(function (localNotification) { return !toRemove.find(function (ln) { return ln === localNotification; }); });
        };
        LocalNotificationsPluginWeb.prototype.sendNotification = function (localNotification) {
            var _this = this;
            var l = localNotification;
            if (localNotification.schedule && localNotification.schedule.at) {
                var diff = +localNotification.schedule.at - +new Date;
                this.pending.push(l);
                setTimeout(function () {
                    _this.sendPending();
                }, diff);
                return;
            }
            this.buildNotification(localNotification);
        };
        LocalNotificationsPluginWeb.prototype.buildNotification = function (localNotification) {
            var l = localNotification;
            return new Notification(l.title, {
                body: l.body
            });
        };
        LocalNotificationsPluginWeb.prototype.schedule = function (options) {
            var _this = this;
            var notifications = [];
            options.notifications.forEach(function (notification) {
                notifications.push(_this.sendNotification(notification));
            });
            return Promise.resolve({
                notifications: options.notifications.map(function (notification) { return { id: '' + notification.id }; })
            });
        };
        LocalNotificationsPluginWeb.prototype.getPending = function () {
            return Promise.resolve({
                notifications: this.pending.map(function (localNotification) {
                    return {
                        id: '' + localNotification.id
                    };
                })
            });
        };
        LocalNotificationsPluginWeb.prototype.registerActionTypes = function (_options) {
            throw new Error('Method not implemented.');
        };
        LocalNotificationsPluginWeb.prototype.cancel = function (pending) {
            console.log('Cancel these', pending);
            this.pending = this.pending.filter(function (localNotification) { return !pending.notifications.find(function (ln) { return ln.id === '' + localNotification.id; }); });
            return Promise.resolve();
        };
        LocalNotificationsPluginWeb.prototype.areEnabled = function () {
            return Promise.resolve({
                value: Notification.permission === 'granted'
            });
        };
        LocalNotificationsPluginWeb.prototype.requestPermission = function () {
            return new Promise(function (resolve) {
                Notification.requestPermission(function (result) {
                    var granted = true;
                    if (result === 'denied' || result === 'default') {
                        granted = false;
                    }
                    resolve({ granted: granted });
                });
            });
        };
        LocalNotificationsPluginWeb.prototype.requestPermissions = function () {
            return new Promise(function (resolve, reject) {
                Notification.requestPermission(function (result) {
                    if (result === 'denied' || result === 'default') {
                        reject(result);
                        return;
                    }
                    resolve({
                        results: [result]
                    });
                });
            });
        };
        return LocalNotificationsPluginWeb;
    }(WebPlugin$1));
    new LocalNotificationsPluginWeb$1();

    var SharePluginWeb$1 = /** @class */ (function (_super) {
        __extends$1(SharePluginWeb, _super);
        function SharePluginWeb() {
            return _super.call(this, {
                name: 'Share',
                platforms: ['web']
            }) || this;
        }
        SharePluginWeb.prototype.share = function (options) {
            if (!navigator.share) {
                return Promise.reject('Web Share API not available');
            }
            return navigator.share({
                title: options.title,
                text: options.text,
                url: options.url
            });
        };
        return SharePluginWeb;
    }(WebPlugin$1));
    new SharePluginWeb$1();

    var ModalsPluginWeb$1 = /** @class */ (function (_super) {
        __extends$1(ModalsPluginWeb, _super);
        function ModalsPluginWeb() {
            return _super.call(this, {
                name: 'Modals',
                platforms: ['web']
            }) || this;
        }
        ModalsPluginWeb.prototype.alert = function (options) {
            return __awaiter$2(this, void 0, void 0, function () {
                return __generator$1(this, function (_a) {
                    window.alert(options.message);
                    return [2 /*return*/, Promise.resolve()];
                });
            });
        };
        ModalsPluginWeb.prototype.prompt = function (options) {
            return __awaiter$2(this, void 0, void 0, function () {
                var val;
                return __generator$1(this, function (_a) {
                    val = window.prompt(options.message, options.inputText || '');
                    return [2 /*return*/, Promise.resolve({
                            value: val,
                            cancelled: val === null
                        })];
                });
            });
        };
        ModalsPluginWeb.prototype.confirm = function (options) {
            return __awaiter$2(this, void 0, void 0, function () {
                var val;
                return __generator$1(this, function (_a) {
                    val = window.confirm(options.message);
                    return [2 /*return*/, Promise.resolve({
                            value: val
                        })];
                });
            });
        };
        ModalsPluginWeb.prototype.showActions = function (options) {
            return __awaiter$2(this, void 0, void 0, function () {
                var _this = this;
                return __generator$1(this, function (_a) {
                    return [2 /*return*/, new Promise(function (resolve, _reject) { return __awaiter$2(_this, void 0, void 0, function () {
                            var actionSheet;
                            var _this = this;
                            return __generator$1(this, function (_a) {
                                actionSheet = document.querySelector('pwa-action-sheet');
                                if (!actionSheet) {
                                    actionSheet = document.createElement('pwa-action-sheet');
                                    document.body.appendChild(actionSheet);
                                }
                                actionSheet.header = options.title;
                                actionSheet.cancelable = false;
                                actionSheet.options = options.options;
                                actionSheet.addEventListener('onSelection', function (e) { return __awaiter$2(_this, void 0, void 0, function () {
                                    var selection;
                                    return __generator$1(this, function (_a) {
                                        selection = e.detail;
                                        resolve({
                                            index: selection
                                        });
                                        return [2 /*return*/];
                                    });
                                }); });
                                return [2 /*return*/];
                            });
                        }); })];
                });
            });
        };
        return ModalsPluginWeb;
    }(WebPlugin$1));
    new ModalsPluginWeb$1();

    var MotionPluginWeb$1 = /** @class */ (function (_super) {
        __extends$1(MotionPluginWeb, _super);
        function MotionPluginWeb() {
            var _this = _super.call(this, {
                name: 'Motion'
            }) || this;
            _this.registerWindowListener('devicemotion', 'accel');
            _this.registerWindowListener('deviceorientation', 'orientation');
            return _this;
        }
        return MotionPluginWeb;
    }(WebPlugin$1));
    new MotionPluginWeb$1();

    var NetworkPluginWeb$1 = /** @class */ (function (_super) {
        __extends$1(NetworkPluginWeb, _super);
        function NetworkPluginWeb() {
            var _this = _super.call(this, {
                name: 'Network',
                platforms: ['web']
            }) || this;
            _this.listenerFunction = null;
            return _this;
        }
        NetworkPluginWeb.prototype.getStatus = function () {
            return new Promise(function (resolve, reject) {
                if (!window.navigator) {
                    reject('Network info not available');
                    return;
                }
                var connected = window.navigator.onLine;
                var connection = window.navigator.connection || window.navigator.mozConnection || window.navigator.webkitConnection;
                var connectionType = connection ? (connection.type || connection.effectiveType) : 'wifi';
                resolve({
                    connected: connected,
                    connectionType: connected ? connectionType : 'none'
                });
            });
        };
        NetworkPluginWeb.prototype.addListener = function (eventName, listenerFunc) {
            var thisRef = this;
            var connection = window.navigator.connection || window.navigator.mozConnection || window.navigator.webkitConnection;
            var connectionType = connection ? (connection.type || connection.effectiveType) : 'wifi';
            var onlineBindFunc = listenerFunc.bind(thisRef, { connected: true, connectionType: connectionType });
            var offlineBindFunc = listenerFunc.bind(thisRef, { connected: false, connectionType: 'none' });
            if (eventName.localeCompare('networkStatusChange') === 0) {
                window.addEventListener('online', onlineBindFunc);
                window.addEventListener('offline', offlineBindFunc);
                return {
                    remove: function () {
                        window.removeEventListener('online', onlineBindFunc);
                        window.removeEventListener('offline', offlineBindFunc);
                    }
                };
            }
        };
        return NetworkPluginWeb;
    }(WebPlugin$1));
    new NetworkPluginWeb$1();

    var PermissionsPluginWeb$1 = /** @class */ (function (_super) {
        __extends$1(PermissionsPluginWeb, _super);
        function PermissionsPluginWeb() {
            return _super.call(this, {
                name: 'Permissions'
            }) || this;
        }
        PermissionsPluginWeb.prototype.query = function (options) {
            return __awaiter$2(this, void 0, void 0, function () {
                var navigator, name, ret;
                return __generator$1(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            navigator = window.navigator;
                            if (!navigator.permissions) {
                                return [2 /*return*/, Promise.reject('This browser does not support the Permissions API')];
                            }
                            name = options.name === PermissionType$1.Photos ? 'camera' : options.name;
                            return [4 /*yield*/, navigator.permissions.query({ name: name })];
                        case 1:
                            ret = _a.sent();
                            return [2 /*return*/, {
                                    state: ret.state
                                }];
                    }
                });
            });
        };
        return PermissionsPluginWeb;
    }(WebPlugin$1));
    new PermissionsPluginWeb$1();

    var SplashScreenPluginWeb$1 = /** @class */ (function (_super) {
        __extends$1(SplashScreenPluginWeb, _super);
        function SplashScreenPluginWeb() {
            return _super.call(this, {
                name: 'SplashScreen',
                platforms: ['web']
            }) || this;
        }
        SplashScreenPluginWeb.prototype.show = function (_options, _callback) {
            return Promise.resolve();
        };
        SplashScreenPluginWeb.prototype.hide = function (_options, _callback) {
            return Promise.resolve();
        };
        return SplashScreenPluginWeb;
    }(WebPlugin$1));
    new SplashScreenPluginWeb$1();

    var StoragePluginWeb$1 = /** @class */ (function (_super) {
        __extends$1(StoragePluginWeb, _super);
        function StoragePluginWeb() {
            var _this = _super.call(this, {
                name: 'Storage',
                platforms: ['web']
            }) || this;
            _this.KEY_PREFIX = '_cap_';
            return _this;
        }
        StoragePluginWeb.prototype.get = function (options) {
            var _this = this;
            return new Promise(function (resolve, _reject) {
                resolve({
                    value: window.localStorage.getItem(_this.makeKey(options.key))
                });
            });
        };
        StoragePluginWeb.prototype.set = function (options) {
            var _this = this;
            return new Promise(function (resolve, _reject) {
                window.localStorage.setItem(_this.makeKey(options.key), options.value);
                resolve();
            });
        };
        StoragePluginWeb.prototype.remove = function (options) {
            var _this = this;
            return new Promise(function (resolve, _reject) {
                window.localStorage.removeItem(_this.makeKey(options.key));
                resolve();
            });
        };
        StoragePluginWeb.prototype.keys = function () {
            var _this = this;
            return new Promise(function (resolve, _reject) {
                resolve({
                    keys: Object.keys(localStorage).filter(function (k) { return _this.isKey(k); }).map(function (k) { return _this.getKey(k); })
                });
            });
        };
        StoragePluginWeb.prototype.clear = function () {
            var _this = this;
            return new Promise(function (resolve, _reject) {
                Object.keys(localStorage)
                    .filter(function (k) { return _this.isKey(k); })
                    .forEach(function (k) { return window.localStorage.removeItem(k); });
                resolve();
            });
        };
        StoragePluginWeb.prototype.makeKey = function (key) {
            return this.KEY_PREFIX + key;
        };
        StoragePluginWeb.prototype.isKey = function (key) {
            return key.indexOf(this.KEY_PREFIX) === 0;
        };
        StoragePluginWeb.prototype.getKey = function (key) {
            return key.substr(this.KEY_PREFIX.length);
        };
        return StoragePluginWeb;
    }(WebPlugin$1));
    new StoragePluginWeb$1();

    var ToastPluginWeb$1 = /** @class */ (function (_super) {
        __extends$1(ToastPluginWeb, _super);
        function ToastPluginWeb() {
            return _super.call(this, {
                name: 'Toast',
                platforms: ['web']
            }) || this;
        }
        ToastPluginWeb.prototype.show = function (options) {
            return __awaiter$2(this, void 0, void 0, function () {
                var duration, toast;
                return __generator$1(this, function (_a) {
                    duration = 2000;
                    if (options.duration) {
                        duration = options.duration === 'long' ? 3500 : 2000;
                    }
                    toast = document.createElement('pwa-toast');
                    toast.duration = duration;
                    toast.message = options.text;
                    document.body.appendChild(toast);
                    return [2 /*return*/];
                });
            });
        };
        return ToastPluginWeb;
    }(WebPlugin$1));
    new ToastPluginWeb$1();

    mergeWebPlugins$1(Plugins$1);

    function noop() { }
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function get_store_value(store) {
        let value;
        subscribe(store, _ => value = _)();
        return value;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot(slot, slot_definition, ctx, $$scope, dirty, get_slot_changes_fn, get_slot_context_fn) {
        const slot_changes = get_slot_changes(slot_definition, $$scope, dirty, get_slot_changes_fn);
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function compute_slots(slots) {
        const result = {};
        for (const key in slots) {
            result[key] = true;
        }
        return result;
    }
    function null_to_empty(value) {
        return value == null ? '' : value;
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_data(text, data) {
        data = '' + data;
        if (text.wholeText !== data)
            text.data = data;
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function onDestroy(fn) {
        get_current_component().$$.on_destroy.push(fn);
    }
    function setContext(key, context) {
        get_current_component().$$.context.set(key, context);
    }
    function getContext(key) {
        return get_current_component().$$.context.get(key);
    }
    // TODO figure out if we still want to support
    // shorthand events, or if we want to implement
    // a real bubbling mechanism
    function bubble(component, event) {
        const callbacks = component.$$.callbacks[event.type];
        if (callbacks) {
            callbacks.slice().forEach(fn => fn(event));
        }
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

    function getDefaultExportFromCjs (x) {
    	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
    }

    function createCommonjsModule(fn) {
      var module = { exports: {} };
    	return fn(module, module.exports), module.exports;
    }

    /*!
     * EventEmitter v5.2.9 - git.io/ee
     * Unlicense - http://unlicense.org/
     * Oliver Caldwell - https://oli.me.uk/
     * @preserve
     */

    var EventEmitter = createCommonjsModule(function (module) {
    (function (exports) {

        /**
         * Class for managing events.
         * Can be extended to provide event functionality in other classes.
         *
         * @class EventEmitter Manages event registering and emitting.
         */
        function EventEmitter() {}

        // Shortcuts to improve speed and size
        var proto = EventEmitter.prototype;
        var originalGlobalValue = exports.EventEmitter;

        /**
         * Finds the index of the listener for the event in its storage array.
         *
         * @param {Function[]} listeners Array of listeners to search through.
         * @param {Function} listener Method to look for.
         * @return {Number} Index of the specified listener, -1 if not found
         * @api private
         */
        function indexOfListener(listeners, listener) {
            var i = listeners.length;
            while (i--) {
                if (listeners[i].listener === listener) {
                    return i;
                }
            }

            return -1;
        }

        /**
         * Alias a method while keeping the context correct, to allow for overwriting of target method.
         *
         * @param {String} name The name of the target method.
         * @return {Function} The aliased method
         * @api private
         */
        function alias(name) {
            return function aliasClosure() {
                return this[name].apply(this, arguments);
            };
        }

        /**
         * Returns the listener array for the specified event.
         * Will initialise the event object and listener arrays if required.
         * Will return an object if you use a regex search. The object contains keys for each matched event. So /ba[rz]/ might return an object containing bar and baz. But only if you have either defined them with defineEvent or added some listeners to them.
         * Each property in the object response is an array of listener functions.
         *
         * @param {String|RegExp} evt Name of the event to return the listeners from.
         * @return {Function[]|Object} All listener functions for the event.
         */
        proto.getListeners = function getListeners(evt) {
            var events = this._getEvents();
            var response;
            var key;

            // Return a concatenated array of all matching events if
            // the selector is a regular expression.
            if (evt instanceof RegExp) {
                response = {};
                for (key in events) {
                    if (events.hasOwnProperty(key) && evt.test(key)) {
                        response[key] = events[key];
                    }
                }
            }
            else {
                response = events[evt] || (events[evt] = []);
            }

            return response;
        };

        /**
         * Takes a list of listener objects and flattens it into a list of listener functions.
         *
         * @param {Object[]} listeners Raw listener objects.
         * @return {Function[]} Just the listener functions.
         */
        proto.flattenListeners = function flattenListeners(listeners) {
            var flatListeners = [];
            var i;

            for (i = 0; i < listeners.length; i += 1) {
                flatListeners.push(listeners[i].listener);
            }

            return flatListeners;
        };

        /**
         * Fetches the requested listeners via getListeners but will always return the results inside an object. This is mainly for internal use but others may find it useful.
         *
         * @param {String|RegExp} evt Name of the event to return the listeners from.
         * @return {Object} All listener functions for an event in an object.
         */
        proto.getListenersAsObject = function getListenersAsObject(evt) {
            var listeners = this.getListeners(evt);
            var response;

            if (listeners instanceof Array) {
                response = {};
                response[evt] = listeners;
            }

            return response || listeners;
        };

        function isValidListener (listener) {
            if (typeof listener === 'function' || listener instanceof RegExp) {
                return true
            } else if (listener && typeof listener === 'object') {
                return isValidListener(listener.listener)
            } else {
                return false
            }
        }

        /**
         * Adds a listener function to the specified event.
         * The listener will not be added if it is a duplicate.
         * If the listener returns true then it will be removed after it is called.
         * If you pass a regular expression as the event name then the listener will be added to all events that match it.
         *
         * @param {String|RegExp} evt Name of the event to attach the listener to.
         * @param {Function} listener Method to be called when the event is emitted. If the function returns true then it will be removed after calling.
         * @return {Object} Current instance of EventEmitter for chaining.
         */
        proto.addListener = function addListener(evt, listener) {
            if (!isValidListener(listener)) {
                throw new TypeError('listener must be a function');
            }

            var listeners = this.getListenersAsObject(evt);
            var listenerIsWrapped = typeof listener === 'object';
            var key;

            for (key in listeners) {
                if (listeners.hasOwnProperty(key) && indexOfListener(listeners[key], listener) === -1) {
                    listeners[key].push(listenerIsWrapped ? listener : {
                        listener: listener,
                        once: false
                    });
                }
            }

            return this;
        };

        /**
         * Alias of addListener
         */
        proto.on = alias('addListener');

        /**
         * Semi-alias of addListener. It will add a listener that will be
         * automatically removed after its first execution.
         *
         * @param {String|RegExp} evt Name of the event to attach the listener to.
         * @param {Function} listener Method to be called when the event is emitted. If the function returns true then it will be removed after calling.
         * @return {Object} Current instance of EventEmitter for chaining.
         */
        proto.addOnceListener = function addOnceListener(evt, listener) {
            return this.addListener(evt, {
                listener: listener,
                once: true
            });
        };

        /**
         * Alias of addOnceListener.
         */
        proto.once = alias('addOnceListener');

        /**
         * Defines an event name. This is required if you want to use a regex to add a listener to multiple events at once. If you don't do this then how do you expect it to know what event to add to? Should it just add to every possible match for a regex? No. That is scary and bad.
         * You need to tell it what event names should be matched by a regex.
         *
         * @param {String} evt Name of the event to create.
         * @return {Object} Current instance of EventEmitter for chaining.
         */
        proto.defineEvent = function defineEvent(evt) {
            this.getListeners(evt);
            return this;
        };

        /**
         * Uses defineEvent to define multiple events.
         *
         * @param {String[]} evts An array of event names to define.
         * @return {Object} Current instance of EventEmitter for chaining.
         */
        proto.defineEvents = function defineEvents(evts) {
            for (var i = 0; i < evts.length; i += 1) {
                this.defineEvent(evts[i]);
            }
            return this;
        };

        /**
         * Removes a listener function from the specified event.
         * When passed a regular expression as the event name, it will remove the listener from all events that match it.
         *
         * @param {String|RegExp} evt Name of the event to remove the listener from.
         * @param {Function} listener Method to remove from the event.
         * @return {Object} Current instance of EventEmitter for chaining.
         */
        proto.removeListener = function removeListener(evt, listener) {
            var listeners = this.getListenersAsObject(evt);
            var index;
            var key;

            for (key in listeners) {
                if (listeners.hasOwnProperty(key)) {
                    index = indexOfListener(listeners[key], listener);

                    if (index !== -1) {
                        listeners[key].splice(index, 1);
                    }
                }
            }

            return this;
        };

        /**
         * Alias of removeListener
         */
        proto.off = alias('removeListener');

        /**
         * Adds listeners in bulk using the manipulateListeners method.
         * If you pass an object as the first argument you can add to multiple events at once. The object should contain key value pairs of events and listeners or listener arrays. You can also pass it an event name and an array of listeners to be added.
         * You can also pass it a regular expression to add the array of listeners to all events that match it.
         * Yeah, this function does quite a bit. That's probably a bad thing.
         *
         * @param {String|Object|RegExp} evt An event name if you will pass an array of listeners next. An object if you wish to add to multiple events at once.
         * @param {Function[]} [listeners] An optional array of listener functions to add.
         * @return {Object} Current instance of EventEmitter for chaining.
         */
        proto.addListeners = function addListeners(evt, listeners) {
            // Pass through to manipulateListeners
            return this.manipulateListeners(false, evt, listeners);
        };

        /**
         * Removes listeners in bulk using the manipulateListeners method.
         * If you pass an object as the first argument you can remove from multiple events at once. The object should contain key value pairs of events and listeners or listener arrays.
         * You can also pass it an event name and an array of listeners to be removed.
         * You can also pass it a regular expression to remove the listeners from all events that match it.
         *
         * @param {String|Object|RegExp} evt An event name if you will pass an array of listeners next. An object if you wish to remove from multiple events at once.
         * @param {Function[]} [listeners] An optional array of listener functions to remove.
         * @return {Object} Current instance of EventEmitter for chaining.
         */
        proto.removeListeners = function removeListeners(evt, listeners) {
            // Pass through to manipulateListeners
            return this.manipulateListeners(true, evt, listeners);
        };

        /**
         * Edits listeners in bulk. The addListeners and removeListeners methods both use this to do their job. You should really use those instead, this is a little lower level.
         * The first argument will determine if the listeners are removed (true) or added (false).
         * If you pass an object as the second argument you can add/remove from multiple events at once. The object should contain key value pairs of events and listeners or listener arrays.
         * You can also pass it an event name and an array of listeners to be added/removed.
         * You can also pass it a regular expression to manipulate the listeners of all events that match it.
         *
         * @param {Boolean} remove True if you want to remove listeners, false if you want to add.
         * @param {String|Object|RegExp} evt An event name if you will pass an array of listeners next. An object if you wish to add/remove from multiple events at once.
         * @param {Function[]} [listeners] An optional array of listener functions to add/remove.
         * @return {Object} Current instance of EventEmitter for chaining.
         */
        proto.manipulateListeners = function manipulateListeners(remove, evt, listeners) {
            var i;
            var value;
            var single = remove ? this.removeListener : this.addListener;
            var multiple = remove ? this.removeListeners : this.addListeners;

            // If evt is an object then pass each of its properties to this method
            if (typeof evt === 'object' && !(evt instanceof RegExp)) {
                for (i in evt) {
                    if (evt.hasOwnProperty(i) && (value = evt[i])) {
                        // Pass the single listener straight through to the singular method
                        if (typeof value === 'function') {
                            single.call(this, i, value);
                        }
                        else {
                            // Otherwise pass back to the multiple function
                            multiple.call(this, i, value);
                        }
                    }
                }
            }
            else {
                // So evt must be a string
                // And listeners must be an array of listeners
                // Loop over it and pass each one to the multiple method
                i = listeners.length;
                while (i--) {
                    single.call(this, evt, listeners[i]);
                }
            }

            return this;
        };

        /**
         * Removes all listeners from a specified event.
         * If you do not specify an event then all listeners will be removed.
         * That means every event will be emptied.
         * You can also pass a regex to remove all events that match it.
         *
         * @param {String|RegExp} [evt] Optional name of the event to remove all listeners for. Will remove from every event if not passed.
         * @return {Object} Current instance of EventEmitter for chaining.
         */
        proto.removeEvent = function removeEvent(evt) {
            var type = typeof evt;
            var events = this._getEvents();
            var key;

            // Remove different things depending on the state of evt
            if (type === 'string') {
                // Remove all listeners for the specified event
                delete events[evt];
            }
            else if (evt instanceof RegExp) {
                // Remove all events matching the regex.
                for (key in events) {
                    if (events.hasOwnProperty(key) && evt.test(key)) {
                        delete events[key];
                    }
                }
            }
            else {
                // Remove all listeners in all events
                delete this._events;
            }

            return this;
        };

        /**
         * Alias of removeEvent.
         *
         * Added to mirror the node API.
         */
        proto.removeAllListeners = alias('removeEvent');

        /**
         * Emits an event of your choice.
         * When emitted, every listener attached to that event will be executed.
         * If you pass the optional argument array then those arguments will be passed to every listener upon execution.
         * Because it uses `apply`, your array of arguments will be passed as if you wrote them out separately.
         * So they will not arrive within the array on the other side, they will be separate.
         * You can also pass a regular expression to emit to all events that match it.
         *
         * @param {String|RegExp} evt Name of the event to emit and execute listeners for.
         * @param {Array} [args] Optional array of arguments to be passed to each listener.
         * @return {Object} Current instance of EventEmitter for chaining.
         */
        proto.emitEvent = function emitEvent(evt, args) {
            var listenersMap = this.getListenersAsObject(evt);
            var listeners;
            var listener;
            var i;
            var key;
            var response;

            for (key in listenersMap) {
                if (listenersMap.hasOwnProperty(key)) {
                    listeners = listenersMap[key].slice(0);

                    for (i = 0; i < listeners.length; i++) {
                        // If the listener returns true then it shall be removed from the event
                        // The function is executed either with a basic call or an apply if there is an args array
                        listener = listeners[i];

                        if (listener.once === true) {
                            this.removeListener(evt, listener.listener);
                        }

                        response = listener.listener.apply(this, args || []);

                        if (response === this._getOnceReturnValue()) {
                            this.removeListener(evt, listener.listener);
                        }
                    }
                }
            }

            return this;
        };

        /**
         * Alias of emitEvent
         */
        proto.trigger = alias('emitEvent');

        /**
         * Subtly different from emitEvent in that it will pass its arguments on to the listeners, as opposed to taking a single array of arguments to pass on.
         * As with emitEvent, you can pass a regex in place of the event name to emit to all events that match it.
         *
         * @param {String|RegExp} evt Name of the event to emit and execute listeners for.
         * @param {...*} Optional additional arguments to be passed to each listener.
         * @return {Object} Current instance of EventEmitter for chaining.
         */
        proto.emit = function emit(evt) {
            var args = Array.prototype.slice.call(arguments, 1);
            return this.emitEvent(evt, args);
        };

        /**
         * Sets the current value to check against when executing listeners. If a
         * listeners return value matches the one set here then it will be removed
         * after execution. This value defaults to true.
         *
         * @param {*} value The new value to check for when executing listeners.
         * @return {Object} Current instance of EventEmitter for chaining.
         */
        proto.setOnceReturnValue = function setOnceReturnValue(value) {
            this._onceReturnValue = value;
            return this;
        };

        /**
         * Fetches the current value to check against when executing listeners. If
         * the listeners return value matches this one then it should be removed
         * automatically. It will return true by default.
         *
         * @return {*|Boolean} The current value to check for or the default, true.
         * @api private
         */
        proto._getOnceReturnValue = function _getOnceReturnValue() {
            if (this.hasOwnProperty('_onceReturnValue')) {
                return this._onceReturnValue;
            }
            else {
                return true;
            }
        };

        /**
         * Fetches the events object and creates one if required.
         *
         * @return {Object} The events storage object.
         * @api private
         */
        proto._getEvents = function _getEvents() {
            return this._events || (this._events = {});
        };

        /**
         * Reverts the global {@link EventEmitter} to its previous value and returns a reference to this version.
         *
         * @return {Function} Non conflicting EventEmitter class.
         */
        EventEmitter.noConflict = function noConflict() {
            exports.EventEmitter = originalGlobalValue;
            return EventEmitter;
        };

        // Expose the class either via AMD, CommonJS or the global object
        if (module.exports){
            module.exports = EventEmitter;
        }
        else {
            exports.EventEmitter = EventEmitter;
        }
    }(typeof window !== 'undefined' ? window : commonjsGlobal || {}));
    });

    var _createClass$2 = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

    function _classCallCheck$2(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

    var Queue = function () {

        /*
        *   As the name implies, `consumer` is the (sole) consumer of the queue.
        *   It gets called with each element of the queue and its return value
        *   serves as a ack, determining whether the element is removed or not from
        *   the queue, allowing then subsequent elements to be processed.
        */

        function Queue(consumer) {
            _classCallCheck$2(this, Queue);

            this.consumer = consumer;
            this.paused = false;
            this.queue = [];
        }

        _createClass$2(Queue, [{
            key: "pause",
            value: function pause() {
                this.paused = true;
            }
        }, {
            key: "continue",
            value: function _continue() {
                this.paused = false;
                this.process();
            }
        }, {
            key: "push",
            value: function push(element) {
                this.queue.push(element);
                this.process();
            }
        }, {
            key: "unshift",
            value: function unshift(element) {
                this.queue.unshift(element);
                this.process();
            }
        }, {
            key: "process",
            value: function process(opts) {
                if (!this.paused && this.queue.length !== 0) {
                    var ack = this.consumer(this.queue[0]);
                    if (ack) {
                        this.queue.shift();
                        if (!this.paused) this.process();
                    }
                }
            }
        }, {
            key: "empty",
            value: function empty() {
                this.queue = [];
            }
        }]);

        return Queue;
    }();

    var _default$2 = Queue;

    var queue = /*#__PURE__*/Object.defineProperty({
    	default: _default$2
    }, '__esModule', {value: true});

    var ejson = createCommonjsModule(function (module) {
    module.exports =
    /******/ (function() { // webpackBootstrap
    /******/ 	var __webpack_modules__ = ([
    /* 0 */
    /***/ (function(__unused_webpack_module, exports, __webpack_require__) {

    /* provided dependency */ var Base64 = __webpack_require__(2)["Base64"];
    /* provided dependency */ var Meteor = __webpack_require__(3);


    Object.defineProperty(exports, "__esModule", ({
      value: true
    }));
    exports.EJSON = void 0;

    var _utils = __webpack_require__(1);

    /**
     * @namespace
     * @summary Namespace for EJSON functions
     */
    var EJSON = {}; // Custom type interface definition

    /**
     * @class CustomType
     * @instanceName customType
     * @memberOf EJSON
     * @summary The interface that a class must satisfy to be able to become an
     * EJSON custom type via EJSON.addType.
     */

    /**
     * @function typeName
     * @memberOf EJSON.CustomType
     * @summary Return the tag used to identify this type.  This must match the
     *          tag used to register this type with
     *          [`EJSON.addType`](#ejson_add_type).
     * @locus Anywhere
     * @instance
     */

    /**
     * @function toJSONValue
     * @memberOf EJSON.CustomType
     * @summary Serialize this instance into a JSON-compatible value.
     * @locus Anywhere
     * @instance
     */

    /**
     * @function clone
     * @memberOf EJSON.CustomType
     * @summary Return a value `r` such that `this.equals(r)` is true, and
     *          modifications to `r` do not affect `this` and vice versa.
     * @locus Anywhere
     * @instance
     */

    /**
     * @function equals
     * @memberOf EJSON.CustomType
     * @summary Return `true` if `other` has a value equal to `this`; `false`
     *          otherwise.
     * @locus Anywhere
     * @param {Object} other Another object to compare this to.
     * @instance
     */

    exports.EJSON = EJSON;
    var customTypes = new Map(); // Add a custom type, using a method of your choice to get to and
    // from a basic JSON-able representation.  The factory argument
    // is a function of JSON-able --> your object
    // The type you add must have:
    // - A toJSONValue() method, so that Meteor can serialize it
    // - a typeName() method, to show how to look it up in our type table.
    // It is okay if these methods are monkey-patched on.
    // EJSON.clone will use toJSONValue and the given factory to produce
    // a clone, but you may specify a method clone() that will be
    // used instead.
    // Similarly, EJSON.equals will use toJSONValue to make comparisons,
    // but you may provide a method equals() instead.

    /**
     * @summary Add a custom datatype to EJSON.
     * @locus Anywhere
     * @param {String} name A tag for your custom type; must be unique among
     *                      custom data types defined in your project, and must
     *                      match the result of your type's `typeName` method.
     * @param {Function} factory A function that deserializes a JSON-compatible
     *                           value into an instance of your type.  This should
     *                           match the serialization performed by your
     *                           type's `toJSONValue` method.
     */

    EJSON.addType = function (name, factory) {
      if (customTypes.has(name)) {
        throw new Error("Type ".concat(name, " already present"));
      }

      customTypes.set(name, factory);
    };

    var builtinConverters = [{
      // Date
      matchJSONValue: function matchJSONValue(obj) {
        return (0, _utils.hasOwn)(obj, '$date') && (0, _utils.lengthOf)(obj) === 1;
      },
      matchObject: function matchObject(obj) {
        return obj instanceof Date;
      },
      toJSONValue: function toJSONValue(obj) {
        return {
          $date: obj.getTime()
        };
      },
      fromJSONValue: function fromJSONValue(obj) {
        return new Date(obj.$date);
      }
    }, {
      // RegExp
      matchJSONValue: function matchJSONValue(obj) {
        return (0, _utils.hasOwn)(obj, '$regexp') && (0, _utils.hasOwn)(obj, '$flags') && (0, _utils.lengthOf)(obj) === 2;
      },
      matchObject: function matchObject(obj) {
        return obj instanceof RegExp;
      },
      toJSONValue: function toJSONValue(regexp) {
        return {
          $regexp: regexp.source,
          $flags: regexp.flags
        };
      },
      fromJSONValue: function fromJSONValue(obj) {
        // Replaces duplicate / invalid flags.
        return new RegExp(obj.$regexp, obj.$flags // Cut off flags at 50 chars to avoid abusing RegExp for DOS.
        .slice(0, 50).replace(/[^gimuy]/g, '').replace(/(.)(?=.*\1)/g, ''));
      }
    }, {
      // NaN, Inf, -Inf. (These are the only objects with typeof !== 'object'
      // which we match.)
      matchJSONValue: function matchJSONValue(obj) {
        return (0, _utils.hasOwn)(obj, '$InfNaN') && (0, _utils.lengthOf)(obj) === 1;
      },
      matchObject: _utils.isInfOrNaN,
      toJSONValue: function toJSONValue(obj) {
        var sign;

        if (Number.isNaN(obj)) {
          sign = 0;
        } else if (obj === Infinity) {
          sign = 1;
        } else {
          sign = -1;
        }

        return {
          $InfNaN: sign
        };
      },
      fromJSONValue: function fromJSONValue(obj) {
        return obj.$InfNaN / 0;
      }
    }, {
      // Binary
      matchJSONValue: function matchJSONValue(obj) {
        return (0, _utils.hasOwn)(obj, '$binary') && (0, _utils.lengthOf)(obj) === 1;
      },
      matchObject: function matchObject(obj) {
        return typeof Uint8Array !== 'undefined' && obj instanceof Uint8Array || obj && (0, _utils.hasOwn)(obj, '$Uint8ArrayPolyfill');
      },
      toJSONValue: function toJSONValue(obj) {
        return {
          $binary: Base64.encode(obj)
        };
      },
      fromJSONValue: function fromJSONValue(obj) {
        return Base64.decode(obj.$binary);
      }
    }, {
      // Escaping one level
      matchJSONValue: function matchJSONValue(obj) {
        return (0, _utils.hasOwn)(obj, '$escape') && (0, _utils.lengthOf)(obj) === 1;
      },
      matchObject: function matchObject(obj) {
        var match = false;

        if (obj) {
          var keyCount = (0, _utils.lengthOf)(obj);

          if (keyCount === 1 || keyCount === 2) {
            match = builtinConverters.some(function (converter) {
              return converter.matchJSONValue(obj);
            });
          }
        }

        return match;
      },
      toJSONValue: function toJSONValue(obj) {
        var newObj = {};
        (0, _utils.keysOf)(obj).forEach(function (key) {
          newObj[key] = EJSON.toJSONValue(obj[key]);
        });
        return {
          $escape: newObj
        };
      },
      fromJSONValue: function fromJSONValue(obj) {
        var newObj = {};
        (0, _utils.keysOf)(obj.$escape).forEach(function (key) {
          newObj[key] = EJSON.fromJSONValue(obj.$escape[key]);
        });
        return newObj;
      }
    }, {
      // Custom
      matchJSONValue: function matchJSONValue(obj) {
        return (0, _utils.hasOwn)(obj, '$type') && (0, _utils.hasOwn)(obj, '$value') && (0, _utils.lengthOf)(obj) === 2;
      },
      matchObject: function matchObject(obj) {
        return EJSON._isCustomType(obj);
      },
      toJSONValue: function toJSONValue(obj) {
        var jsonValue = Meteor._noYieldsAllowed(function () {
          return obj.toJSONValue();
        });

        return {
          $type: obj.typeName(),
          $value: jsonValue
        };
      },
      fromJSONValue: function fromJSONValue(obj) {
        var typeName = obj.$type;

        if (!customTypes.has(typeName)) {
          throw new Error("Custom EJSON type ".concat(typeName, " is not defined"));
        }

        var converter = customTypes.get(typeName);
        return Meteor._noYieldsAllowed(function () {
          return converter(obj.$value);
        });
      }
    }];

    EJSON._isCustomType = function (obj) {
      return obj && (0, _utils.isFunction)(obj.toJSONValue) && (0, _utils.isFunction)(obj.typeName) && customTypes.has(obj.typeName());
    };

    EJSON._getTypes = function () {
      var isOriginal = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      return isOriginal ? customTypes : (0, _utils.convertMapToObject)(customTypes);
    };

    EJSON._getConverters = function () {
      return builtinConverters;
    }; // Either return the JSON-compatible version of the argument, or undefined (if
    // the item isn't itself replaceable, but maybe some fields in it are)


    var toJSONValueHelper = function toJSONValueHelper(item) {
      for (var i = 0; i < builtinConverters.length; i++) {
        var converter = builtinConverters[i];

        if (converter.matchObject(item)) {
          return converter.toJSONValue(item);
        }
      }

      return undefined;
    }; // for both arrays and objects, in-place modification.


    var adjustTypesToJSONValue = function adjustTypesToJSONValue(obj) {
      // Is it an atom that we need to adjust?
      if (obj === null) {
        return null;
      }

      var maybeChanged = toJSONValueHelper(obj);

      if (maybeChanged !== undefined) {
        return maybeChanged;
      } // Other atoms are unchanged.


      if (!(0, _utils.isObject)(obj)) {
        return obj;
      } // Iterate over array or object structure.


      (0, _utils.keysOf)(obj).forEach(function (key) {
        var value = obj[key];

        if (!(0, _utils.isObject)(value) && value !== undefined && !(0, _utils.isInfOrNaN)(value)) {
          return; // continue
        }

        var changed = toJSONValueHelper(value);

        if (changed) {
          obj[key] = changed;
          return; // on to the next key
        } // if we get here, value is an object but not adjustable
        // at this level.  recurse.


        adjustTypesToJSONValue(value);
      });
      return obj;
    };

    EJSON._adjustTypesToJSONValue = adjustTypesToJSONValue;
    /**
     * @summary Serialize an EJSON-compatible value into its plain JSON
     *          representation.
     * @locus Anywhere
     * @param {EJSON} val A value to serialize to plain JSON.
     */

    EJSON.toJSONValue = function (item) {
      var changed = toJSONValueHelper(item);

      if (changed !== undefined) {
        return changed;
      }

      var newItem = item;

      if ((0, _utils.isObject)(item)) {
        newItem = EJSON.clone(item);
        adjustTypesToJSONValue(newItem);
      }

      return newItem;
    }; // Either return the argument changed to have the non-json
    // rep of itself (the Object version) or the argument itself.
    // DOES NOT RECURSE.  For actually getting the fully-changed value, use
    // EJSON.fromJSONValue


    var fromJSONValueHelper = function fromJSONValueHelper(value) {
      if ((0, _utils.isObject)(value) && value !== null) {
        var keys = (0, _utils.keysOf)(value);

        if (keys.length <= 2 && keys.every(function (k) {
          return typeof k === 'string' && k.substr(0, 1) === '$';
        })) {
          for (var i = 0; i < builtinConverters.length; i++) {
            var converter = builtinConverters[i];

            if (converter.matchJSONValue(value)) {
              return converter.fromJSONValue(value);
            }
          }
        }
      }

      return value;
    }; // for both arrays and objects. Tries its best to just
    // use the object you hand it, but may return something
    // different if the object you hand it itself needs changing.


    var adjustTypesFromJSONValue = function adjustTypesFromJSONValue(obj) {
      if (obj === null) {
        return null;
      }

      var maybeChanged = fromJSONValueHelper(obj);

      if (maybeChanged !== obj) {
        return maybeChanged;
      } // Other atoms are unchanged.


      if (!(0, _utils.isObject)(obj)) {
        return obj;
      }

      (0, _utils.keysOf)(obj).forEach(function (key) {
        var value = obj[key];

        if ((0, _utils.isObject)(value)) {
          var changed = fromJSONValueHelper(value);

          if (value !== changed) {
            obj[key] = changed;
            return;
          } // if we get here, value is an object but not adjustable
          // at this level.  recurse.


          adjustTypesFromJSONValue(value);
        }
      });
      return obj;
    };

    EJSON._adjustTypesFromJSONValue = adjustTypesFromJSONValue;
    /**
     * @summary Deserialize an EJSON value from its plain JSON representation.
     * @locus Anywhere
     * @param {JSONCompatible} val A value to deserialize into EJSON.
     */

    EJSON.fromJSONValue = function (item) {
      var changed = fromJSONValueHelper(item);

      if (changed === item && (0, _utils.isObject)(item)) {
        changed = EJSON.clone(item);
        adjustTypesFromJSONValue(changed);
      }

      return changed;
    };
    /**
     * @summary Serialize a value to a string. For EJSON values, the serialization
     *          fully represents the value. For non-EJSON values, serializes the
     *          same way as `JSON.stringify`.
     * @locus Anywhere
     * @param {EJSON} val A value to stringify.
     * @param {Object} [options]
     * @param {Boolean | Integer | String} options.indent Indents objects and
     * arrays for easy readability.  When `true`, indents by 2 spaces; when an
     * integer, indents by that number of spaces; and when a string, uses the
     * string as the indentation pattern.
     * @param {Boolean} options.canonical When `true`, stringifies keys in an
     *                                    object in sorted order.
     */


    EJSON.stringify = (0, _utils.handleError)(function (item, options) {
      var serialized;
      var json = EJSON.toJSONValue(item);

      if (options && (options.canonical || options.indent)) {
        var canonicalStringify = __webpack_require__(4);

        serialized = canonicalStringify(json, options);
      } else {
        serialized = JSON.stringify(json);
      }

      return serialized;
    });
    /**
     * @summary Parse a string into an EJSON value. Throws an error if the string
     *          is not valid EJSON.
     * @locus Anywhere
     * @param {String} str A string to parse into an EJSON value.
     */

    EJSON.parse = function (item) {
      if (typeof item !== 'string') {
        throw new Error('EJSON.parse argument should be a string');
      }

      return EJSON.fromJSONValue(JSON.parse(item));
    };
    /**
     * @summary Returns true if `x` is a buffer of binary data, as returned from
     *          [`EJSON.newBinary`](#ejson_new_binary).
     * @param {Object} x The variable to check.
     * @locus Anywhere
     */


    EJSON.isBinary = function (obj) {
      return !!(typeof Uint8Array !== 'undefined' && obj instanceof Uint8Array || obj && obj.$Uint8ArrayPolyfill);
    };
    /**
     * @summary Return true if `a` and `b` are equal to each other.  Return false
     *          otherwise.  Uses the `equals` method on `a` if present, otherwise
     *          performs a deep comparison.
     * @locus Anywhere
     * @param {EJSON} a
     * @param {EJSON} b
     * @param {Object} [options]
     * @param {Boolean} options.keyOrderSensitive Compare in key sensitive order,
     * if supported by the JavaScript implementation.  For example, `{a: 1, b: 2}`
     * is equal to `{b: 2, a: 1}` only when `keyOrderSensitive` is `false`.  The
     * default is `false`.
     */


    EJSON.equals = function (a, b, options) {
      var i;
      var keyOrderSensitive = !!(options && options.keyOrderSensitive);

      if (a === b) {
        return true;
      } // This differs from the IEEE spec for NaN equality, b/c we don't want
      // anything ever with a NaN to be poisoned from becoming equal to anything.


      if (Number.isNaN(a) && Number.isNaN(b)) {
        return true;
      } // if either one is falsy, they'd have to be === to be equal


      if (!a || !b) {
        return false;
      }

      if (!((0, _utils.isObject)(a) && (0, _utils.isObject)(b))) {
        return false;
      }

      if (a instanceof Date && b instanceof Date) {
        return a.valueOf() === b.valueOf();
      }

      if (EJSON.isBinary(a) && EJSON.isBinary(b)) {
        if (a.length !== b.length) {
          return false;
        }

        for (i = 0; i < a.length; i++) {
          if (a[i] !== b[i]) {
            return false;
          }
        }

        return true;
      }

      if ((0, _utils.isFunction)(a.equals)) {
        return a.equals(b, options);
      }

      if ((0, _utils.isFunction)(b.equals)) {
        return b.equals(a, options);
      }

      if (a instanceof Array) {
        if (!(b instanceof Array)) {
          return false;
        }

        if (a.length !== b.length) {
          return false;
        }

        for (i = 0; i < a.length; i++) {
          if (!EJSON.equals(a[i], b[i], options)) {
            return false;
          }
        }

        return true;
      } // fallback for custom types that don't implement their own equals


      switch (EJSON._isCustomType(a) + EJSON._isCustomType(b)) {
        case 1:
          return false;

        case 2:
          return EJSON.equals(EJSON.toJSONValue(a), EJSON.toJSONValue(b));

      } // fall back to structural equality of objects


      var ret;
      var aKeys = (0, _utils.keysOf)(a);
      var bKeys = (0, _utils.keysOf)(b);

      if (keyOrderSensitive) {
        i = 0;
        ret = aKeys.every(function (key) {
          if (i >= bKeys.length) {
            return false;
          }

          if (key !== bKeys[i]) {
            return false;
          }

          if (!EJSON.equals(a[key], b[bKeys[i]], options)) {
            return false;
          }

          i++;
          return true;
        });
      } else {
        i = 0;
        ret = aKeys.every(function (key) {
          if (!(0, _utils.hasOwn)(b, key)) {
            return false;
          }

          if (!EJSON.equals(a[key], b[key], options)) {
            return false;
          }

          i++;
          return true;
        });
      }

      return ret && i === bKeys.length;
    };
    /**
     * @summary Return a deep copy of `val`.
     * @locus Anywhere
     * @param {EJSON} val A value to copy.
     */


    EJSON.clone = function (v) {
      var ret;

      if (!(0, _utils.isObject)(v)) {
        return v;
      }

      if (v === null) {
        return null; // null has typeof "object"
      }

      if (v instanceof Date) {
        return new Date(v.getTime());
      } // RegExps are not really EJSON elements (eg we don't define a serialization
      // for them), but they're immutable anyway, so we can support them in clone.


      if (v instanceof RegExp) {
        return v;
      }

      if (EJSON.isBinary(v)) {
        ret = EJSON.newBinary(v.length);

        for (var i = 0; i < v.length; i++) {
          ret[i] = v[i];
        }

        return ret;
      }

      if (Array.isArray(v)) {
        return v.map(EJSON.clone);
      }

      if ((0, _utils.isArguments)(v)) {
        return Array.from(v).map(EJSON.clone);
      } // handle general user-defined typed Objects if they have a clone method


      if ((0, _utils.isFunction)(v.clone)) {
        return v.clone();
      } // handle other custom types


      if (EJSON._isCustomType(v)) {
        return EJSON.fromJSONValue(EJSON.clone(EJSON.toJSONValue(v)), true);
      } // handle other objects


      ret = {};
      (0, _utils.keysOf)(v).forEach(function (key) {
        ret[key] = EJSON.clone(v[key]);
      });
      return ret;
    };
    /**
     * @summary Allocate a new buffer of binary data that EJSON can serialize.
     * @locus Anywhere
     * @param {Number} size The number of bytes of binary data to allocate.
     */
    // EJSON.newBinary is the public documented API for this functionality,
    // but the implementation is in the 'base64' package to avoid
    // introducing a circular dependency. (If the implementation were here,
    // then 'base64' would have to use EJSON.newBinary, and 'ejson' would
    // also have to use 'base64'.)


    EJSON.newBinary = Base64.newBinary;

    /***/ }),
    /* 1 */
    /***/ (function(__unused_webpack_module, exports) {



    Object.defineProperty(exports, "__esModule", ({
      value: true
    }));
    exports.handleError = exports.checkError = exports.isInfOrNaN = exports.isArguments = exports.convertMapToObject = exports.hasOwn = exports.lengthOf = exports.keysOf = exports.isObject = exports.isFunction = void 0;

    function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

    function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

    function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

    function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

    function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

    function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

    function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

    var isFunction = function isFunction(fn) {
      return typeof fn === 'function';
    };

    exports.isFunction = isFunction;

    var isObject = function isObject(fn) {
      return _typeof(fn) === 'object';
    };

    exports.isObject = isObject;

    var keysOf = function keysOf(obj) {
      return Object.keys(obj);
    };

    exports.keysOf = keysOf;

    var lengthOf = function lengthOf(obj) {
      return Object.keys(obj).length;
    };

    exports.lengthOf = lengthOf;

    var hasOwn = function hasOwn(obj, prop) {
      return Object.prototype.hasOwnProperty.call(obj, prop);
    };

    exports.hasOwn = hasOwn;

    var convertMapToObject = function convertMapToObject(map) {
      return Array.from(map).reduce(function (acc, _ref) {
        var _ref2 = _slicedToArray(_ref, 2),
            key = _ref2[0],
            value = _ref2[1];

        // reassign to not create new object
        acc[key] = value;
        return acc;
      }, {});
    };

    exports.convertMapToObject = convertMapToObject;

    var isArguments = function isArguments(obj) {
      return obj != null && hasOwn(obj, 'callee');
    };

    exports.isArguments = isArguments;

    var isInfOrNaN = function isInfOrNaN(obj) {
      return Number.isNaN(obj) || obj === Infinity || obj === -Infinity;
    };

    exports.isInfOrNaN = isInfOrNaN;
    var checkError = {
      maxStack: function maxStack(msgError) {
        return new RegExp('Maximum call stack size exceeded', 'g').test(msgError);
      }
    };
    exports.checkError = checkError;

    var handleError = function handleError(fn) {
      return function () {
        try {
          return fn.apply(this, arguments);
        } catch (error) {
          var isMaxStack = checkError.maxStack(error.message);

          if (isMaxStack) {
            throw new Error('Converting circular structure to JSON');
          }

          throw error;
        }
      };
    };

    exports.handleError = handleError;

    /***/ }),
    /* 2 */
    /***/ (function(__unused_webpack_module, exports) {



    Object.defineProperty(exports, "__esModule", ({
      value: true
    }));
    exports.Base64 = void 0;
    // Base 64 encoding
    var BASE_64_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    var BASE_64_VALS = Object.create(null);

    var getChar = function getChar(val) {
      return BASE_64_CHARS.charAt(val);
    };

    var getVal = function getVal(ch) {
      return ch === '=' ? -1 : BASE_64_VALS[ch];
    };

    for (var i = 0; i < BASE_64_CHARS.length; i++) {
      BASE_64_VALS[getChar(i)] = i;
    }

    var encode = function encode(array) {
      if (typeof array === "string") {
        var str = array;
        array = newBinary(str.length);

        for (var _i = 0; _i < str.length; _i++) {
          var ch = str.charCodeAt(_i);

          if (ch > 0xFF) {
            throw new Error("Not ascii. Base64.encode can only take ascii strings.");
          }

          array[_i] = ch;
        }
      }

      var answer = [];
      var a = null;
      var b = null;
      var c = null;
      var d = null;

      for (var _i2 = 0; _i2 < array.length; _i2++) {
        switch (_i2 % 3) {
          case 0:
            a = array[_i2] >> 2 & 0x3F;
            b = (array[_i2] & 0x03) << 4;
            break;

          case 1:
            b = b | array[_i2] >> 4 & 0xF;
            c = (array[_i2] & 0xF) << 2;
            break;

          case 2:
            c = c | array[_i2] >> 6 & 0x03;
            d = array[_i2] & 0x3F;
            answer.push(getChar(a));
            answer.push(getChar(b));
            answer.push(getChar(c));
            answer.push(getChar(d));
            a = null;
            b = null;
            c = null;
            d = null;
            break;
        }
      }

      if (a != null) {
        answer.push(getChar(a));
        answer.push(getChar(b));

        if (c == null) {
          answer.push('=');
        } else {
          answer.push(getChar(c));
        }

        if (d == null) {
          answer.push('=');
        }
      }

      return answer.join("");
    }; // XXX This is a weird place for this to live, but it's used both by
    // this package and 'ejson', and we can't put it in 'ejson' without
    // introducing a circular dependency. It should probably be in its own
    // package or as a helper in a package that both 'base64' and 'ejson'
    // use.


    var newBinary = function newBinary(len) {
      if (typeof Uint8Array === 'undefined' || typeof ArrayBuffer === 'undefined') {
        var ret = [];

        for (var _i3 = 0; _i3 < len; _i3++) {
          ret.push(0);
        }

        ret.$Uint8ArrayPolyfill = true;
        return ret;
      }

      return new Uint8Array(new ArrayBuffer(len));
    };

    var decode = function decode(str) {
      var len = Math.floor(str.length * 3 / 4);

      if (str.charAt(str.length - 1) == '=') {
        len--;

        if (str.charAt(str.length - 2) == '=') {
          len--;
        }
      }

      var arr = newBinary(len);
      var one = null;
      var two = null;
      var three = null;
      var j = 0;

      for (var _i4 = 0; _i4 < str.length; _i4++) {
        var c = str.charAt(_i4);
        var v = getVal(c);

        switch (_i4 % 4) {
          case 0:
            if (v < 0) {
              throw new Error('invalid base64 string');
            }

            one = v << 2;
            break;

          case 1:
            if (v < 0) {
              throw new Error('invalid base64 string');
            }

            one = one | v >> 4;
            arr[j++] = one;
            two = (v & 0x0F) << 4;
            break;

          case 2:
            if (v >= 0) {
              two = two | v >> 2;
              arr[j++] = two;
              three = (v & 0x03) << 6;
            }

            break;

          case 3:
            if (v >= 0) {
              arr[j++] = three | v;
            }

            break;
        }
      }

      return arr;
    };

    var Base64 = {
      encode: encode,
      decode: decode,
      newBinary: newBinary
    };
    exports.Base64 = Base64;

    /***/ }),
    /* 3 */
    /***/ (function(module) {



    module.exports = {
      //
      // When fibers are not supported on you system Meteor automatically sets this
      // function to a nope function. We're going to do the same here as there are
      // small parts of the code that call this function.
      //
      _noYieldsAllowed: function _noYieldsAllowed(f) {
        return f();
      }
    };

    /***/ }),
    /* 4 */
    /***/ (function(module, exports) {



    Object.defineProperty(exports, "__esModule", ({
      value: true
    }));
    exports.default = void 0;

    function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

    // Based on json2.js from https://github.com/douglascrockford/JSON-js
    //
    //    json2.js
    //    2012-10-08
    //
    //    Public Domain.
    //
    //    NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
    function quote(string) {
      return JSON.stringify(string);
    }

    var str = function str(key, holder, singleIndent, outerIndent, canonical) {
      var value = holder[key]; // What happens next depends on the value's type.

      switch (_typeof(value)) {
        case 'string':
          return quote(value);

        case 'number':
          // JSON numbers must be finite. Encode non-finite numbers as null.
          return isFinite(value) ? String(value) : 'null';

        case 'boolean':
          return String(value);
        // If the type is 'object', we might be dealing with an object or an array or
        // null.

        case 'object':
          {
            // Due to a specification blunder in ECMAScript, typeof null is 'object',
            // so watch out for that case.
            if (!value) {
              return 'null';
            } // Make an array to hold the partial results of stringifying this object
            // value.


            var innerIndent = outerIndent + singleIndent;
            var partial = [];
            var v; // Is the value an array?

            if (Array.isArray(value) || {}.hasOwnProperty.call(value, 'callee')) {
              // The value is an array. Stringify every element. Use null as a
              // placeholder for non-JSON values.
              var length = value.length;

              for (var i = 0; i < length; i += 1) {
                partial[i] = str(i, value, singleIndent, innerIndent, canonical) || 'null';
              } // Join all of the elements together, separated with commas, and wrap
              // them in brackets.


              if (partial.length === 0) {
                v = '[]';
              } else if (innerIndent) {
                v = '[\n' + innerIndent + partial.join(',\n' + innerIndent) + '\n' + outerIndent + ']';
              } else {
                v = '[' + partial.join(',') + ']';
              }

              return v;
            } // Iterate through all of the keys in the object.


            var keys = Object.keys(value);

            if (canonical) {
              keys = keys.sort();
            }

            keys.forEach(function (k) {
              v = str(k, value, singleIndent, innerIndent, canonical);

              if (v) {
                partial.push(quote(k) + (innerIndent ? ': ' : ':') + v);
              }
            }); // Join all of the member texts together, separated with commas,
            // and wrap them in braces.

            if (partial.length === 0) {
              v = '{}';
            } else if (innerIndent) {
              v = '{\n' + innerIndent + partial.join(',\n' + innerIndent) + '\n' + outerIndent + '}';
            } else {
              v = '{' + partial.join(',') + '}';
            }

            return v;
          }

      }
    }; // If the JSON object does not yet have a stringify method, give it one.


    var canonicalStringify = function canonicalStringify(value, options) {
      // Make a fake root object containing our value under the key of ''.
      // Return the result of stringifying the value.
      var allOptions = Object.assign({
        indent: '',
        canonical: false
      }, options);

      if (allOptions.indent === true) {
        allOptions.indent = '  ';
      } else if (typeof allOptions.indent === 'number') {
        var newIndent = '';

        for (var i = 0; i < allOptions.indent; i++) {
          newIndent += ' ';
        }

        allOptions.indent = newIndent;
      }

      return str('', {
        '': value
      }, allOptions.indent, '', allOptions.canonical);
    };

    var _default = canonicalStringify;
    exports.default = _default;
    module.exports = exports.default;

    /***/ })
    /******/ 	]);
    /************************************************************************/
    /******/ 	// The module cache
    /******/ 	var __webpack_module_cache__ = {};
    /******/ 	
    /******/ 	// The require function
    /******/ 	function __webpack_require__(moduleId) {
    /******/ 		// Check if module is in cache
    /******/ 		if(__webpack_module_cache__[moduleId]) {
    /******/ 			return __webpack_module_cache__[moduleId].exports;
    /******/ 		}
    /******/ 		// Create a new module (and put it into the cache)
    /******/ 		var module = __webpack_module_cache__[moduleId] = {
    /******/ 			// no module.id needed
    /******/ 			// no module.loaded needed
    /******/ 			exports: {}
    /******/ 		};
    /******/ 	
    /******/ 		// Execute the module function
    /******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
    /******/ 	
    /******/ 		// Return the exports of the module
    /******/ 		return module.exports;
    /******/ 	}
    /******/ 	
    /************************************************************************/
    /******/ 	// module exports must be returned from runtime so entry inlining is disabled
    /******/ 	// startup
    /******/ 	// Load entry module and return exports
    /******/ 	return __webpack_require__(0);
    /******/ })()
    .EJSON;
    });

    var _createClass$1 = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();



    var _wolfy87Eventemitter2$1 = _interopRequireDefault$1(EventEmitter);



    var _ejson2 = _interopRequireDefault$1(ejson);

    function _interopRequireDefault$1(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

    function _classCallCheck$1(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

    function _possibleConstructorReturn$1(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

    function _inherits$1(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

    var Socket = function (_EventEmitter) {
        _inherits$1(Socket, _EventEmitter);

        function Socket(SocketConstructor, endpoint) {
            _classCallCheck$1(this, Socket);

            var _this = _possibleConstructorReturn$1(this, (Socket.__proto__ || Object.getPrototypeOf(Socket)).call(this));

            _this.SocketConstructor = SocketConstructor;
            _this.endpoint = endpoint;
            _this.rawSocket = null;
            return _this;
        }

        _createClass$1(Socket, [{
            key: "send",
            value: function send(object) {
                var message = _ejson2.default.stringify(object);
                this.rawSocket.send(message);
                // Emit a copy of the object, as the listener might mutate it.
                this.emit("message:out", _ejson2.default.parse(message));
            }
        }, {
            key: "open",
            value: function open() {
                var _this2 = this;

                /*
                *   Makes `open` a no-op if there's already a `rawSocket`. This avoids
                *   memory / socket leaks if `open` is called twice (e.g. by a user
                *   calling `ddp.connect` twice) without properly disposing of the
                *   socket connection. `rawSocket` gets automatically set to `null` only
                *   when it goes into a closed or error state. This way `rawSocket` is
                *   disposed of correctly: the socket connection is closed, and the
                *   object can be garbage collected.
                */
                if (this.rawSocket) {
                    return;
                }
                this.rawSocket = new this.SocketConstructor(this.endpoint);

                /*
                *   Calls to `onopen` and `onclose` directly trigger the `open` and
                *   `close` events on the `Socket` instance.
                */
                this.rawSocket.onopen = function () {
                    return _this2.emit("open");
                };
                this.rawSocket.onclose = function () {
                    _this2.rawSocket = null;
                    _this2.emit("close");
                };
                /*
                *   Calls to `onerror` trigger the `close` event on the `Socket`
                *   instance, and cause the `rawSocket` object to be disposed of.
                *   Since it's not clear what conditions could cause the error and if
                *   it's possible to recover from it, we prefer to always close the
                *   connection (if it isn't already) and dispose of the socket object.
                */
                this.rawSocket.onerror = function () {
                    // It's not clear what the socket lifecycle is when errors occurr.
                    // Hence, to avoid the `close` event to be emitted twice, before
                    // manually closing the socket we de-register the `onclose`
                    // callback.
                    if (_this2.rawSocket && _this2.rawSocket.onclose) delete _this2.rawSocket.onclose;
                    // Safe to perform even if the socket is already closed
                    _this2.rawSocket.close();
                    _this2.rawSocket = null;
                    _this2.emit("close");
                };
                /*
                *   Calls to `onmessage` trigger a `message:in` event on the `Socket`
                *   instance only once the message (first parameter to `onmessage`) has
                *   been successfully parsed into a javascript object.
                */
                this.rawSocket.onmessage = function (message) {
                    var object;
                    try {
                        object = _ejson2.default.parse(message.data);
                    } catch (ignore) {
                        // Simply ignore the malformed message and return
                        return;
                    }
                    // Outside the try-catch block as it must only catch EJSON parsing
                    // errors, not errors that may occur inside a "message:in" event
                    // handler
                    _this2.emit("message:in", object);
                };
            }
        }, {
            key: "close",
            value: function close() {
                /*
                *   Avoid throwing an error if `rawSocket === null`
                */
                if (this.rawSocket) {
                    this.rawSocket.close();
                }
            }
        }]);

        return Socket;
    }(_wolfy87Eventemitter2$1.default);

    var _default$1 = Socket;

    var socket = /*#__PURE__*/Object.defineProperty({
    	default: _default$1
    }, '__esModule', {value: true});

    var uniqueId_1 = uniqueId;
    var contains_1 = contains;
    var i = 0;
    function uniqueId() {
        return (i++).toString();
    }

    function contains(array, element) {
        return array.indexOf(element) !== -1;
    }

    var utils = /*#__PURE__*/Object.defineProperty({
    	uniqueId: uniqueId_1,
    	contains: contains_1
    }, '__esModule', {value: true});

    var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

    var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };



    var _wolfy87Eventemitter2 = _interopRequireDefault(EventEmitter);



    var _queue2 = _interopRequireDefault(queue);



    var _socket2 = _interopRequireDefault(socket);



    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

    function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

    function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

    var DDP_VERSION = "1";
    var PUBLIC_EVENTS = [
    // Subscription messages
    "ready", "nosub", "added", "changed", "removed",
    // Method messages
    "result", "updated",
    // Error messages
    "error"];
    var DEFAULT_RECONNECT_INTERVAL = 10000;

    var DDP = function (_EventEmitter) {
        _inherits(DDP, _EventEmitter);

        _createClass(DDP, [{
            key: "emit",
            value: function emit() {
                var _get2;

                setTimeout((_get2 = _get(DDP.prototype.__proto__ || Object.getPrototypeOf(DDP.prototype), "emit", this)).bind.apply(_get2, [this].concat(Array.prototype.slice.call(arguments))), 0);
            }
        }]);

        function DDP(options) {
            _classCallCheck(this, DDP);

            var _this = _possibleConstructorReturn(this, (DDP.__proto__ || Object.getPrototypeOf(DDP)).call(this));

            _this.status = "disconnected";

            //DDP session id
            _this.sessionId = null;

            //clean queue on disconnect or not, default to false
            _this.cleanQueue = options.cleanQueue === true;

            // Default `autoConnect` and `autoReconnect` to true
            _this.autoConnect = options.autoConnect !== false;
            _this.autoReconnect = options.autoReconnect !== false;
            _this.autoReconnectUserValue = _this.autoReconnect;
            _this.reconnectInterval = options.reconnectInterval || DEFAULT_RECONNECT_INTERVAL;

            _this.messageQueue = new _queue2.default(function (message) {
                if (_this.status === "connected") {
                    _this.socket.send(message);
                    return true;
                } else {
                    return false;
                }
            });

            _this.socket = new _socket2.default(options.SocketConstructor, options.endpoint);

            _this.socket.on("open", function () {
                // When the socket opens, send the `connect` message
                // to establish the DDP connection
                var params = {
                    msg: "connect",
                    version: DDP_VERSION,
                    support: [DDP_VERSION]
                };
                if (_this.sessionId) params.session = _this.sessionId;
                _this.socket.send(params);
            });

            _this.socket.on("close", function () {
                var oldStatus = _this.status;
                _this.status = "disconnected";
                if (_this.cleanQueue) _this.messageQueue.empty();
                if (oldStatus != "disconnected") _this.emit("disconnected");
                if (_this.autoReconnect) {
                    // Schedule a reconnection
                    setTimeout(_this.socket.open.bind(_this.socket), _this.reconnectInterval);
                }
            });

            _this.socket.on("message:in", function (message) {
                if (message.msg === "connected") {
                    _this.status = "connected";
                    _this.sessionId = message.session ? message.session : null;
                    _this.messageQueue.process();
                    _this.emit("connected", message);
                } else if (message.msg === "ping") {
                    // Reply with a `pong` message to prevent the server from
                    // closing the connection
                    _this.socket.send({ msg: "pong", id: message.id });
                } else if ((0, utils.contains)(PUBLIC_EVENTS, message.msg)) {
                    _this.emit(message.msg, message);
                }
            });

            if (_this.autoConnect) {
                _this.connect();
            }

            return _this;
        }

        _createClass(DDP, [{
            key: "connect",
            value: function connect() {
                this.autoReconnect = this.autoReconnectUserValue;
                this.socket.open();
            }
        }, {
            key: "disconnect",
            value: function disconnect() {
                /*
                *   If `disconnect` is called, the caller likely doesn't want the
                *   the instance to try to auto-reconnect. Therefore we set the
                *   `autoReconnect` flag to false.
                *   Also we should remember autoReconnect value to restore it on connect.
                */
                this.autoReconnectUserValue = this.autoReconnect;
                this.autoReconnect = false;
                this.sessionId = null;
                this.socket.close();
            }
        }, {
            key: "pauseQueue",
            value: function pauseQueue() {
                this.messageQueue.pause();
            }
        }, {
            key: "continueQueue",
            value: function continueQueue() {
                this.messageQueue.continue();
            }
        }, {
            key: "method",
            value: function method(name, params) {
                var atBeginning = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

                var id = (0, utils.uniqueId)();
                this.messageQueue[atBeginning ? 'unshift' : 'push']({
                    msg: "method",
                    id: id,
                    method: name,
                    params: params
                });
                return id;
            }
        }, {
            key: "sub",
            value: function sub(name, params) {
                var id = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : (0, utils.uniqueId)();

                this.messageQueue.push({
                    msg: "sub",
                    id: id,
                    name: name,
                    params: params
                });
                return id;
            }
        }, {
            key: "unsub",
            value: function unsub(id) {
                this.messageQueue.push({
                    msg: "unsub",
                    id: id
                });
                return id;
            }
        }]);

        return DDP;
    }(_wolfy87Eventemitter2.default);

    var _default = DDP;

    var ddp = /*#__PURE__*/Object.defineProperty({
    	default: _default
    }, '__esModule', {value: true});

    var isequal = createCommonjsModule(function (module, exports) {

    Object.defineProperty(exports, "__esModule", {
    	value: true
    });
    exports.isEqual = function isEqual(value, other) {
    	var type = Object.prototype.toString.call(value);

    	if (type !== Object.prototype.toString.call(other)) return false;

    	if (['[object Array]', '[object Object]'].indexOf(type) < 0) return false;

    	var valueLen = type === '[object Array]' ? value.length : Object.keys(value).length;
    	var otherLen = type === '[object Array]' ? other.length : Object.keys(other).length;
    	if (valueLen !== otherLen) return false;

    	var compare = function compare(item1, item2) {
    		var itemType = Object.prototype.toString.call(item1);

    		if (['[object Array]', '[object Object]'].indexOf(itemType) >= 0) {
    			if (!isEqual(item1, item2)) return false;
    		} else {
    				if (itemType !== Object.prototype.toString.call(item2)) return false;

    				if (itemType === '[object Function]') {
    					if (item1.toString() !== item2.toString()) return false;
    				} else {
    					if (item1 !== item2) return false;
    				}
    			}
    	};

    	if (type === '[object Array]') {
    		for (var i = 0; i < valueLen; i++) {
    			if (compare(value[i], other[i]) === false) return false;
    		}
    	} else {
    		for (var key in value) {
    			if (value.hasOwnProperty(key)) {
    				if (compare(value[key], other[key]) === false) return false;
    			}
    		}
    	}

    	return true;
    };
    });

    var toString = Object.prototype.toString;

    var kindOf = function kindOf(val) {
      if (val === void 0) return 'undefined';
      if (val === null) return 'null';

      var type = typeof val;
      if (type === 'boolean') return 'boolean';
      if (type === 'string') return 'string';
      if (type === 'number') return 'number';
      if (type === 'symbol') return 'symbol';
      if (type === 'function') {
        return isGeneratorFn(val) ? 'generatorfunction' : 'function';
      }

      if (isArray(val)) return 'array';
      if (isBuffer(val)) return 'buffer';
      if (isArguments(val)) return 'arguments';
      if (isDate(val)) return 'date';
      if (isError(val)) return 'error';
      if (isRegexp(val)) return 'regexp';

      switch (ctorName(val)) {
        case 'Symbol': return 'symbol';
        case 'Promise': return 'promise';

        // Set, Map, WeakSet, WeakMap
        case 'WeakMap': return 'weakmap';
        case 'WeakSet': return 'weakset';
        case 'Map': return 'map';
        case 'Set': return 'set';

        // 8-bit typed arrays
        case 'Int8Array': return 'int8array';
        case 'Uint8Array': return 'uint8array';
        case 'Uint8ClampedArray': return 'uint8clampedarray';

        // 16-bit typed arrays
        case 'Int16Array': return 'int16array';
        case 'Uint16Array': return 'uint16array';

        // 32-bit typed arrays
        case 'Int32Array': return 'int32array';
        case 'Uint32Array': return 'uint32array';
        case 'Float32Array': return 'float32array';
        case 'Float64Array': return 'float64array';
      }

      if (isGeneratorObj(val)) {
        return 'generator';
      }

      // Non-plain objects
      type = toString.call(val);
      switch (type) {
        case '[object Object]': return 'object';
        // iterators
        case '[object Map Iterator]': return 'mapiterator';
        case '[object Set Iterator]': return 'setiterator';
        case '[object String Iterator]': return 'stringiterator';
        case '[object Array Iterator]': return 'arrayiterator';
      }

      // other
      return type.slice(8, -1).toLowerCase().replace(/\s/g, '');
    };

    function ctorName(val) {
      return typeof val.constructor === 'function' ? val.constructor.name : null;
    }

    function isArray(val) {
      if (Array.isArray) return Array.isArray(val);
      return val instanceof Array;
    }

    function isError(val) {
      return val instanceof Error || (typeof val.message === 'string' && val.constructor && typeof val.constructor.stackTraceLimit === 'number');
    }

    function isDate(val) {
      if (val instanceof Date) return true;
      return typeof val.toDateString === 'function'
        && typeof val.getDate === 'function'
        && typeof val.setDate === 'function';
    }

    function isRegexp(val) {
      if (val instanceof RegExp) return true;
      return typeof val.flags === 'string'
        && typeof val.ignoreCase === 'boolean'
        && typeof val.multiline === 'boolean'
        && typeof val.global === 'boolean';
    }

    function isGeneratorFn(name, val) {
      return ctorName(name) === 'GeneratorFunction';
    }

    function isGeneratorObj(val) {
      return typeof val.throw === 'function'
        && typeof val.return === 'function'
        && typeof val.next === 'function';
    }

    function isArguments(val) {
      try {
        if (typeof val.length === 'number' && typeof val.callee === 'function') {
          return true;
        }
      } catch (err) {
        if (err.message.indexOf('callee') !== -1) {
          return true;
        }
      }
      return false;
    }

    /**
     * If you need to support Safari 5-7 (8-10 yr-old browser),
     * take a look at https://github.com/feross/is-buffer
     */

    function isBuffer(val) {
      if (val.constructor && typeof val.constructor.isBuffer === 'function') {
        return val.constructor.isBuffer(val);
      }
      return false;
    }

    /*!
     * shallow-clone <https://github.com/jonschlinkert/shallow-clone>
     *
     * Copyright (c) 2015-present, Jon Schlinkert.
     * Released under the MIT License.
     */

    const valueOf = Symbol.prototype.valueOf;


    function clone(val, deep) {
      switch (kindOf(val)) {
        case 'array':
          return val.slice();
        case 'object':
          return Object.assign({}, val);
        case 'date':
          return new val.constructor(Number(val));
        case 'map':
          return new Map(val);
        case 'set':
          return new Set(val);
        case 'buffer':
          return cloneBuffer(val);
        case 'symbol':
          return cloneSymbol(val);
        case 'arraybuffer':
          return cloneArrayBuffer(val);
        case 'float32array':
        case 'float64array':
        case 'int16array':
        case 'int32array':
        case 'int8array':
        case 'uint16array':
        case 'uint32array':
        case 'uint8clampedarray':
        case 'uint8array':
          return cloneTypedArray(val);
        case 'regexp':
          return cloneRegExp(val);
        case 'error':
          return Object.create(val);
        default: {
          return val;
        }
      }
    }

    function cloneRegExp(val) {
      const flags = val.flags !== void 0 ? val.flags : (/\w+$/.exec(val) || void 0);
      const re = new val.constructor(val.source, flags);
      re.lastIndex = val.lastIndex;
      return re;
    }

    function cloneArrayBuffer(val) {
      const res = new val.constructor(val.byteLength);
      new Uint8Array(res).set(new Uint8Array(val));
      return res;
    }

    function cloneTypedArray(val, deep) {
      return new val.constructor(val.buffer, val.byteOffset, val.length);
    }

    function cloneBuffer(val) {
      const len = val.length;
      const buf = Buffer.allocUnsafe ? Buffer.allocUnsafe(len) : Buffer.from(len);
      val.copy(buf);
      return buf;
    }

    function cloneSymbol(val) {
      return valueOf ? Object(valueOf.call(val)) : {};
    }

    /**
     * Expose `clone`
     */

    var shallowClone = clone;

    /*!
     * isobject <https://github.com/jonschlinkert/isobject>
     *
     * Copyright (c) 2014-2017, Jon Schlinkert.
     * Released under the MIT License.
     */

    var isobject = function isObject(val) {
      return val != null && typeof val === 'object' && Array.isArray(val) === false;
    };

    /*!
     * is-plain-object <https://github.com/jonschlinkert/is-plain-object>
     *
     * Copyright (c) 2014-2017, Jon Schlinkert.
     * Released under the MIT License.
     */



    function isObjectObject(o) {
      return isobject(o) === true
        && Object.prototype.toString.call(o) === '[object Object]';
    }

    var isPlainObject = function isPlainObject(o) {
      var ctor,prot;

      if (isObjectObject(o) === false) return false;

      // If has modified constructor
      ctor = o.constructor;
      if (typeof ctor !== 'function') return false;

      // If has modified prototype
      prot = ctor.prototype;
      if (isObjectObject(prot) === false) return false;

      // If constructor does not have an Object-specific method
      if (prot.hasOwnProperty('isPrototypeOf') === false) {
        return false;
      }

      // Most likely a plain Object
      return true;
    };

    /**
     * Module dependenices
     */





    function cloneDeep(val, instanceClone) {
      switch (kindOf(val)) {
        case 'object':
          return cloneObjectDeep(val, instanceClone);
        case 'array':
          return cloneArrayDeep(val, instanceClone);
        default: {
          return shallowClone(val);
        }
      }
    }

    function cloneObjectDeep(val, instanceClone) {
      if (typeof instanceClone === 'function') {
        return instanceClone(val);
      }
      if (instanceClone || isPlainObject(val)) {
        const res = new val.constructor();
        for (let key in val) {
          res[key] = cloneDeep(val[key], instanceClone);
        }
        return res;
      }
      return val;
    }

    function cloneArrayDeep(val, instanceClone) {
      const res = new val.constructor(val.length);
      for (let i = 0; i < val.length; i++) {
        res[i] = cloneDeep(val[i], instanceClone);
      }
      return res;
    }

    /**
     * Expose `cloneDeep`
     */

    var cloneDeep_1 = cloneDeep;

    var fullCopy_1 = createCommonjsModule(function (module, exports) {

    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.fullCopy = undefined;



    var _cloneDeep2 = _interopRequireDefault(cloneDeep_1);

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

    exports.fullCopy = _cloneDeep2.default;
    });

    var ddpEventListener_1 = createCommonjsModule(function (module, exports) {

    Object.defineProperty(exports, "__esModule", {
    	value: true
    });

    var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

    exports.ddpEventListener = function () {
    	function ddpEventListener(eventname, f, ddplink) {
    		_classCallCheck(this, ddpEventListener);

    		this._ddplink = ddplink;
    		this._eventname = eventname;
    		this._f = f;
    		this._started = false;
    		this.start();
    	}

    	_createClass(ddpEventListener, [{
    		key: "stop",
    		value: function stop() {
    			if (this._started) {
    				this._ddplink.ddpConnection.removeListener(this._eventname, this._f);
    				this._started = false;
    			}
    		}
    	}, {
    		key: "start",
    		value: function start() {
    			if (!this._started) {
    				this._ddplink.ddpConnection.on(this._eventname, this._f);
    				this._started = true;
    			}
    		}
    	}]);

    	return ddpEventListener;
    }();
    });

    var ddpSubscription_1 = createCommonjsModule(function (module, exports) {

    Object.defineProperty(exports, "__esModule", {
    		value: true
    });

    var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

    exports.ddpSubscription = function () {
    		function ddpSubscription(pubname, args, ddplink) {
    				var _this = this;

    				_classCallCheck(this, ddpSubscription);

    				this._ddplink = ddplink;
    				this.pubname = pubname;
    				this.args = args;
    				this._nosub = false;
    				this._started = false;
    				this._ready = false;

    				this.selfReadyEvent = ddplink.on('ready', function (m) {
    						if (m.subs.includes(_this.subscriptionId)) {
    								_this._ready = true;
    								_this._nosub = false;
    						}
    				});

    				this.selfNosubEvent = ddplink.on('nosub', function (m) {
    						if (m.id == _this.subscriptionId) {
    								_this._ready = false;
    								_this._nosub = true;
    								_this._started = false;
    						}
    				});

    				this.start();
    		}

    		_createClass(ddpSubscription, [{
    				key: 'onNosub',
    				value: function onNosub(f) {
    						var _this2 = this;

    						if (this.isStopped()) {
    								f();
    						} else {
    								var onNs = this._ddplink.on('nosub', function (m) {
    										if (m.id == _this2.subscriptionId) {
    												f(m.error);
    										}
    								});
    								return onNs;
    						}
    				}
    		}, {
    				key: 'onReady',
    				value: function onReady(f) {
    						var _this3 = this;

    						if (this.isReady()) {
    								f();
    						} else {
    								var onReady = this._ddplink.on('ready', function (m) {
    										if (m.subs.includes(_this3.subscriptionId)) {
    												f();
    										}
    								});
    								return onReady;
    						}
    				}
    		}, {
    				key: 'isReady',
    				value: function isReady() {
    						return this._ready;
    				}
    		}, {
    				key: 'isStopped',
    				value: function isStopped() {
    						return this._nosub;
    				}
    		}, {
    				key: 'ready',
    				value: function ready() {
    						var _this4 = this;

    						return new Promise(function (resolve, reject) {
    								if (_this4.isReady()) {
    										resolve();
    								} else {
    										var onReady = _this4._ddplink.on('ready', function (m) {
    												if (m.subs.includes(_this4.subscriptionId)) {
    														onReady.stop();
    														_onNosub.stop();
    														resolve();
    												}
    										});
    										var _onNosub = _this4._ddplink.on('nosub', function (m) {
    												if (m.id == _this4.subscriptionId) {
    														_onNosub.stop();
    														onReady.stop();
    														reject(m.error);
    												}
    										});
    								}
    						});
    				}
    		}, {
    				key: 'nosub',
    				value: function nosub() {
    						var _this5 = this;

    						return new Promise(function (resolve, reject) {
    								if (_this5.isStopped()) {
    										resolve();
    								} else {
    										var _onNosub2 = _this5._ddplink.on('nosub', function (m) {
    												if (m.id == _this5.subscriptionId) {
    														_this5._nosub = true;

    														_onNosub2.stop();
    														if (m.error) {
    																reject(m.error);
    														} else {
    																resolve();
    														}
    												}
    										});
    								}
    						});
    				}
    		}, {
    				key: 'isOn',
    				value: function isOn() {
    						return this._started;
    				}
    		}, {
    				key: 'remove',
    				value: function remove() {
    						this.selfNosubEvent.stop();

    						this.stop();

    						var i = this._ddplink.subs.indexOf(this);
    						if (i > -1) {
    								this._ddplink.subs.splice(i, 1);
    						}
    				}
    		}, {
    				key: 'stop',
    				value: function stop() {
    						if (this._started) {
    								this.selfReadyEvent.stop();

    								if (!this._nosub) this._ddplink.ddpConnection.unsub(this.subscriptionId);
    								this._started = false;
    								this._ready = false;
    						}
    						return this.nosub();
    				}
    		}, {
    				key: '_getId',
    				value: function _getId() {
    						return this.subscriptionId;
    				}
    		}, {
    				key: 'start',
    				value: function start(args) {
    						if (!this._started) {
    								this.selfReadyEvent.start();

    								if (Array.isArray(args)) this.args = args;
    								this.subscriptionId = this._ddplink.ddpConnection.sub(this.pubname, this.args);
    								this._started = true;
    						}
    						return this.ready();
    				}
    		}, {
    				key: 'restart',
    				value: function restart(args) {
    						var _this6 = this;

    						return new Promise(function (resolve, reject) {
    								_this6.stop().then(function () {
    										_this6.start(args).then(function () {
    												resolve();
    										}).catch(function (e) {
    												reject(e);
    										});
    								}).catch(function (e) {
    										reject(e);
    								});
    						});
    				}
    		}]);

    		return ddpSubscription;
    }();
    });

    var ddpOnChange_1 = createCommonjsModule(function (module, exports) {

    Object.defineProperty(exports, "__esModule", {
      value: true
    });

    var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

    exports.ddpOnChange = function () {
      function ddpOnChange(obj, inst) {
        var listenersArray = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'onChangeFuncs';

        _classCallCheck(this, ddpOnChange);

        this._obj = obj;
        this._inst = inst;
        this._isStopped = true;
        this._listenersArray = listenersArray;
        this.start();
      }

      _createClass(ddpOnChange, [{
        key: 'stop',
        value: function stop() {
          var i = this._inst[this._listenersArray].indexOf(this._obj);
          if (i > -1) {
            this._isStopped = true;
            this._inst[this._listenersArray].splice(i, 1);
          }
        }
      }, {
        key: 'start',
        value: function start() {
          if (this._isStopped) {
            this._inst[this._listenersArray].push(this._obj);
            this._isStopped = false;
          }
        }
      }]);

      return ddpOnChange;
    }();
    });

    var ddpReducer_1 = createCommonjsModule(function (module, exports) {

    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.ddpReducer = undefined;

    var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();



    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

    exports.ddpReducer = function () {
      function ddpReducer(ddpReactiveCollectionInstance, reducer, initialValue) {
        _classCallCheck(this, ddpReducer);

        this._ddpReactiveCollectionInstance = ddpReactiveCollectionInstance;
        this._reducer = reducer;
        this._started = false;
        this._data = { result: null };
        this._tickers = [];
        this._initialValue = initialValue;
        this.start();
      }

      _createClass(ddpReducer, [{
        key: 'doReduce',
        value: function doReduce() {
          var _this = this;

          if (this._started) {
            this._data.result = this._ddpReactiveCollectionInstance.data().reduce(this._reducer, this._initialValue);
            this._tickers.forEach(function (ticker) {
              ticker(_this.data().result);
            });
          }
        }
      }, {
        key: 'start',
        value: function start() {
          if (!this._started) {
            this.doReduce();
            this._ddpReactiveCollectionInstance._activateReducer(this);
            this._started = true;
          }
        }
      }, {
        key: 'stop',
        value: function stop() {
          if (this._started) {
            this._ddpReactiveCollectionInstance._deactivateReducer(this);
            this._started = false;
          }
        }
      }, {
        key: 'data',
        value: function data() {
          return this._data;
        }
      }, {
        key: 'onChange',
        value: function onChange(f) {
          return new ddpOnChange_1.ddpOnChange(f, this, '_tickers');
        }
      }]);

      return ddpReducer;
    }();
    });

    var ddpReactiveDocument_1 = createCommonjsModule(function (module, exports) {

    Object.defineProperty(exports, "__esModule", {
    	value: true
    });
    exports.ddpReactiveDocument = undefined;

    var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

    var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();



    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

    exports.ddpReactiveDocument = function () {
    	function ddpReactiveDocument(ddpReactiveCollectionInstance, settings) {
    		_classCallCheck(this, ddpReactiveDocument);

    		this._ddpReactiveCollectionInstance = ddpReactiveCollectionInstance;
    		this._started = false;
    		this._data = {};
    		this._tickers = [];
    		this._preserve = false;
    		if ((typeof settings === 'undefined' ? 'undefined' : _typeof(settings)) === 'object' && settings !== null) this.settings(settings);
    		this.start();
    	}

    	_createClass(ddpReactiveDocument, [{
    		key: '_update',
    		value: function _update(newState) {
    			var _this = this;

    			if (newState) {
    				Object.keys(this._data).forEach(function (key) {
    					delete _this._data[key];
    				});

    				Object.assign(this._data, newState);
    			} else {
    				if (!this._preserve) {
    					Object.keys(this._data).forEach(function (key) {
    						delete _this._data[key];
    					});
    				}
    			}

    			this._tickers.forEach(function (ticker) {
    				ticker(_this.data());
    			});
    		}
    	}, {
    		key: 'start',
    		value: function start() {
    			if (!this._started) {
    				this._update(this._ddpReactiveCollectionInstance.data()[0]);
    				this._ddpReactiveCollectionInstance._activateReactiveObject(this);
    				this._started = true;
    			}
    		}
    	}, {
    		key: 'stop',
    		value: function stop() {
    			if (this._started) {
    				this._ddpReactiveCollectionInstance._deactivateReactiveObject(this);
    				this._started = false;
    			}
    		}
    	}, {
    		key: 'data',
    		value: function data() {
    			return this._data;
    		}
    	}, {
    		key: 'onChange',
    		value: function onChange(f) {
    			return new ddpOnChange_1.ddpOnChange(f, this, '_tickers');
    		}
    	}, {
    		key: 'settings',
    		value: function settings(_ref) {
    			var preserve = _ref.preserve;

    			this._preserve = !!preserve;
    		}
    	}]);

    	return ddpReactiveDocument;
    }();
    });

    var ddpReactiveCollection_1 = createCommonjsModule(function (module, exports) {

    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.ddpReactiveCollection = undefined;

    var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();







    function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

    exports.ddpReactiveCollection = function () {
      function ddpReactiveCollection(ddpCollectionInstance, skiplimit, filter) {
        var _this = this;

        _classCallCheck(this, ddpReactiveCollection);

        this._skip = skiplimit && typeof skiplimit.skip === 'number' ? skiplimit.skip : 0;
        this._limit = skiplimit && typeof skiplimit.limit === 'number' ? skiplimit.limit : Infinity;

        this._length = { result: 0 };

        this._data = [];
        this._rawData = [];

        this._reducers = [];
        this._tickers = [];
        this._ones = [];

        this._first = {};

        this._syncFunc = function (skip, limit, sort) {
          var options = {};
          if (typeof skip === 'number') options.skip = skip;
          if (typeof limit === 'number') options.limit = limit;
          if (sort) options.sort = sort;
          return ddpCollectionInstance.fetch.call(ddpCollectionInstance, options);
        };

        this._changeHandler = ddpCollectionInstance.onChange(function (_ref) {
          var prev = _ref.prev,
              next = _ref.next,
              predicatePassed = _ref.predicatePassed;

          if (prev && next) {
            if (predicatePassed[0] == 0 && predicatePassed[1] == 1) {
              _this._smartUpdate(next);
            } else if (predicatePassed[0] == 1 && predicatePassed[1] == 0) {
              var i = _this._rawData.findIndex(function (obj) {
                return obj.id == prev.id;
              });
              _this._removeItem(i);
            } else if (predicatePassed[0] == 1 && predicatePassed[1] == 1) {
              var _i = _this._rawData.findIndex(function (obj) {
                return obj.id == prev.id;
              });
              _this._smartUpdate(next, _i);
            }
          } else if (!prev && next) {
            _this._smartUpdate(next);
          } else if (prev && !next) {
            var _i2 = _this._rawData.findIndex(function (obj) {
              return obj.id == prev.id;
            });
            _this._removeItem(_i2);
          }
          _this._length.result = _this._data.length;

          _this._reducers.forEach(function (reducer) {
            reducer.doReduce();
          });

          if (_this._data[0] !== _this._first) {
            _this._updateReactiveObjects();
          }

          _this._first = _this._data[0];

          _this._tickers.forEach(function (ticker) {
            ticker(_this.data());
          });
        }, filter ? filter : function (_) {
          return true;
        });

        this.started = false;
        this._sort = false;

        this.start();
      }

      _createClass(ddpReactiveCollection, [{
        key: '_removeItem',
        value: function _removeItem(i) {
          this._rawData.splice(i, 1);

          if (i >= this._skip && i < this._skip + this._limit) {
            this._data.splice(i - this._skip, 1);

            if (this._rawData.length >= this._skip + this._limit) {
              this._data.push(this._rawData[this._skip + this._limit - 1]);
            }
          } else if (i < this._skip) {
            this._data.shift();
            if (this._rawData.length >= this._skip + this._limit) {
              this._data.push(this._rawData[this._skip + this._limit - 1]);
            }
          }
        }
      }, {
        key: '_smartUpdate',
        value: function _smartUpdate(newEl, j) {
          var placement = void 0;
          if (!this._rawData.length) {
            placement = this._rawData.push(newEl) - 1;
            if (placement >= this._skip && placement < this._skip + this._limit) {
              this._data.push(newEl);
            }
            return;
          }

          if (this._sort) {
            for (var i = 0; i < this._rawData.length; i++) {
              if (this._sort(newEl, this._rawData[i]) < 1) {
                placement = i;
                if (i == j) {
                  this._rawData[i] = newEl;
                  if (j >= this._skip && j < this._skip + this._limit) {
                    this._data[j - this._skip] = newEl;
                  }
                } else {
                  this._removeItem(j);
                  this._rawData.splice(i, 0, newEl);
                  if (i >= this._skip && i < this._skip + this._limit) {
                    this._data.splice(i - this._skip, 0, newEl);
                    this._data.splice(this._limit);
                  }
                }
                break;
              }
              if (i == this._rawData.length - 1) {
                placement = this._rawData.push(newEl) - 1;
                if (placement >= this._skip && placement < this._skip + this._limit) {
                  this._data.push(newEl);
                }
                break;
              }
            }
          } else {
            if (typeof j === 'number') {
              placement = j;
              this._rawData[j] = newEl;
              if (j >= this._skip && j < this._skip + this._limit) {
                this._data[j - this._skip] = newEl;
              }
            } else {
              placement = this._rawData.push(newEl) - 1;
              if (placement >= this._skip && placement < this._skip + this._limit) {
                this._data.push(newEl);
              }
            }
          }
        }
      }, {
        key: '_activateReducer',
        value: function _activateReducer(reducer) {
          this._reducers.push(reducer);
        }
      }, {
        key: '_activateReactiveObject',
        value: function _activateReactiveObject(o) {
          this._ones.push(o);
        }
      }, {
        key: '_deactivateReducer',
        value: function _deactivateReducer(reducer) {
          var i = this._reducers.indexOf(reducer);
          if (i > -1) {
            this._reducers.splice(i, 1);
          }
        }
      }, {
        key: '_deactivateReactiveObject',
        value: function _deactivateReactiveObject(o) {
          var i = this._ones.indexOf(o);
          if (i > -1) {
            this._ones.splice(i, 1);
          }
        }
      }, {
        key: '_updateReactiveObjects',
        value: function _updateReactiveObjects() {
          var _this2 = this;

          this._ones.forEach(function (ro) {
            ro._update(_this2.data()[0]);
          });
        }
      }, {
        key: 'settings',
        value: function settings(_ref2) {
          var _data;

          var skip = _ref2.skip,
              limit = _ref2.limit;

          this._skip = skip !== false ? skip : 0;
          this._limit = limit !== false ? limit : Infinity;
          (_data = this._data).splice.apply(_data, [0, this._data.length].concat(_toConsumableArray(this._syncFunc(this._skip, this._limit, this._sort))));
          this._updateReactiveObjects();
        }
      }, {
        key: 'stop',
        value: function stop() {
          if (this.started) {
            this._changeHandler.stop();
            this.started = false;
          }
        }
      }, {
        key: 'start',
        value: function start() {
          if (!this.started) {
            var _rawData, _data2;

            (_rawData = this._rawData).splice.apply(_rawData, [0, this._rawData.length].concat(_toConsumableArray(this._syncFunc(false, false, this._sort))));
            (_data2 = this._data).splice.apply(_data2, [0, this._data.length].concat(_toConsumableArray(this._syncFunc(this._skip, this._limit, this._sort))));
            this._updateReactiveObjects();
            this._changeHandler.start();
            this.started = true;
          }
        }
      }, {
        key: 'sort',
        value: function sort(f) {
          this._sort = f;
          if (this._sort) {
            var _rawData2, _data3;

            (_rawData2 = this._rawData).splice.apply(_rawData2, [0, this._rawData.length].concat(_toConsumableArray(this._syncFunc(false, false, this._sort))));
            (_data3 = this._data).splice.apply(_data3, [0, this._data.length].concat(_toConsumableArray(this._syncFunc(this._skip, this._limit, this._sort))));
            this._updateReactiveObjects();
          }
          return this;
        }
      }, {
        key: 'data',
        value: function data() {
          return this._data;
        }
      }, {
        key: 'onChange',
        value: function onChange(f) {
          return new ddpOnChange_1.ddpOnChange(f, this, '_tickers');
        }
      }, {
        key: 'map',
        value: function map(f) {
          return new ddpReducer_1.ddpReducer(this, function (accumulator, el, i, a) {
            return accumulator.concat(f(el, i, a));
          }, []);
        }
      }, {
        key: 'reduce',
        value: function reduce(f, initialValue) {
          return new ddpReducer_1.ddpReducer(this, f, initialValue);
        }
      }, {
        key: 'count',
        value: function count() {
          return this._length;
        }
      }, {
        key: 'one',
        value: function one(settings) {
          return new ddpReactiveDocument_1.ddpReactiveDocument(this, settings);
        }
      }]);

      return ddpReactiveCollection;
    }();
    });

    var ddpCollection_1 = createCommonjsModule(function (module, exports) {

    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.ddpCollection = undefined;

    var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();







    function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

    exports.ddpCollection = function () {
      function ddpCollection(name, server) {
        _classCallCheck(this, ddpCollection);

        this._name = name;
        this._server = server;
        this._filter = false;
      }

      _createClass(ddpCollection, [{
        key: 'filter',
        value: function filter(f) {
          this._filter = f;
          return this;
        }
      }, {
        key: 'importData',
        value: function importData(data) {
          var _this = this;

          var c = typeof data === 'string' ? EJSON.parse(data) : data;

          if (c[this._name]) {
            c[this._name].forEach(function (doc, i, arr) {
              if (!_this._filter || _this._filter && _this._filter(doc, i, arr)) {
                _this.ddpConnection.emit('added', {
                  msg: 'added',
                  id: doc.id,
                  collection: _this._name,
                  fields: doc.fields
                });
              }
            });
          }
        }
      }, {
        key: 'exportData',
        value: function exportData(format) {
          var collectionCopy = _defineProperty({}, this._name, this.fetch());
          if (format === undefined || format == 'string') {
            return EJSON.stringify(collectionCopy);
          } else if (format == 'raw') {
            return collectionCopy;
          }
        }
      }, {
        key: 'fetch',
        value: function fetch(settings) {
          var skip = void 0,
              limit = void 0,
              sort = void 0;

          if (settings) {
            skip = settings.skip;
            limit = settings.limit;
            sort = settings.sort;
          }

          var c = this._server.collections[this._name];
          var collectionCopy = c ? (0, fullCopy_1.fullCopy)(c) : [];
          if (this._filter) collectionCopy = collectionCopy.filter(this._filter);
          if (sort) collectionCopy.sort(sort);
          if (typeof skip === 'number') collectionCopy.splice(0, skip);
          if (typeof limit === 'number' || limit == Infinity) collectionCopy.splice(limit);
          return collectionCopy;
        }
      }, {
        key: 'reactive',
        value: function reactive(settings) {
          return new ddpReactiveCollection_1.ddpReactiveCollection(this, settings, this._filter);
        }
      }, {
        key: 'onChange',
        value: function onChange(f, filter) {
          var obj = {
            collection: this._name,
            f: f
          };

          if (this._filter) obj.filter = this._filter;
          if (filter) obj.filter = filter;

          return new ddpOnChange_1.ddpOnChange(obj, this._server);
        }
      }]);

      return ddpCollection;
    }();
    });

    var simpleddp = createCommonjsModule(function (module, exports) {

    Object.defineProperty(exports, "__esModule", {
    	value: true
    });

    var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();



    var _simpleddpCore2 = _interopRequireDefault(ddp);



    var _ejson2 = _interopRequireDefault(ejson);











    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

    function uniqueIdFuncGen() {
    	var idCounter = 0;

    	return function () {
    		return idCounter++;
    	};
    }

    var simpleDDPcounter = uniqueIdFuncGen();

    function connectPlugins(plugins) {
    	var _this = this;

    	for (var _len = arguments.length, places = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    		places[_key - 1] = arguments[_key];
    	}

    	if (Array.isArray(plugins)) {
    		plugins.forEach(function (p) {
    			places.forEach(function (place) {
    				if (p[place]) {
    					p[place].call(_this);
    				}
    			});
    		});
    	}
    }

    var simpleDDP = function () {
    	function simpleDDP(opts, plugins) {
    		var _this2 = this;

    		_classCallCheck(this, simpleDDP);

    		this._id = simpleDDPcounter();
    		this._opGenId = uniqueIdFuncGen();
    		this._opts = opts;
    		this.ddpConnection = new _simpleddpCore2.default(opts);
    		this.subs = [];

    		this.collections = {};

    		this.onChangeFuncs = [];

    		this.connected = false;

    		this.maxTimeout = opts.maxTimeout;
    		this.clearDataOnReconnection = opts.clearDataOnReconnection === undefined ? true : opts.clearDataOnReconnection;
    		this.tryingToConnect = opts.autoConnect === undefined ? true : opts.autoConnect;
    		this.tryingToDisconnect = false;
    		this.willTryToReconnect = opts.autoReconnect === undefined ? true : opts.autoReconnect;

    		var pluginConnector = connectPlugins.bind(this, plugins);

    		pluginConnector('init', 'beforeConnected');

    		this.connectedEvent = this.on('connected', function (m) {
    			_this2.connected = true;
    			_this2.tryingToConnect = false;
    		});

    		pluginConnector('afterConnected', 'beforeSubsRestart');

    		this.connectedEventRestartSubs = this.on('connected', function (m) {
    			if (_this2.clearDataOnReconnection) {
    				_this2.clearData().then(function () {
    					_this2.ddpConnection.emit('clientReady');
    					_this2.restartSubs();
    				});
    			} else {
    				_this2.ddpConnection.emit('clientReady');
    				_this2.restartSubs();
    			}
    		});

    		pluginConnector('afterSubsRestart', 'beforeDisconnected');

    		this.disconnectedEvent = this.on('disconnected', function (m) {
    			_this2.connected = false;
    			_this2.tryingToDisconnect = false;
    			_this2.tryingToConnect = _this2.willTryToReconnect;
    		});

    		pluginConnector('afterDisconnected', 'beforeAdded');

    		this.addedEvent = this.on('added', function (m) {
    			return _this2.dispatchAdded(m);
    		});
    		pluginConnector('afterAdded', 'beforeChanged');
    		this.changedEvent = this.on('changed', function (m) {
    			return _this2.dispatchChanged(m);
    		});
    		pluginConnector('afterChanged', 'beforeRemoved');
    		this.removedEvent = this.on('removed', function (m) {
    			return _this2.dispatchRemoved(m);
    		});
    		pluginConnector('afterRemoved', 'after');
    	}

    	_createClass(simpleDDP, [{
    		key: 'restartSubs',
    		value: function restartSubs() {
    			this.subs.forEach(function (sub) {
    				if (sub.isOn()) {
    					sub.restart();
    				}
    			});
    		}
    	}, {
    		key: 'collection',
    		value: function collection(name) {
    			return new ddpCollection_1.ddpCollection(name, this);
    		}
    	}, {
    		key: 'dispatchAdded',
    		value: function dispatchAdded(m) {
    			var _this3 = this;

    			if (this.collections.hasOwnProperty(m.collection)) {
    				var _i = this.collections[m.collection].findIndex(function (obj) {
    					return obj.id == m.id;
    				});
    				if (_i > -1) {
    					this.collections[m.collection].splice(_i, 1);
    				}
    			}
    			if (!this.collections.hasOwnProperty(m.collection)) this.collections[m.collection] = [];
    			var newObj = Object.assign({ id: m.id }, m.fields);
    			var i = this.collections[m.collection].push(newObj);
    			var fields = {};
    			if (m.fields) {
    				Object.keys(m.fields).map(function (p) {
    					fields[p] = 1;
    				});
    			}
    			this.onChangeFuncs.forEach(function (l) {
    				if (l.collection == m.collection) {
    					var hasFilter = l.hasOwnProperty('filter');
    					var newObjFullCopy = (0, fullCopy_1.fullCopy)(newObj);
    					if (!hasFilter) {
    						l.f({ changed: false, added: newObjFullCopy, removed: false });
    					} else if (hasFilter && l.filter(newObjFullCopy, i - 1, _this3.collections[m.collection])) {
    						l.f({ prev: false, next: newObjFullCopy, fields: fields, fieldsChanged: newObjFullCopy, fieldsRemoved: [] });
    					}
    				}
    			});
    		}
    	}, {
    		key: 'dispatchChanged',
    		value: function dispatchChanged(m) {
    			var _this4 = this;

    			if (!this.collections.hasOwnProperty(m.collection)) this.collections[m.collection] = [];
    			var i = this.collections[m.collection].findIndex(function (obj) {
    				return obj.id == m.id;
    			});
    			if (i > -1) {
    				var prev = (0, fullCopy_1.fullCopy)(this.collections[m.collection][i]);
    				var fields = {},
    				    fieldsChanged = {},
    				    fieldsRemoved = [];
    				if (m.fields) {
    					fieldsChanged = m.fields;
    					Object.keys(m.fields).map(function (p) {
    						fields[p] = 1;
    					});
    					Object.assign(this.collections[m.collection][i], m.fields);
    				}
    				if (m.cleared) {
    					fieldsRemoved = m.cleared;
    					m.cleared.forEach(function (fieldName) {
    						fields[fieldName] = 0;
    						delete _this4.collections[m.collection][i][fieldName];
    					});
    				}
    				var next = this.collections[m.collection][i];
    				this.onChangeFuncs.forEach(function (l) {
    					if (l.collection == m.collection) {
    						var hasFilter = l.hasOwnProperty('filter');
    						if (!hasFilter) {
    							l.f({ changed: { prev: prev, next: (0, fullCopy_1.fullCopy)(next), fields: fields, fieldsChanged: fieldsChanged, fieldsRemoved: fieldsRemoved }, added: false, removed: false });
    						} else {
    							var fCopyNext = (0, fullCopy_1.fullCopy)(next);
    							var prevFilter = l.filter(prev, i, _this4.collections[m.collection]);
    							var nextFilter = l.filter(fCopyNext, i, _this4.collections[m.collection]);
    							if (prevFilter || nextFilter) {
    								l.f({ prev: prev, next: fCopyNext, fields: fields, fieldsChanged: fieldsChanged, fieldsRemoved: fieldsRemoved, predicatePassed: [prevFilter, nextFilter] });
    							}
    						}
    					}
    				});
    			} else {
    				this.dispatchAdded(m);
    			}
    		}
    	}, {
    		key: 'dispatchRemoved',
    		value: function dispatchRemoved(m) {
    			var _this5 = this;

    			if (!this.collections.hasOwnProperty(m.collection)) this.collections[m.collection] = [];
    			var i = this.collections[m.collection].findIndex(function (obj) {
    				return obj.id == m.id;
    			});
    			if (i > -1) {
    				var removedObj = this.collections[m.collection].splice(i, 1)[0];
    				this.onChangeFuncs.forEach(function (l) {
    					if (l.collection == m.collection) {
    						var hasFilter = l.hasOwnProperty('filter');
    						if (!hasFilter) {
    							l.f({ changed: false, added: false, removed: removedObj });
    						} else {
    							if (l.filter(removedObj, i, _this5.collections[m.collection])) {
    								l.f({ prev: removedObj, next: false });
    							}
    						}
    					}
    				});
    			}
    		}
    	}, {
    		key: 'connect',
    		value: function connect() {
    			var _this6 = this;

    			this.willTryToReconnect = this._opts.autoReconnect === undefined ? true : this._opts.autoReconnect;
    			return new Promise(function (resolve, reject) {
    				if (!_this6.tryingToConnect) {
    					_this6.ddpConnection.connect();
    					_this6.tryingToConnect = true;
    				}
    				if (!_this6.connected) {
    					var connectionHandler = _this6.on('connected', function () {
    						connectionHandler.stop();
    						_this6.tryingToConnect = false;
    						resolve();
    					});
    				} else {
    					resolve();
    				}
    			});
    		}
    	}, {
    		key: 'disconnect',
    		value: function disconnect() {
    			var _this7 = this;

    			this.willTryToReconnect = false;
    			return new Promise(function (resolve, reject) {
    				if (!_this7.tryingToDisconnect) {
    					_this7.ddpConnection.disconnect();
    					_this7.tryingToDisconnect = true;
    				}
    				if (_this7.connected) {
    					var connectionHandler = _this7.on('disconnected', function () {
    						connectionHandler.stop();
    						_this7.tryingToDisconnect = false;
    						resolve();
    					});
    				} else {
    					resolve();
    				}
    			});
    		}
    	}, {
    		key: 'apply',
    		value: function apply(method, args) {
    			var _this8 = this;

    			var atBeginning = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

    			return new Promise(function (resolve, reject) {
    				var methodId = _this8.ddpConnection.method(method, args ? args : [], atBeginning);
    				var _self = _this8;

    				var stoppingInterval = void 0;

    				function onMethodResult(message) {
    					if (message.id == methodId) {
    						clearTimeout(stoppingInterval);
    						if (!message.error) {
    							resolve(message.result);
    						} else {
    							reject(message.error);
    						}
    						_self.ddpConnection.removeListener('result', onMethodResult);
    					}
    				}

    				_this8.ddpConnection.on("result", onMethodResult);

    				if (_this8.maxTimeout) {
    					stoppingInterval = setTimeout(function () {
    						_this8.ddpConnection.removeListener('result', onMethodResult);
    						reject(new Error());
    					}, _this8.maxTimeout);
    				}
    			});
    		}
    	}, {
    		key: 'call',
    		value: function call(method) {
    			for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
    				args[_key2 - 1] = arguments[_key2];
    			}

    			return this.apply(method, args);
    		}
    	}, {
    		key: 'sub',
    		value: function sub(pubname, args) {
    			var hasSuchSub = this.subs.find(function (sub) {
    				return sub.pubname == pubname && (0, isequal.isEqual)(sub.args, Array.isArray(args) ? args : []);
    			});
    			if (!hasSuchSub) {
    				var i = this.subs.push(new ddpSubscription_1.ddpSubscription(pubname, Array.isArray(args) ? args : [], this));
    				return this.subs[i - 1];
    			} else {
    				return hasSuchSub;
    			}
    		}
    	}, {
    		key: 'subscribe',
    		value: function subscribe(pubname) {
    			for (var _len3 = arguments.length, args = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
    				args[_key3 - 1] = arguments[_key3];
    			}

    			return this.sub(pubname, args);
    		}
    	}, {
    		key: 'on',
    		value: function on(event, f) {
    			return new ddpEventListener_1.ddpEventListener(event, f, this);
    		}
    	}, {
    		key: 'stopChangeListeners',
    		value: function stopChangeListeners() {
    			this.onChangeFuncs = [];
    		}
    	}, {
    		key: 'clearData',
    		value: function clearData() {
    			var _this9 = this;

    			return new Promise(function (resolve, reject) {
    				var totalDocuments = 0;
    				Object.keys(_this9.collections).forEach(function (collection) {
    					totalDocuments += Array.isArray(_this9.collections[collection]) ? _this9.collections[collection].length : 0;
    				});

    				if (totalDocuments === 0) {
    					resolve();
    				} else {
    					var counter = 0;
    					var uniqueId = _this9._id + "-" + _this9._opGenId();

    					var listener = _this9.on('removed', function (m, id) {
    						if (id == uniqueId) {
    							counter++;
    							if (counter == totalDocuments) {
    								listener.stop();
    								resolve();
    							}
    						}
    					});

    					Object.keys(_this9.collections).forEach(function (collection) {
    						_this9.collections[collection].forEach(function (doc) {
    							_this9.ddpConnection.emit('removed', {
    								msg: 'removed',
    								id: doc.id,
    								collection: collection
    							}, uniqueId);
    						});
    					});
    				}
    			});
    		}
    	}, {
    		key: 'importData',
    		value: function importData(data) {
    			var _this10 = this;

    			return new Promise(function (resolve, reject) {
    				var c = typeof data === 'string' ? _ejson2.default.parse(data) : data;

    				var totalDocuments = 0;
    				Object.keys(c).forEach(function (collection) {
    					totalDocuments += Array.isArray(c[collection]) ? c[collection].length : 0;
    				});

    				var counter = 0;
    				var uniqueId = _this10._id + "-" + _this10._opGenId();

    				var listener = _this10.on('added', function (m, id) {
    					if (id == uniqueId) {
    						counter++;
    						if (counter == totalDocuments) {
    							listener.stop();
    							resolve();
    						}
    					}
    				});

    				Object.keys(c).forEach(function (collection) {
    					c[collection].forEach(function (doc) {

    						var docFields = Object.assign({}, doc);
    						delete docFields['id'];

    						_this10.ddpConnection.emit('added', {
    							msg: 'added',
    							id: doc.id,
    							collection: collection,
    							fields: docFields
    						}, uniqueId);
    					});
    				});
    			});
    		}
    	}, {
    		key: 'exportData',
    		value: function exportData(format) {
    			if (format === undefined || format == 'string') {
    				return _ejson2.default.stringify(this.collections);
    			} else if (format == 'raw') {
    				return (0, fullCopy_1.fullCopy)(this.collections);
    			}
    		}
    	}, {
    		key: 'markAsReady',
    		value: function markAsReady(subs) {
    			var _this11 = this;

    			return new Promise(function (resolve, reject) {
    				var uniqueId = _this11._id + "-" + _this11._opGenId();

    				_this11.ddpConnection.emit('ready', {
    					msg: 'ready',
    					subs: subs.map(function (sub) {
    						return sub._getId();
    					})
    				}, uniqueId);

    				var listener = _this11.on('ready', function (m, id) {
    					if (id == uniqueId) {
    						listener.stop();
    						resolve();
    					}
    				});
    			});
    		}
    	}]);

    	return simpleDDP;
    }();

    exports.default = simpleDDP;
    module.exports = exports.default;
    });

    var simpleDDP = /*@__PURE__*/getDefaultExportFromCjs(simpleddp);

    var main = createCommonjsModule(function (module, exports) {

    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.simpleDDPLogin = {
      init: function init() {
        var _this = this;

        this.userId = undefined;
        this._loggedIn = false;

        this.login = function (obj) {
          var atStart = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

          return new Promise(function (resolve, reject) {
            _this.apply('login', [obj], atStart).then(function (m) {
              if (m && m.id) {
                _this.userId = m.id;
                _this.token = m.token;
                _this._loggedIn = true;
                if (m.type == 'resume') {
                  _this.ddpConnection.emit('loginResume', m);
                } else {
                  _this.ddpConnection.emit('login', m);
                }
                resolve(m);
              } else {
                reject(m);
              }
            }, reject);
          });
        };

        this.logout = function () {
          return new Promise(function (resolve, reject) {
            if (_this._loggedIn) {
              _this.apply('logout').then(function (m) {
                _this.userId = undefined;
                _this.token = undefined;
                _this._loggedIn = false;
                _this.ddpConnection.emit('logout');
                resolve();
              }, reject);
            } else {
              resolve();
            }
          });
        };

        this.logoutWhenDisconnectedEvent = this.on('disconnected', function (m) {
          if (_this.userId) {
            _this.ddpConnection.emit('loginSessionLost', _this.userId);
            _this.ddpConnection.pauseQueue();
          }

          _this._loggedIn = false;
        });

        this.clientReadyEvent = this.on('clientReady', function () {
          if (_this.userId) {
            _this.login({ resume: _this.token }, true).catch(function (m) {
              _this.ddpConnection.emit('loginResumeFailed', m);
            });
            _this.ddpConnection.continueQueue();
          }
        });
      }
    };
    });

    // https://github.com/maxogden/websocket-stream/blob/48dc3ddf943e5ada668c31ccd94e9186f02fafbd/ws-fallback.js

    var ws = null;

    if (typeof WebSocket !== 'undefined') {
      ws = WebSocket;
    } else if (typeof MozWebSocket !== 'undefined') {
      ws = MozWebSocket;
    } else if (typeof commonjsGlobal !== 'undefined') {
      ws = commonjsGlobal.WebSocket || commonjsGlobal.MozWebSocket;
    } else if (typeof window !== 'undefined') {
      ws = window.WebSocket || window.MozWebSocket;
    } else if (typeof self !== 'undefined') {
      ws = self.WebSocket || self.MozWebSocket;
    }

    var browser = ws;

    const subscriber_queue = [];
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = [];
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (let i = 0; i < subscribers.length; i += 1) {
                        const s = subscribers[i];
                        s[1]();
                        subscriber_queue.push(s, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.push(subscriber);
            if (subscribers.length === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                const index = subscribers.indexOf(subscriber);
                if (index !== -1) {
                    subscribers.splice(index, 1);
                }
                if (subscribers.length === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }

    var CameraSource;
    (function (CameraSource) {
        CameraSource["Prompt"] = "PROMPT";
        CameraSource["Camera"] = "CAMERA";
        CameraSource["Photos"] = "PHOTOS";
    })(CameraSource || (CameraSource = {}));
    var CameraDirection;
    (function (CameraDirection) {
        CameraDirection["Rear"] = "REAR";
        CameraDirection["Front"] = "FRONT";
    })(CameraDirection || (CameraDirection = {}));
    var CameraResultType;
    (function (CameraResultType) {
        CameraResultType["Uri"] = "uri";
        CameraResultType["Base64"] = "base64";
        CameraResultType["DataUrl"] = "dataUrl";
    })(CameraResultType || (CameraResultType = {}));
    var FilesystemDirectory;
    (function (FilesystemDirectory) {
        /**
         * The Documents directory
         * On iOS it's the app's documents directory.
         * Use this directory to store user-generated content.
         * On Android it's the Public Documents folder, so it's accessible from other apps.
         * It's not accesible on Android 10 unless the app enables legacy External Storage
         * by adding `android:requestLegacyExternalStorage="true"` in the `application` tag
         * in the `AndroidManifest.xml`
         */
        FilesystemDirectory["Documents"] = "DOCUMENTS";
        /**
         * The Data directory
         * On iOS it will use the Documents directory
         * On Android it's the directory holding application files.
         * Files will be deleted when the application is uninstalled.
         */
        FilesystemDirectory["Data"] = "DATA";
        /**
         * The Cache directory
         * Can be deleted in cases of low memory, so use this directory to write app-specific files
         * that your app can re-create easily.
         */
        FilesystemDirectory["Cache"] = "CACHE";
        /**
         * The external directory
         * On iOS it will use the Documents directory
         * On Android it's the directory on the primary shared/external
         * storage device where the application can place persistent files it owns.
         * These files are internal to the applications, and not typically visible
         * to the user as media.
         * Files will be deleted when the application is uninstalled.
         */
        FilesystemDirectory["External"] = "EXTERNAL";
        /**
         * The external storage directory
         * On iOS it will use the Documents directory
         * On Android it's the primary shared/external storage directory.
         * It's not accesible on Android 10 unless the app enables legacy External Storage
         * by adding `android:requestLegacyExternalStorage="true"` in the `application` tag
         * in the `AndroidManifest.xml`
         */
        FilesystemDirectory["ExternalStorage"] = "EXTERNAL_STORAGE";
    })(FilesystemDirectory || (FilesystemDirectory = {}));
    var FilesystemEncoding;
    (function (FilesystemEncoding) {
        FilesystemEncoding["UTF8"] = "utf8";
        FilesystemEncoding["ASCII"] = "ascii";
        FilesystemEncoding["UTF16"] = "utf16";
    })(FilesystemEncoding || (FilesystemEncoding = {}));
    var HapticsImpactStyle;
    (function (HapticsImpactStyle) {
        HapticsImpactStyle["Heavy"] = "HEAVY";
        HapticsImpactStyle["Medium"] = "MEDIUM";
        HapticsImpactStyle["Light"] = "LIGHT";
    })(HapticsImpactStyle || (HapticsImpactStyle = {}));
    var HapticsNotificationType;
    (function (HapticsNotificationType) {
        HapticsNotificationType["SUCCESS"] = "SUCCESS";
        HapticsNotificationType["WARNING"] = "WARNING";
        HapticsNotificationType["ERROR"] = "ERROR";
    })(HapticsNotificationType || (HapticsNotificationType = {}));
    var KeyboardStyle;
    (function (KeyboardStyle) {
        KeyboardStyle["Dark"] = "DARK";
        KeyboardStyle["Light"] = "LIGHT";
    })(KeyboardStyle || (KeyboardStyle = {}));
    var KeyboardResize;
    (function (KeyboardResize) {
        KeyboardResize["Body"] = "body";
        KeyboardResize["Ionic"] = "ionic";
        KeyboardResize["Native"] = "native";
        KeyboardResize["None"] = "none";
    })(KeyboardResize || (KeyboardResize = {}));
    var ActionSheetOptionStyle;
    (function (ActionSheetOptionStyle) {
        ActionSheetOptionStyle["Default"] = "DEFAULT";
        ActionSheetOptionStyle["Destructive"] = "DESTRUCTIVE";
        ActionSheetOptionStyle["Cancel"] = "CANCEL";
    })(ActionSheetOptionStyle || (ActionSheetOptionStyle = {}));
    //
    var PermissionType;
    (function (PermissionType) {
        PermissionType["Camera"] = "camera";
        PermissionType["Photos"] = "photos";
        PermissionType["Geolocation"] = "geolocation";
        PermissionType["Notifications"] = "notifications";
        PermissionType["ClipboardRead"] = "clipboard-read";
        PermissionType["ClipboardWrite"] = "clipboard-write";
        PermissionType["Microphone"] = "microphone";
    })(PermissionType || (PermissionType = {}));
    var PhotosAlbumType;
    (function (PhotosAlbumType) {
        /**
         * Album is a "smart" album (such as Favorites or Recently Added)
         */
        PhotosAlbumType["Smart"] = "smart";
        /**
         * Album is a cloud-shared album
         */
        PhotosAlbumType["Shared"] = "shared";
        /**
         * Album is a user-created album
         */
        PhotosAlbumType["User"] = "user";
    })(PhotosAlbumType || (PhotosAlbumType = {}));
    var StatusBarStyle;
    (function (StatusBarStyle) {
        /**
         * Light text for dark backgrounds.
         */
        StatusBarStyle["Dark"] = "DARK";
        /**
         * Dark text for light backgrounds.
         */
        StatusBarStyle["Light"] = "LIGHT";
    })(StatusBarStyle || (StatusBarStyle = {}));
    var StatusBarAnimation;
    (function (StatusBarAnimation) {
        /**
         * No animation during show/hide.
         */
        StatusBarAnimation["None"] = "NONE";
        /**
         * Slide animation during show/hide.
         */
        StatusBarAnimation["Slide"] = "SLIDE";
        /**
         * Fade animation during show/hide.
         */
        StatusBarAnimation["Fade"] = "FADE";
    })(StatusBarAnimation || (StatusBarAnimation = {}));

    var CapacitorWeb = /** @class */ (function () {
        function CapacitorWeb() {
            var _this = this;
            this.platform = 'web';
            this.isNative = false;
            // Need to assign here to avoid having to define every plugin but still
            // get the typed benefits of the provided plugins in PluginRegistry
            this.Plugins = {};
            // Gracefully degrade in non-Proxy supporting engines, e.g. IE11. This
            // effectively means that trying to access an unavailable plugin will
            // locally throw, but this is still better than throwing a syntax error.
            if (typeof Proxy !== 'undefined') {
                // Build a proxy for the Plugins object that returns the "Noop Plugin"
                // if a plugin isn't available
                this.Plugins = new Proxy(this.Plugins, {
                    get: function (target, prop) {
                        if (typeof target[prop] === 'undefined') {
                            var thisRef_1 = _this;
                            return new Proxy({}, {
                                get: function (_target, _prop) {
                                    if (typeof _target[_prop] === 'undefined') {
                                        return thisRef_1.pluginMethodNoop.bind(thisRef_1, _target, _prop, prop);
                                    }
                                    else {
                                        return _target[_prop];
                                    }
                                }
                            });
                        }
                        else {
                            return target[prop];
                        }
                    }
                });
            }
        }
        CapacitorWeb.prototype.pluginMethodNoop = function (_target, _prop, pluginName) {
            return Promise.reject(pluginName + " does not have web implementation.");
        };
        CapacitorWeb.prototype.getPlatform = function () {
            return this.platform;
        };
        CapacitorWeb.prototype.isPluginAvailable = function (name) {
            return this.Plugins.hasOwnProperty(name);
        };
        CapacitorWeb.prototype.convertFileSrc = function (filePath) {
            return filePath;
        };
        CapacitorWeb.prototype.handleError = function (e) {
            console.error(e);
        };
        return CapacitorWeb;
    }());

    // Create our default Capacitor instance, which will be
    // overridden on native platforms
    var Capacitor$1 = (function (globalThis) {
        // Create a new CapacitorWeb instance if one doesn't already exist on globalThis
        // Ensure the global is assigned the same Capacitor instance,
        // then export Capacitor so it can be imported in other modules
        return globalThis.Capacitor = (globalThis.Capacitor || new CapacitorWeb());
    })(
    // figure out the current globalThis, such as "window", "self" or "global"
    // ensure errors are not thrown in an node SSR environment or web worker
    typeof self !== 'undefined' ? self : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : {});
    var Plugins = Capacitor$1.Plugins;

    var WebPluginRegistry = /** @class */ (function () {
        function WebPluginRegistry() {
            this.plugins = {};
            this.loadedPlugins = {};
        }
        WebPluginRegistry.prototype.addPlugin = function (plugin) {
            this.plugins[plugin.config.name] = plugin;
        };
        WebPluginRegistry.prototype.getPlugin = function (name) {
            return this.plugins[name];
        };
        WebPluginRegistry.prototype.loadPlugin = function (name) {
            var plugin = this.getPlugin(name);
            if (!plugin) {
                console.error("Unable to load web plugin " + name + ", no such plugin found.");
                return;
            }
            plugin.load();
        };
        WebPluginRegistry.prototype.getPlugins = function () {
            var p = [];
            for (var name_1 in this.plugins) {
                p.push(this.plugins[name_1]);
            }
            return p;
        };
        return WebPluginRegistry;
    }());
    var WebPlugins = new WebPluginRegistry();
    var WebPlugin = /** @class */ (function () {
        function WebPlugin(config, pluginRegistry) {
            this.config = config;
            this.loaded = false;
            this.listeners = {};
            this.windowListeners = {};
            if (!pluginRegistry) {
                WebPlugins.addPlugin(this);
            }
            else {
                pluginRegistry.addPlugin(this);
            }
        }
        WebPlugin.prototype.addWindowListener = function (handle) {
            window.addEventListener(handle.windowEventName, handle.handler);
            handle.registered = true;
        };
        WebPlugin.prototype.removeWindowListener = function (handle) {
            if (!handle) {
                return;
            }
            window.removeEventListener(handle.windowEventName, handle.handler);
            handle.registered = false;
        };
        WebPlugin.prototype.addListener = function (eventName, listenerFunc) {
            var _this = this;
            var listeners = this.listeners[eventName];
            if (!listeners) {
                this.listeners[eventName] = [];
            }
            this.listeners[eventName].push(listenerFunc);
            // If we haven't added a window listener for this event and it requires one,
            // go ahead and add it
            var windowListener = this.windowListeners[eventName];
            if (windowListener && !windowListener.registered) {
                this.addWindowListener(windowListener);
            }
            return {
                remove: function () {
                    _this.removeListener(eventName, listenerFunc);
                }
            };
        };
        WebPlugin.prototype.removeListener = function (eventName, listenerFunc) {
            var listeners = this.listeners[eventName];
            if (!listeners) {
                return;
            }
            var index = listeners.indexOf(listenerFunc);
            this.listeners[eventName].splice(index, 1);
            // If there are no more listeners for this type of event,
            // remove the window listener
            if (!this.listeners[eventName].length) {
                this.removeWindowListener(this.windowListeners[eventName]);
            }
        };
        WebPlugin.prototype.removeAllListeners = function () {
            this.listeners = {};
            for (var listener in this.windowListeners) {
                this.removeWindowListener(this.windowListeners[listener]);
            }
            this.windowListeners = {};
        };
        WebPlugin.prototype.notifyListeners = function (eventName, data) {
            var listeners = this.listeners[eventName];
            if (listeners) {
                listeners.forEach(function (listener) { return listener(data); });
            }
        };
        WebPlugin.prototype.hasListeners = function (eventName) {
            return !!this.listeners[eventName].length;
        };
        WebPlugin.prototype.registerWindowListener = function (windowEventName, pluginEventName) {
            var _this = this;
            this.windowListeners[pluginEventName] = {
                registered: false,
                windowEventName: windowEventName,
                pluginEventName: pluginEventName,
                handler: function (event) {
                    _this.notifyListeners(pluginEventName, event);
                }
            };
        };
        WebPlugin.prototype.requestPermissions = function () {
            if (Capacitor.isNative) {
                return Capacitor.nativePromise(this.config.name, 'requestPermissions', {});
            }
            else {
                return Promise.resolve({ results: [] });
            }
        };
        WebPlugin.prototype.load = function () {
            this.loaded = true;
        };
        return WebPlugin;
    }());
    var shouldMergeWebPlugin = function (plugin) {
        return plugin.config.platforms && plugin.config.platforms.indexOf(Capacitor.platform) >= 0;
    };
    /**
     * For all our known web plugins, merge them into the global plugins
     * registry if they aren't already existing. If they don't exist, that
     * means there's no existing native implementation for it.
     * @param knownPlugins the Capacitor.Plugins global registry.
     */
    var mergeWebPlugins = function (knownPlugins) {
        var plugins = WebPlugins.getPlugins();
        for (var _i = 0, plugins_1 = plugins; _i < plugins_1.length; _i++) {
            var plugin = plugins_1[_i];
            mergeWebPlugin(knownPlugins, plugin);
        }
    };
    var mergeWebPlugin = function (knownPlugins, plugin) {
        // If we already have a plugin registered (meaning it was defined in the native layer),
        // then we should only overwrite it if the corresponding web plugin activates on
        // a certain platform. For example: Geolocation uses the WebPlugin on Android but not iOS
        if (knownPlugins.hasOwnProperty(plugin.config.name) && !shouldMergeWebPlugin(plugin)) {
            return;
        }
        knownPlugins[plugin.config.name] = plugin;
    };

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    /* global Reflect, Promise */

    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };

    function __extends(d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    function __awaiter$1(thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    function __generator(thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (_) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    }

    var AccessibilityPluginWeb = /** @class */ (function (_super) {
        __extends(AccessibilityPluginWeb, _super);
        function AccessibilityPluginWeb() {
            return _super.call(this, {
                name: 'Accessibility',
                platforms: ['web']
            }) || this;
        }
        AccessibilityPluginWeb.prototype.isScreenReaderEnabled = function () {
            throw new Error('Feature not available in the browser');
        };
        AccessibilityPluginWeb.prototype.speak = function (options) {
            if (!('speechSynthesis' in window)) {
                return Promise.reject('Browser does not support the Speech Synthesis API');
            }
            var utterance = new SpeechSynthesisUtterance(options.value);
            if (options.language) {
                utterance.lang = options.language;
            }
            window.speechSynthesis.speak(utterance);
            return Promise.resolve();
        };
        return AccessibilityPluginWeb;
    }(WebPlugin));
    new AccessibilityPluginWeb();

    var AppPluginWeb = /** @class */ (function (_super) {
        __extends(AppPluginWeb, _super);
        function AppPluginWeb() {
            var _this = _super.call(this, {
                name: 'App',
                platforms: ['web']
            }) || this;
            if (typeof document !== 'undefined') {
                document.addEventListener('visibilitychange', _this.handleVisibilityChange.bind(_this), false);
            }
            return _this;
        }
        AppPluginWeb.prototype.exitApp = function () {
            throw new Error('Method not implemented.');
        };
        AppPluginWeb.prototype.canOpenUrl = function (_options) {
            return Promise.resolve({ value: true });
        };
        AppPluginWeb.prototype.openUrl = function (_options) {
            return Promise.resolve({ completed: true });
        };
        AppPluginWeb.prototype.getLaunchUrl = function () {
            return Promise.resolve({ url: '' });
        };
        AppPluginWeb.prototype.getState = function () {
            return Promise.resolve({ isActive: document.hidden !== true });
        };
        AppPluginWeb.prototype.handleVisibilityChange = function () {
            var data = {
                isActive: document.hidden !== true
            };
            this.notifyListeners('appStateChange', data);
        };
        return AppPluginWeb;
    }(WebPlugin));
    new AppPluginWeb();

    var BrowserPluginWeb = /** @class */ (function (_super) {
        __extends(BrowserPluginWeb, _super);
        function BrowserPluginWeb() {
            return _super.call(this, {
                name: 'Browser',
                platforms: ['web']
            }) || this;
        }
        BrowserPluginWeb.prototype.open = function (options) {
            return __awaiter$1(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    this._lastWindow = window.open(options.url, options.windowName || '_blank');
                    return [2 /*return*/, Promise.resolve()];
                });
            });
        };
        BrowserPluginWeb.prototype.prefetch = function (_options) {
            return __awaiter$1(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    // Does nothing
                    return [2 /*return*/, Promise.resolve()];
                });
            });
        };
        BrowserPluginWeb.prototype.close = function () {
            return __awaiter$1(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    this._lastWindow && this._lastWindow.close();
                    return [2 /*return*/, Promise.resolve()];
                });
            });
        };
        return BrowserPluginWeb;
    }(WebPlugin));
    new BrowserPluginWeb();

    var CameraPluginWeb = /** @class */ (function (_super) {
        __extends(CameraPluginWeb, _super);
        function CameraPluginWeb() {
            return _super.call(this, {
                name: 'Camera',
                platforms: ['web']
            }) || this;
        }
        CameraPluginWeb.prototype.getPhoto = function (options) {
            return __awaiter$1(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter$1(_this, void 0, void 0, function () {
                            var cameraModal_1;
                            var _this = this;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (!options.webUseInput) return [3 /*break*/, 1];
                                        this.fileInputExperience(options, resolve);
                                        return [3 /*break*/, 7];
                                    case 1:
                                        if (!customElements.get('pwa-camera-modal')) return [3 /*break*/, 6];
                                        cameraModal_1 = document.createElement('pwa-camera-modal');
                                        document.body.appendChild(cameraModal_1);
                                        _a.label = 2;
                                    case 2:
                                        _a.trys.push([2, 4, , 5]);
                                        return [4 /*yield*/, cameraModal_1.componentOnReady()];
                                    case 3:
                                        _a.sent();
                                        cameraModal_1.addEventListener('onPhoto', function (e) { return __awaiter$1(_this, void 0, void 0, function () {
                                            var photo, _a;
                                            return __generator(this, function (_b) {
                                                switch (_b.label) {
                                                    case 0:
                                                        photo = e.detail;
                                                        if (!(photo === null)) return [3 /*break*/, 1];
                                                        reject('User cancelled photos app');
                                                        return [3 /*break*/, 4];
                                                    case 1:
                                                        if (!(photo instanceof Error)) return [3 /*break*/, 2];
                                                        reject(photo.message);
                                                        return [3 /*break*/, 4];
                                                    case 2:
                                                        _a = resolve;
                                                        return [4 /*yield*/, this._getCameraPhoto(photo, options)];
                                                    case 3:
                                                        _a.apply(void 0, [_b.sent()]);
                                                        _b.label = 4;
                                                    case 4:
                                                        cameraModal_1.dismiss();
                                                        document.body.removeChild(cameraModal_1);
                                                        return [2 /*return*/];
                                                }
                                            });
                                        }); });
                                        cameraModal_1.present();
                                        return [3 /*break*/, 5];
                                    case 4:
                                        _a.sent();
                                        this.fileInputExperience(options, resolve);
                                        return [3 /*break*/, 5];
                                    case 5: return [3 /*break*/, 7];
                                    case 6:
                                        console.error("Unable to load PWA Element 'pwa-camera-modal'. See the docs: https://capacitorjs.com/docs/pwa-elements.");
                                        this.fileInputExperience(options, resolve);
                                        _a.label = 7;
                                    case 7: return [2 /*return*/];
                                }
                            });
                        }); })];
                });
            });
        };
        CameraPluginWeb.prototype.fileInputExperience = function (options, resolve) {
            var input = document.querySelector('#_capacitor-camera-input');
            var cleanup = function () {
                input.parentNode && input.parentNode.removeChild(input);
            };
            if (!input) {
                input = document.createElement('input');
                input.id = '_capacitor-camera-input';
                input.type = 'file';
                document.body.appendChild(input);
            }
            input.accept = 'image/*';
            input.capture = true;
            if (options.source === CameraSource.Photos || options.source === CameraSource.Prompt) {
                input.removeAttribute('capture');
            }
            else if (options.direction === CameraDirection.Front) {
                input.capture = 'user';
            }
            else if (options.direction === CameraDirection.Rear) {
                input.capture = 'environment';
            }
            input.addEventListener('change', function (_e) {
                var file = input.files[0];
                var format = 'jpeg';
                if (file.type === 'image/png') {
                    format = 'png';
                }
                else if (file.type === 'image/gif') {
                    format = 'gif';
                }
                if (options.resultType === CameraResultType.DataUrl || options.resultType === CameraResultType.Base64) {
                    var reader_1 = new FileReader();
                    reader_1.addEventListener('load', function () {
                        if (options.resultType === CameraResultType.DataUrl) {
                            resolve({
                                dataUrl: reader_1.result,
                                format: format
                            });
                        }
                        else if (options.resultType === CameraResultType.Base64) {
                            var b64 = reader_1.result.split(',')[1];
                            resolve({
                                base64String: b64,
                                format: format
                            });
                        }
                        cleanup();
                    });
                    reader_1.readAsDataURL(file);
                }
                else {
                    resolve({
                        webPath: URL.createObjectURL(file),
                        format: format
                    });
                    cleanup();
                }
            });
            input.click();
        };
        CameraPluginWeb.prototype._getCameraPhoto = function (photo, options) {
            return new Promise(function (resolve, reject) {
                var reader = new FileReader();
                var format = photo.type.split('/')[1];
                if (options.resultType === CameraResultType.Uri) {
                    resolve({
                        webPath: URL.createObjectURL(photo),
                        format: format
                    });
                }
                else {
                    reader.readAsDataURL(photo);
                    reader.onloadend = function () {
                        var r = reader.result;
                        if (options.resultType === CameraResultType.DataUrl) {
                            resolve({
                                dataUrl: r,
                                format: format
                            });
                        }
                        else {
                            resolve({
                                base64String: r.split(',')[1],
                                format: format
                            });
                        }
                    };
                    reader.onerror = function (e) {
                        reject(e);
                    };
                }
            });
        };
        return CameraPluginWeb;
    }(WebPlugin));
    new CameraPluginWeb();

    var ClipboardPluginWeb = /** @class */ (function (_super) {
        __extends(ClipboardPluginWeb, _super);
        function ClipboardPluginWeb() {
            return _super.call(this, {
                name: 'Clipboard',
                platforms: ['web']
            }) || this;
        }
        ClipboardPluginWeb.prototype.write = function (options) {
            return __awaiter$1(this, void 0, void 0, function () {
                var blob, clipboardItemInput;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (!navigator.clipboard) {
                                return [2 /*return*/, Promise.reject('Clipboard API not available in this browser')];
                            }
                            if (!(options.string !== undefined || options.url)) return [3 /*break*/, 2];
                            if (!navigator.clipboard.writeText) {
                                return [2 /*return*/, Promise.reject('Writting to clipboard not supported in this browser')];
                            }
                            return [4 /*yield*/, navigator.clipboard.writeText(options.string !== undefined ? options.string : options.url)];
                        case 1:
                            _b.sent();
                            return [3 /*break*/, 10];
                        case 2:
                            if (!options.image) return [3 /*break*/, 9];
                            if (!navigator.clipboard.write) {
                                return [2 /*return*/, Promise.reject('Setting images not supported in this browser')];
                            }
                            _b.label = 3;
                        case 3:
                            _b.trys.push([3, 7, , 8]);
                            return [4 /*yield*/, fetch(options.image)];
                        case 4: return [4 /*yield*/, (_b.sent()).blob()];
                        case 5:
                            blob = _b.sent();
                            clipboardItemInput = new ClipboardItem((_a = {}, _a[blob.type] = blob, _a));
                            return [4 /*yield*/, navigator.clipboard.write([clipboardItemInput])];
                        case 6:
                            _b.sent();
                            return [3 /*break*/, 8];
                        case 7:
                            _b.sent();
                            return [2 /*return*/, Promise.reject('Failed to write image')];
                        case 8: return [3 /*break*/, 10];
                        case 9: return [2 /*return*/, Promise.reject('Nothing to write')];
                        case 10: return [2 /*return*/, Promise.resolve()];
                    }
                });
            });
        };
        ClipboardPluginWeb.prototype.read = function () {
            return __awaiter$1(this, void 0, void 0, function () {
                var clipboardItems, type, clipboardBlob, data;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!navigator.clipboard) {
                                return [2 /*return*/, Promise.reject('Clipboard API not available in this browser')];
                            }
                            if (!!navigator.clipboard.read) return [3 /*break*/, 1];
                            if (!navigator.clipboard.readText) {
                                return [2 /*return*/, Promise.reject('Reading from clipboard not supported in this browser')];
                            }
                            return [2 /*return*/, this.readText()];
                        case 1:
                            _a.trys.push([1, 5, , 6]);
                            return [4 /*yield*/, navigator.clipboard.read()];
                        case 2:
                            clipboardItems = _a.sent();
                            type = clipboardItems[0].types[0];
                            return [4 /*yield*/, clipboardItems[0].getType(type)];
                        case 3:
                            clipboardBlob = _a.sent();
                            return [4 /*yield*/, this._getBlobData(clipboardBlob, type)];
                        case 4:
                            data = _a.sent();
                            return [2 /*return*/, Promise.resolve({ value: data, type: type })];
                        case 5:
                            _a.sent();
                            return [2 /*return*/, this.readText()];
                        case 6: return [2 /*return*/];
                    }
                });
            });
        };
        ClipboardPluginWeb.prototype.readText = function () {
            return __awaiter$1(this, void 0, void 0, function () {
                var text;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, navigator.clipboard.readText()];
                        case 1:
                            text = _a.sent();
                            return [2 /*return*/, Promise.resolve({ value: text, type: 'text/plain' })];
                    }
                });
            });
        };
        ClipboardPluginWeb.prototype._getBlobData = function (clipboardBlob, type) {
            return new Promise(function (resolve, reject) {
                var reader = new FileReader();
                if (type.includes('image')) {
                    reader.readAsDataURL(clipboardBlob);
                }
                else {
                    reader.readAsText(clipboardBlob);
                }
                reader.onloadend = function () {
                    var r = reader.result;
                    resolve(r);
                };
                reader.onerror = function (e) {
                    reject(e);
                };
            });
        };
        return ClipboardPluginWeb;
    }(WebPlugin));
    new ClipboardPluginWeb();

    var FilesystemPluginWeb = /** @class */ (function (_super) {
        __extends(FilesystemPluginWeb, _super);
        function FilesystemPluginWeb() {
            var _this = _super.call(this, {
                name: 'Filesystem',
                platforms: ['web']
            }) || this;
            _this.DEFAULT_DIRECTORY = FilesystemDirectory.Data;
            _this.DB_VERSION = 1;
            _this.DB_NAME = 'Disc';
            _this._writeCmds = ['add', 'put', 'delete'];
            return _this;
        }
        FilesystemPluginWeb.prototype.initDb = function () {
            return __awaiter$1(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    if (this._db !== undefined) {
                        return [2 /*return*/, this._db];
                    }
                    if (!('indexedDB' in window)) {
                        throw new Error('This browser doesn\'t support IndexedDB');
                    }
                    return [2 /*return*/, new Promise(function (resolve, reject) {
                            var request = indexedDB.open(_this.DB_NAME, _this.DB_VERSION);
                            request.onupgradeneeded = FilesystemPluginWeb.doUpgrade;
                            request.onsuccess = function () {
                                _this._db = request.result;
                                resolve(request.result);
                            };
                            request.onerror = function () { return reject(request.error); };
                            request.onblocked = function () {
                                console.warn('db blocked');
                            };
                        })];
                });
            });
        };
        FilesystemPluginWeb.doUpgrade = function (event) {
            var eventTarget = event.target;
            var db = eventTarget.result;
            switch (event.oldVersion) {
                case 0:
                case 1:
                default:
                    if (db.objectStoreNames.contains('FileStorage')) {
                        db.deleteObjectStore('FileStorage');
                    }
                    var store = db.createObjectStore('FileStorage', { keyPath: 'path' });
                    store.createIndex('by_folder', 'folder');
            }
        };
        FilesystemPluginWeb.prototype.dbRequest = function (cmd, args) {
            return __awaiter$1(this, void 0, void 0, function () {
                var readFlag;
                return __generator(this, function (_a) {
                    readFlag = this._writeCmds.indexOf(cmd) !== -1 ? 'readwrite' : 'readonly';
                    return [2 /*return*/, this.initDb()
                            .then(function (conn) {
                            return new Promise(function (resolve, reject) {
                                var tx = conn.transaction(['FileStorage'], readFlag);
                                var store = tx.objectStore('FileStorage');
                                var req = store[cmd].apply(store, args);
                                req.onsuccess = function () { return resolve(req.result); };
                                req.onerror = function () { return reject(req.error); };
                            });
                        })];
                });
            });
        };
        FilesystemPluginWeb.prototype.dbIndexRequest = function (indexName, cmd, args) {
            return __awaiter$1(this, void 0, void 0, function () {
                var readFlag;
                return __generator(this, function (_a) {
                    readFlag = this._writeCmds.indexOf(cmd) !== -1 ? 'readwrite' : 'readonly';
                    return [2 /*return*/, this.initDb()
                            .then(function (conn) {
                            return new Promise(function (resolve, reject) {
                                var tx = conn.transaction(['FileStorage'], readFlag);
                                var store = tx.objectStore('FileStorage');
                                var index = store.index(indexName);
                                var req = index[cmd].apply(index, args);
                                req.onsuccess = function () { return resolve(req.result); };
                                req.onerror = function () { return reject(req.error); };
                            });
                        })];
                });
            });
        };
        FilesystemPluginWeb.prototype.getPath = function (directory, uriPath) {
            directory = directory || this.DEFAULT_DIRECTORY;
            var cleanedUriPath = uriPath !== undefined ? uriPath.replace(/^[/]+|[/]+$/g, '') : '';
            var fsPath = '/' + directory;
            if (uriPath !== '')
                fsPath += '/' + cleanedUriPath;
            return fsPath;
        };
        FilesystemPluginWeb.prototype.clear = function () {
            return __awaiter$1(this, void 0, void 0, function () {
                var conn, tx, store;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.initDb()];
                        case 1:
                            conn = _a.sent();
                            tx = conn.transaction(['FileStorage'], 'readwrite');
                            store = tx.objectStore('FileStorage');
                            store.clear();
                            return [2 /*return*/, {}];
                    }
                });
            });
        };
        /**
         * Read a file from disk
         * @param options options for the file read
         * @return a promise that resolves with the read file data result
         */
        FilesystemPluginWeb.prototype.readFile = function (options) {
            return __awaiter$1(this, void 0, void 0, function () {
                var path, entry;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            path = this.getPath(options.directory, options.path);
                            return [4 /*yield*/, this.dbRequest('get', [path])];
                        case 1:
                            entry = _a.sent();
                            if (entry === undefined)
                                throw Error('File does not exist.');
                            return [2 /*return*/, { data: entry.content }];
                    }
                });
            });
        };
        /**
         * Write a file to disk in the specified location on device
         * @param options options for the file write
         * @return a promise that resolves with the file write result
         */
        FilesystemPluginWeb.prototype.writeFile = function (options) {
            return __awaiter$1(this, void 0, void 0, function () {
                var path, data, doRecursive, occupiedEntry, encoding, parentPath, parentEntry, subDirIndex, parentArgPath, now, pathObj;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            path = this.getPath(options.directory, options.path);
                            data = options.data;
                            doRecursive = options.recursive;
                            return [4 /*yield*/, this.dbRequest('get', [path])];
                        case 1:
                            occupiedEntry = _a.sent();
                            if (occupiedEntry && occupiedEntry.type === 'directory')
                                throw ('The supplied path is a directory.');
                            encoding = options.encoding;
                            parentPath = path.substr(0, path.lastIndexOf('/'));
                            return [4 /*yield*/, this.dbRequest('get', [parentPath])];
                        case 2:
                            parentEntry = _a.sent();
                            if (!(parentEntry === undefined)) return [3 /*break*/, 4];
                            subDirIndex = parentPath.indexOf('/', 1);
                            if (!(subDirIndex !== -1)) return [3 /*break*/, 4];
                            parentArgPath = parentPath.substr(subDirIndex);
                            return [4 /*yield*/, this.mkdir({ path: parentArgPath, directory: options.directory, recursive: doRecursive })];
                        case 3:
                            _a.sent();
                            _a.label = 4;
                        case 4:
                            now = Date.now();
                            pathObj = {
                                path: path,
                                folder: parentPath,
                                type: 'file',
                                size: data.length,
                                ctime: now,
                                mtime: now,
                                content: !encoding && data.indexOf(',') >= 0 ? data.split(',')[1] : data,
                            };
                            return [4 /*yield*/, this.dbRequest('put', [pathObj])];
                        case 5:
                            _a.sent();
                            return [2 /*return*/, {
                                    uri: pathObj.path
                                }];
                    }
                });
            });
        };
        /**
         * Append to a file on disk in the specified location on device
         * @param options options for the file append
         * @return a promise that resolves with the file write result
         */
        FilesystemPluginWeb.prototype.appendFile = function (options) {
            return __awaiter$1(this, void 0, void 0, function () {
                var path, data, parentPath, now, ctime, occupiedEntry, parentEntry, subDirIndex, parentArgPath, pathObj;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            path = this.getPath(options.directory, options.path);
                            data = options.data;
                            parentPath = path.substr(0, path.lastIndexOf('/'));
                            now = Date.now();
                            ctime = now;
                            return [4 /*yield*/, this.dbRequest('get', [path])];
                        case 1:
                            occupiedEntry = _a.sent();
                            if (occupiedEntry && occupiedEntry.type === 'directory')
                                throw ('The supplied path is a directory.');
                            return [4 /*yield*/, this.dbRequest('get', [parentPath])];
                        case 2:
                            parentEntry = _a.sent();
                            if (!(parentEntry === undefined)) return [3 /*break*/, 4];
                            subDirIndex = parentPath.indexOf('/', 1);
                            if (!(subDirIndex !== -1)) return [3 /*break*/, 4];
                            parentArgPath = parentPath.substr(subDirIndex);
                            return [4 /*yield*/, this.mkdir({ path: parentArgPath, directory: options.directory, recursive: true })];
                        case 3:
                            _a.sent();
                            _a.label = 4;
                        case 4:
                            if (occupiedEntry !== undefined) {
                                data = occupiedEntry.content + data;
                                ctime = occupiedEntry.ctime;
                            }
                            pathObj = {
                                path: path,
                                folder: parentPath,
                                type: 'file',
                                size: data.length,
                                ctime: ctime,
                                mtime: now,
                                content: data
                            };
                            return [4 /*yield*/, this.dbRequest('put', [pathObj])];
                        case 5:
                            _a.sent();
                            return [2 /*return*/, {}];
                    }
                });
            });
        };
        /**
         * Delete a file from disk
         * @param options options for the file delete
         * @return a promise that resolves with the deleted file data result
         */
        FilesystemPluginWeb.prototype.deleteFile = function (options) {
            return __awaiter$1(this, void 0, void 0, function () {
                var path, entry, entries;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            path = this.getPath(options.directory, options.path);
                            return [4 /*yield*/, this.dbRequest('get', [path])];
                        case 1:
                            entry = _a.sent();
                            if (entry === undefined)
                                throw Error('File does not exist.');
                            return [4 /*yield*/, this.dbIndexRequest('by_folder', 'getAllKeys', [IDBKeyRange.only(path)])];
                        case 2:
                            entries = _a.sent();
                            if (entries.length !== 0)
                                throw Error('Folder is not empty.');
                            return [4 /*yield*/, this.dbRequest('delete', [path])];
                        case 3:
                            _a.sent();
                            return [2 /*return*/, {}];
                    }
                });
            });
        };
        /**
         * Create a directory.
         * @param options options for the mkdir
         * @return a promise that resolves with the mkdir result
         */
        FilesystemPluginWeb.prototype.mkdir = function (options) {
            return __awaiter$1(this, void 0, void 0, function () {
                var path, doRecursive, parentPath, depth, parentEntry, occupiedEntry, parentArgPath, now, pathObj;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            path = this.getPath(options.directory, options.path);
                            doRecursive = options.recursive;
                            parentPath = path.substr(0, path.lastIndexOf('/'));
                            depth = (path.match(/\//g) || []).length;
                            return [4 /*yield*/, this.dbRequest('get', [parentPath])];
                        case 1:
                            parentEntry = _a.sent();
                            return [4 /*yield*/, this.dbRequest('get', [path])];
                        case 2:
                            occupiedEntry = _a.sent();
                            if (depth === 1)
                                throw Error('Cannot create Root directory');
                            if (occupiedEntry !== undefined)
                                throw Error('Current directory does already exist.');
                            if (!doRecursive && depth !== 2 && parentEntry === undefined)
                                throw Error('Parent directory must exist');
                            if (!(doRecursive && depth !== 2 && parentEntry === undefined)) return [3 /*break*/, 4];
                            parentArgPath = parentPath.substr(parentPath.indexOf('/', 1));
                            return [4 /*yield*/, this.mkdir({
                                    path: parentArgPath,
                                    directory: options.directory,
                                    recursive: doRecursive
                                })];
                        case 3:
                            _a.sent();
                            _a.label = 4;
                        case 4:
                            now = Date.now();
                            pathObj = { path: path, folder: parentPath, type: 'directory', size: 0, ctime: now, mtime: now };
                            return [4 /*yield*/, this.dbRequest('put', [pathObj])];
                        case 5:
                            _a.sent();
                            return [2 /*return*/, {}];
                    }
                });
            });
        };
        /**
         * Remove a directory
         * @param options the options for the directory remove
         */
        FilesystemPluginWeb.prototype.rmdir = function (options) {
            return __awaiter$1(this, void 0, void 0, function () {
                var path, directory, recursive, fullPath, entry, readDirResult, _i, _a, entry_1, entryPath, entryObj;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            path = options.path, directory = options.directory, recursive = options.recursive;
                            fullPath = this.getPath(directory, path);
                            return [4 /*yield*/, this.dbRequest('get', [fullPath])];
                        case 1:
                            entry = _b.sent();
                            if (entry === undefined)
                                throw Error('Folder does not exist.');
                            if (entry.type !== 'directory')
                                throw Error('Requested path is not a directory');
                            return [4 /*yield*/, this.readdir({ path: path, directory: directory })];
                        case 2:
                            readDirResult = _b.sent();
                            if (readDirResult.files.length !== 0 && !recursive)
                                throw Error('Folder is not empty');
                            _i = 0, _a = readDirResult.files;
                            _b.label = 3;
                        case 3:
                            if (!(_i < _a.length)) return [3 /*break*/, 9];
                            entry_1 = _a[_i];
                            entryPath = path + "/" + entry_1;
                            return [4 /*yield*/, this.stat({ path: entryPath, directory: directory })];
                        case 4:
                            entryObj = _b.sent();
                            if (!(entryObj.type === 'file')) return [3 /*break*/, 6];
                            return [4 /*yield*/, this.deleteFile({ path: entryPath, directory: directory })];
                        case 5:
                            _b.sent();
                            return [3 /*break*/, 8];
                        case 6: return [4 /*yield*/, this.rmdir({ path: entryPath, directory: directory, recursive: recursive })];
                        case 7:
                            _b.sent();
                            _b.label = 8;
                        case 8:
                            _i++;
                            return [3 /*break*/, 3];
                        case 9: return [4 /*yield*/, this.dbRequest('delete', [fullPath])];
                        case 10:
                            _b.sent();
                            return [2 /*return*/, {}];
                    }
                });
            });
        };
        /**
         * Return a list of files from the directory (not recursive)
         * @param options the options for the readdir operation
         * @return a promise that resolves with the readdir directory listing result
         */
        FilesystemPluginWeb.prototype.readdir = function (options) {
            return __awaiter$1(this, void 0, void 0, function () {
                var path, entry, entries, names;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            path = this.getPath(options.directory, options.path);
                            return [4 /*yield*/, this.dbRequest('get', [path])];
                        case 1:
                            entry = _a.sent();
                            if (options.path !== '' && entry === undefined)
                                throw Error('Folder does not exist.');
                            return [4 /*yield*/, this.dbIndexRequest('by_folder', 'getAllKeys', [IDBKeyRange.only(path)])];
                        case 2:
                            entries = _a.sent();
                            names = entries.map(function (e) {
                                return e.substring(path.length + 1);
                            });
                            return [2 /*return*/, { files: names }];
                    }
                });
            });
        };
        /**
         * Return full File URI for a path and directory
         * @param options the options for the stat operation
         * @return a promise that resolves with the file stat result
         */
        FilesystemPluginWeb.prototype.getUri = function (options) {
            return __awaiter$1(this, void 0, void 0, function () {
                var path, entry;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            path = this.getPath(options.directory, options.path);
                            return [4 /*yield*/, this.dbRequest('get', [path])];
                        case 1:
                            entry = _a.sent();
                            if (!(entry === undefined)) return [3 /*break*/, 3];
                            return [4 /*yield*/, this.dbRequest('get', [path + '/'])];
                        case 2:
                            entry = (_a.sent());
                            _a.label = 3;
                        case 3:
                            if (entry === undefined)
                                throw Error('Entry does not exist.');
                            return [2 /*return*/, {
                                    uri: entry.path
                                }];
                    }
                });
            });
        };
        /**
         * Return data about a file
         * @param options the options for the stat operation
         * @return a promise that resolves with the file stat result
         */
        FilesystemPluginWeb.prototype.stat = function (options) {
            return __awaiter$1(this, void 0, void 0, function () {
                var path, entry;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            path = this.getPath(options.directory, options.path);
                            return [4 /*yield*/, this.dbRequest('get', [path])];
                        case 1:
                            entry = _a.sent();
                            if (!(entry === undefined)) return [3 /*break*/, 3];
                            return [4 /*yield*/, this.dbRequest('get', [path + '/'])];
                        case 2:
                            entry = (_a.sent());
                            _a.label = 3;
                        case 3:
                            if (entry === undefined)
                                throw Error('Entry does not exist.');
                            return [2 /*return*/, {
                                    type: entry.type,
                                    size: entry.size,
                                    ctime: entry.ctime,
                                    mtime: entry.mtime,
                                    uri: entry.path
                                }];
                    }
                });
            });
        };
        /**
         * Rename a file or directory
         * @param options the options for the rename operation
         * @return a promise that resolves with the rename result
         */
        FilesystemPluginWeb.prototype.rename = function (options) {
            return __awaiter$1(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this._copy(options, true)];
                });
            });
        };
        /**
         * Copy a file or directory
         * @param options the options for the copy operation
         * @return a promise that resolves with the copy result
         */
        FilesystemPluginWeb.prototype.copy = function (options) {
            return __awaiter$1(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this._copy(options, false)];
                });
            });
        };
        /**
         * Function that can perform a copy or a rename
         * @param options the options for the rename operation
         * @param doRename whether to perform a rename or copy operation
         * @return a promise that resolves with the result
         */
        FilesystemPluginWeb.prototype._copy = function (options, doRename) {
            if (doRename === void 0) { doRename = false; }
            return __awaiter$1(this, void 0, void 0, function () {
                var to, from, fromDirectory, toDirectory, fromPath, toPath, toObj, toPathComponents, toPath_1, toParentDirectory, fromObj, updateTime, _a, file, contents, _i, contents_1, filename;
                var _this = this;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            to = options.to, from = options.from, fromDirectory = options.directory, toDirectory = options.toDirectory;
                            if (!to || !from) {
                                throw Error('Both to and from must be provided');
                            }
                            // If no "to" directory is provided, use the "from" directory
                            if (!toDirectory) {
                                toDirectory = fromDirectory;
                            }
                            fromPath = this.getPath(fromDirectory, from);
                            toPath = this.getPath(toDirectory, to);
                            // Test that the "to" and "from" locations are different
                            if (fromPath === toPath) {
                                return [2 /*return*/, {}];
                            }
                            if (toPath.startsWith(fromPath)) {
                                throw Error('To path cannot contain the from path');
                            }
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 3, , 6]);
                            return [4 /*yield*/, this.stat({
                                    path: to,
                                    directory: toDirectory
                                })];
                        case 2:
                            toObj = _b.sent();
                            return [3 /*break*/, 6];
                        case 3:
                            _b.sent();
                            toPathComponents = to.split('/');
                            toPathComponents.pop();
                            toPath_1 = toPathComponents.join('/');
                            if (!(toPathComponents.length > 0)) return [3 /*break*/, 5];
                            return [4 /*yield*/, this.stat({
                                    path: toPath_1,
                                    directory: toDirectory,
                                })];
                        case 4:
                            toParentDirectory = _b.sent();
                            if (toParentDirectory.type !== 'directory') {
                                throw new Error('Parent directory of the to path is a file');
                            }
                            _b.label = 5;
                        case 5: return [3 /*break*/, 6];
                        case 6:
                            // Cannot overwrite a directory
                            if (toObj && toObj.type === 'directory') {
                                throw new Error('Cannot overwrite a directory with a file');
                            }
                            return [4 /*yield*/, this.stat({
                                    path: from,
                                    directory: fromDirectory,
                                })];
                        case 7:
                            fromObj = _b.sent();
                            updateTime = function (path, ctime, mtime) { return __awaiter$1(_this, void 0, void 0, function () {
                                var fullPath, entry;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            fullPath = this.getPath(toDirectory, path);
                                            return [4 /*yield*/, this.dbRequest('get', [fullPath])];
                                        case 1:
                                            entry = _a.sent();
                                            entry.ctime = ctime;
                                            entry.mtime = mtime;
                                            return [4 /*yield*/, this.dbRequest('put', [entry])];
                                        case 2:
                                            _a.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            }); };
                            _a = fromObj.type;
                            switch (_a) {
                                case 'file': return [3 /*break*/, 8];
                                case 'directory': return [3 /*break*/, 15];
                            }
                            return [3 /*break*/, 28];
                        case 8: return [4 /*yield*/, this.readFile({
                                path: from,
                                directory: fromDirectory
                            })];
                        case 9:
                            file = _b.sent();
                            if (!doRename) return [3 /*break*/, 11];
                            return [4 /*yield*/, this.deleteFile({
                                    path: from,
                                    directory: fromDirectory
                                })];
                        case 10:
                            _b.sent();
                            _b.label = 11;
                        case 11: 
                        // Write the file to the new location
                        return [4 /*yield*/, this.writeFile({
                                path: to,
                                directory: toDirectory,
                                data: file.data
                            })];
                        case 12:
                            // Write the file to the new location
                            _b.sent();
                            if (!doRename) return [3 /*break*/, 14];
                            return [4 /*yield*/, updateTime(to, fromObj.ctime, fromObj.mtime)];
                        case 13:
                            _b.sent();
                            _b.label = 14;
                        case 14: 
                        // Resolve promise
                        return [2 /*return*/, {}];
                        case 15:
                            if (toObj) {
                                throw Error('Cannot move a directory over an existing object');
                            }
                            _b.label = 16;
                        case 16:
                            _b.trys.push([16, 20, , 21]);
                            // Create the to directory
                            return [4 /*yield*/, this.mkdir({
                                    path: to,
                                    directory: toDirectory,
                                    recursive: false,
                                })];
                        case 17:
                            // Create the to directory
                            _b.sent();
                            if (!doRename) return [3 /*break*/, 19];
                            return [4 /*yield*/, updateTime(to, fromObj.ctime, fromObj.mtime)];
                        case 18:
                            _b.sent();
                            _b.label = 19;
                        case 19: return [3 /*break*/, 21];
                        case 20:
                            _b.sent();
                            return [3 /*break*/, 21];
                        case 21: return [4 /*yield*/, this.readdir({
                                path: from,
                                directory: fromDirectory,
                            })];
                        case 22:
                            contents = (_b.sent()).files;
                            _i = 0, contents_1 = contents;
                            _b.label = 23;
                        case 23:
                            if (!(_i < contents_1.length)) return [3 /*break*/, 26];
                            filename = contents_1[_i];
                            // Move item from the from directory to the to directory
                            return [4 /*yield*/, this._copy({
                                    from: from + "/" + filename,
                                    to: to + "/" + filename,
                                    directory: fromDirectory,
                                    toDirectory: toDirectory,
                                }, doRename)];
                        case 24:
                            // Move item from the from directory to the to directory
                            _b.sent();
                            _b.label = 25;
                        case 25:
                            _i++;
                            return [3 /*break*/, 23];
                        case 26:
                            if (!doRename) return [3 /*break*/, 28];
                            return [4 /*yield*/, this.rmdir({
                                    path: from,
                                    directory: fromDirectory
                                })];
                        case 27:
                            _b.sent();
                            _b.label = 28;
                        case 28: return [2 /*return*/, {}];
                    }
                });
            });
        };
        FilesystemPluginWeb._debug = true;
        return FilesystemPluginWeb;
    }(WebPlugin));
    new FilesystemPluginWeb();

    var extend = function (target) {
        var objs = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            objs[_i - 1] = arguments[_i];
        }
        objs.forEach(function (o) {
            if (o && typeof (o) === 'object') {
                for (var k in o) {
                    if (o.hasOwnProperty(k)) {
                        target[k] = o[k];
                    }
                }
            }
        });
        return target;
    };
    var uuid4 = function () {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    };

    var GeolocationPluginWeb = /** @class */ (function (_super) {
        __extends(GeolocationPluginWeb, _super);
        function GeolocationPluginWeb() {
            return _super.call(this, {
                name: 'Geolocation',
                platforms: ['web']
            }) || this;
        }
        GeolocationPluginWeb.prototype.getCurrentPosition = function (options) {
            var _this = this;
            return new Promise(function (resolve, reject) {
                return _this.requestPermissions().then(function (_result) {
                    window.navigator.geolocation.getCurrentPosition(function (pos) {
                        resolve(pos);
                    }, function (err) {
                        reject(err);
                    }, extend({
                        enableHighAccuracy: true,
                        timeout: 10000,
                        maximumAge: 0
                    }, options));
                });
            });
        };
        GeolocationPluginWeb.prototype.watchPosition = function (options, callback) {
            var id = window.navigator.geolocation.watchPosition(function (pos) {
                callback(pos);
            }, function (err) {
                callback(null, err);
            }, extend({
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }, options));
            return "" + id;
        };
        GeolocationPluginWeb.prototype.clearWatch = function (options) {
            window.navigator.geolocation.clearWatch(parseInt(options.id, 10));
            return Promise.resolve();
        };
        return GeolocationPluginWeb;
    }(WebPlugin));
    new GeolocationPluginWeb();

    var DevicePluginWeb = /** @class */ (function (_super) {
        __extends(DevicePluginWeb, _super);
        function DevicePluginWeb() {
            return _super.call(this, {
                name: 'Device',
                platforms: ['web']
            }) || this;
        }
        DevicePluginWeb.prototype.getInfo = function () {
            return __awaiter$1(this, void 0, void 0, function () {
                var ua, uaFields;
                return __generator(this, function (_a) {
                    ua = navigator.userAgent;
                    uaFields = this.parseUa(ua);
                    return [2 /*return*/, Promise.resolve({
                            model: uaFields.model,
                            platform: 'web',
                            appVersion: '',
                            appBuild: '',
                            appId: '',
                            appName: '',
                            operatingSystem: uaFields.operatingSystem,
                            osVersion: uaFields.osVersion,
                            manufacturer: navigator.vendor,
                            isVirtual: false,
                            uuid: this.getUid()
                        })];
                });
            });
        };
        DevicePluginWeb.prototype.getBatteryInfo = function () {
            return __awaiter$1(this, void 0, void 0, function () {
                var battery;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            battery = {};
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            return [4 /*yield*/, navigator.getBattery()];
                        case 2:
                            battery = _a.sent();
                            return [3 /*break*/, 4];
                        case 3:
                            _a.sent();
                            return [3 /*break*/, 4];
                        case 4: return [2 /*return*/, Promise.resolve({
                                batteryLevel: battery.level,
                                isCharging: battery.charging
                            })];
                    }
                });
            });
        };
        DevicePluginWeb.prototype.getLanguageCode = function () {
            return __awaiter$1(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, {
                            value: navigator.language
                        }];
                });
            });
        };
        DevicePluginWeb.prototype.parseUa = function (_ua) {
            var uaFields = {};
            var start = _ua.indexOf('(') + 1;
            var end = _ua.indexOf(') AppleWebKit');
            if (_ua.indexOf(') Gecko') !== -1) {
                end = _ua.indexOf(') Gecko');
            }
            var fields = _ua.substring(start, end);
            if (_ua.indexOf('Android') !== -1) {
                uaFields.model = fields.replace('; wv', '').split('; ').pop().split(' Build')[0];
                uaFields.osVersion = fields.split('; ')[1];
            }
            else {
                uaFields.model = fields.split('; ')[0];
                if (navigator.oscpu) {
                    uaFields.osVersion = navigator.oscpu;
                }
                else {
                    if (_ua.indexOf('Windows') !== -1) {
                        uaFields.osVersion = fields;
                    }
                    else {
                        var lastParts = fields.split('; ').pop().replace(' like Mac OS X', '').split(' ');
                        uaFields.osVersion = lastParts[lastParts.length - 1].replace(/_/g, '.');
                    }
                }
            }
            if (/android/i.test(_ua)) {
                uaFields.operatingSystem = 'android';
            }
            else if (/iPad|iPhone|iPod/.test(_ua) && !window.MSStream) {
                uaFields.operatingSystem = 'ios';
            }
            else if (/Win/.test(_ua)) {
                uaFields.operatingSystem = 'windows';
            }
            else if (/Mac/i.test(_ua)) {
                uaFields.operatingSystem = 'mac';
            }
            else {
                uaFields.operatingSystem = 'unknown';
            }
            return uaFields;
        };
        DevicePluginWeb.prototype.getUid = function () {
            var uid = window.localStorage.getItem('_capuid');
            if (uid) {
                return uid;
            }
            uid = uuid4();
            window.localStorage.setItem('_capuid', uid);
            return uid;
        };
        return DevicePluginWeb;
    }(WebPlugin));
    new DevicePluginWeb();

    var LocalNotificationsPluginWeb = /** @class */ (function (_super) {
        __extends(LocalNotificationsPluginWeb, _super);
        function LocalNotificationsPluginWeb() {
            var _this = _super.call(this, {
                name: 'LocalNotifications',
                platforms: ['web']
            }) || this;
            _this.pending = [];
            return _this;
        }
        LocalNotificationsPluginWeb.prototype.createChannel = function (channel) {
            throw new Error('Feature not available in the browser. ' + channel.id);
        };
        LocalNotificationsPluginWeb.prototype.deleteChannel = function (channel) {
            throw new Error('Feature not available in the browser. ' + channel.id);
        };
        LocalNotificationsPluginWeb.prototype.listChannels = function () {
            throw new Error('Feature not available in the browser');
        };
        LocalNotificationsPluginWeb.prototype.sendPending = function () {
            var _this = this;
            var toRemove = [];
            var now = +new Date;
            this.pending.forEach(function (localNotification) {
                if (localNotification.schedule && localNotification.schedule.at) {
                    if (+localNotification.schedule.at <= now) {
                        _this.buildNotification(localNotification);
                        toRemove.push(localNotification);
                    }
                }
            });
            console.log('Sent pending, removing', toRemove);
            this.pending = this.pending.filter(function (localNotification) { return !toRemove.find(function (ln) { return ln === localNotification; }); });
        };
        LocalNotificationsPluginWeb.prototype.sendNotification = function (localNotification) {
            var _this = this;
            var l = localNotification;
            if (localNotification.schedule && localNotification.schedule.at) {
                var diff = +localNotification.schedule.at - +new Date;
                this.pending.push(l);
                setTimeout(function () {
                    _this.sendPending();
                }, diff);
                return;
            }
            this.buildNotification(localNotification);
        };
        LocalNotificationsPluginWeb.prototype.buildNotification = function (localNotification) {
            var l = localNotification;
            return new Notification(l.title, {
                body: l.body
            });
        };
        LocalNotificationsPluginWeb.prototype.schedule = function (options) {
            var _this = this;
            var notifications = [];
            options.notifications.forEach(function (notification) {
                notifications.push(_this.sendNotification(notification));
            });
            return Promise.resolve({
                notifications: options.notifications.map(function (notification) { return { id: '' + notification.id }; })
            });
        };
        LocalNotificationsPluginWeb.prototype.getPending = function () {
            return Promise.resolve({
                notifications: this.pending.map(function (localNotification) {
                    return {
                        id: '' + localNotification.id
                    };
                })
            });
        };
        LocalNotificationsPluginWeb.prototype.registerActionTypes = function (_options) {
            throw new Error('Method not implemented.');
        };
        LocalNotificationsPluginWeb.prototype.cancel = function (pending) {
            console.log('Cancel these', pending);
            this.pending = this.pending.filter(function (localNotification) { return !pending.notifications.find(function (ln) { return ln.id === '' + localNotification.id; }); });
            return Promise.resolve();
        };
        LocalNotificationsPluginWeb.prototype.areEnabled = function () {
            return Promise.resolve({
                value: Notification.permission === 'granted'
            });
        };
        LocalNotificationsPluginWeb.prototype.requestPermission = function () {
            return new Promise(function (resolve) {
                Notification.requestPermission(function (result) {
                    var granted = true;
                    if (result === 'denied' || result === 'default') {
                        granted = false;
                    }
                    resolve({ granted: granted });
                });
            });
        };
        LocalNotificationsPluginWeb.prototype.requestPermissions = function () {
            return new Promise(function (resolve, reject) {
                Notification.requestPermission(function (result) {
                    if (result === 'denied' || result === 'default') {
                        reject(result);
                        return;
                    }
                    resolve({
                        results: [result]
                    });
                });
            });
        };
        return LocalNotificationsPluginWeb;
    }(WebPlugin));
    new LocalNotificationsPluginWeb();

    var SharePluginWeb = /** @class */ (function (_super) {
        __extends(SharePluginWeb, _super);
        function SharePluginWeb() {
            return _super.call(this, {
                name: 'Share',
                platforms: ['web']
            }) || this;
        }
        SharePluginWeb.prototype.share = function (options) {
            if (!navigator.share) {
                return Promise.reject('Web Share API not available');
            }
            return navigator.share({
                title: options.title,
                text: options.text,
                url: options.url
            });
        };
        return SharePluginWeb;
    }(WebPlugin));
    new SharePluginWeb();

    var ModalsPluginWeb = /** @class */ (function (_super) {
        __extends(ModalsPluginWeb, _super);
        function ModalsPluginWeb() {
            return _super.call(this, {
                name: 'Modals',
                platforms: ['web']
            }) || this;
        }
        ModalsPluginWeb.prototype.alert = function (options) {
            return __awaiter$1(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    window.alert(options.message);
                    return [2 /*return*/, Promise.resolve()];
                });
            });
        };
        ModalsPluginWeb.prototype.prompt = function (options) {
            return __awaiter$1(this, void 0, void 0, function () {
                var val;
                return __generator(this, function (_a) {
                    val = window.prompt(options.message, options.inputText || '');
                    return [2 /*return*/, Promise.resolve({
                            value: val,
                            cancelled: val === null
                        })];
                });
            });
        };
        ModalsPluginWeb.prototype.confirm = function (options) {
            return __awaiter$1(this, void 0, void 0, function () {
                var val;
                return __generator(this, function (_a) {
                    val = window.confirm(options.message);
                    return [2 /*return*/, Promise.resolve({
                            value: val
                        })];
                });
            });
        };
        ModalsPluginWeb.prototype.showActions = function (options) {
            return __awaiter$1(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    return [2 /*return*/, new Promise(function (resolve, _reject) { return __awaiter$1(_this, void 0, void 0, function () {
                            var actionSheet;
                            var _this = this;
                            return __generator(this, function (_a) {
                                actionSheet = document.querySelector('pwa-action-sheet');
                                if (!actionSheet) {
                                    actionSheet = document.createElement('pwa-action-sheet');
                                    document.body.appendChild(actionSheet);
                                }
                                actionSheet.header = options.title;
                                actionSheet.cancelable = false;
                                actionSheet.options = options.options;
                                actionSheet.addEventListener('onSelection', function (e) { return __awaiter$1(_this, void 0, void 0, function () {
                                    var selection;
                                    return __generator(this, function (_a) {
                                        selection = e.detail;
                                        resolve({
                                            index: selection
                                        });
                                        return [2 /*return*/];
                                    });
                                }); });
                                return [2 /*return*/];
                            });
                        }); })];
                });
            });
        };
        return ModalsPluginWeb;
    }(WebPlugin));
    new ModalsPluginWeb();

    var MotionPluginWeb = /** @class */ (function (_super) {
        __extends(MotionPluginWeb, _super);
        function MotionPluginWeb() {
            var _this = _super.call(this, {
                name: 'Motion'
            }) || this;
            _this.registerWindowListener('devicemotion', 'accel');
            _this.registerWindowListener('deviceorientation', 'orientation');
            return _this;
        }
        return MotionPluginWeb;
    }(WebPlugin));
    new MotionPluginWeb();

    var NetworkPluginWeb = /** @class */ (function (_super) {
        __extends(NetworkPluginWeb, _super);
        function NetworkPluginWeb() {
            var _this = _super.call(this, {
                name: 'Network',
                platforms: ['web']
            }) || this;
            _this.listenerFunction = null;
            return _this;
        }
        NetworkPluginWeb.prototype.getStatus = function () {
            return new Promise(function (resolve, reject) {
                if (!window.navigator) {
                    reject('Network info not available');
                    return;
                }
                var connected = window.navigator.onLine;
                var connection = window.navigator.connection || window.navigator.mozConnection || window.navigator.webkitConnection;
                var connectionType = connection ? (connection.type || connection.effectiveType) : 'wifi';
                resolve({
                    connected: connected,
                    connectionType: connected ? connectionType : 'none'
                });
            });
        };
        NetworkPluginWeb.prototype.addListener = function (eventName, listenerFunc) {
            var thisRef = this;
            var connection = window.navigator.connection || window.navigator.mozConnection || window.navigator.webkitConnection;
            var connectionType = connection ? (connection.type || connection.effectiveType) : 'wifi';
            var onlineBindFunc = listenerFunc.bind(thisRef, { connected: true, connectionType: connectionType });
            var offlineBindFunc = listenerFunc.bind(thisRef, { connected: false, connectionType: 'none' });
            if (eventName.localeCompare('networkStatusChange') === 0) {
                window.addEventListener('online', onlineBindFunc);
                window.addEventListener('offline', offlineBindFunc);
                return {
                    remove: function () {
                        window.removeEventListener('online', onlineBindFunc);
                        window.removeEventListener('offline', offlineBindFunc);
                    }
                };
            }
        };
        return NetworkPluginWeb;
    }(WebPlugin));
    new NetworkPluginWeb();

    var PermissionsPluginWeb = /** @class */ (function (_super) {
        __extends(PermissionsPluginWeb, _super);
        function PermissionsPluginWeb() {
            return _super.call(this, {
                name: 'Permissions'
            }) || this;
        }
        PermissionsPluginWeb.prototype.query = function (options) {
            return __awaiter$1(this, void 0, void 0, function () {
                var navigator, name, ret;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            navigator = window.navigator;
                            if (!navigator.permissions) {
                                return [2 /*return*/, Promise.reject('This browser does not support the Permissions API')];
                            }
                            name = options.name === PermissionType.Photos ? 'camera' : options.name;
                            return [4 /*yield*/, navigator.permissions.query({ name: name })];
                        case 1:
                            ret = _a.sent();
                            return [2 /*return*/, {
                                    state: ret.state
                                }];
                    }
                });
            });
        };
        return PermissionsPluginWeb;
    }(WebPlugin));
    new PermissionsPluginWeb();

    var SplashScreenPluginWeb = /** @class */ (function (_super) {
        __extends(SplashScreenPluginWeb, _super);
        function SplashScreenPluginWeb() {
            return _super.call(this, {
                name: 'SplashScreen',
                platforms: ['web']
            }) || this;
        }
        SplashScreenPluginWeb.prototype.show = function (_options, _callback) {
            return Promise.resolve();
        };
        SplashScreenPluginWeb.prototype.hide = function (_options, _callback) {
            return Promise.resolve();
        };
        return SplashScreenPluginWeb;
    }(WebPlugin));
    new SplashScreenPluginWeb();

    var StoragePluginWeb = /** @class */ (function (_super) {
        __extends(StoragePluginWeb, _super);
        function StoragePluginWeb() {
            var _this = _super.call(this, {
                name: 'Storage',
                platforms: ['web']
            }) || this;
            _this.KEY_PREFIX = '_cap_';
            return _this;
        }
        StoragePluginWeb.prototype.get = function (options) {
            var _this = this;
            return new Promise(function (resolve, _reject) {
                resolve({
                    value: window.localStorage.getItem(_this.makeKey(options.key))
                });
            });
        };
        StoragePluginWeb.prototype.set = function (options) {
            var _this = this;
            return new Promise(function (resolve, _reject) {
                window.localStorage.setItem(_this.makeKey(options.key), options.value);
                resolve();
            });
        };
        StoragePluginWeb.prototype.remove = function (options) {
            var _this = this;
            return new Promise(function (resolve, _reject) {
                window.localStorage.removeItem(_this.makeKey(options.key));
                resolve();
            });
        };
        StoragePluginWeb.prototype.keys = function () {
            var _this = this;
            return new Promise(function (resolve, _reject) {
                resolve({
                    keys: Object.keys(localStorage).filter(function (k) { return _this.isKey(k); }).map(function (k) { return _this.getKey(k); })
                });
            });
        };
        StoragePluginWeb.prototype.clear = function () {
            var _this = this;
            return new Promise(function (resolve, _reject) {
                Object.keys(localStorage)
                    .filter(function (k) { return _this.isKey(k); })
                    .forEach(function (k) { return window.localStorage.removeItem(k); });
                resolve();
            });
        };
        StoragePluginWeb.prototype.makeKey = function (key) {
            return this.KEY_PREFIX + key;
        };
        StoragePluginWeb.prototype.isKey = function (key) {
            return key.indexOf(this.KEY_PREFIX) === 0;
        };
        StoragePluginWeb.prototype.getKey = function (key) {
            return key.substr(this.KEY_PREFIX.length);
        };
        return StoragePluginWeb;
    }(WebPlugin));
    new StoragePluginWeb();

    var ToastPluginWeb = /** @class */ (function (_super) {
        __extends(ToastPluginWeb, _super);
        function ToastPluginWeb() {
            return _super.call(this, {
                name: 'Toast',
                platforms: ['web']
            }) || this;
        }
        ToastPluginWeb.prototype.show = function (options) {
            return __awaiter$1(this, void 0, void 0, function () {
                var duration, toast;
                return __generator(this, function (_a) {
                    duration = 2000;
                    if (options.duration) {
                        duration = options.duration === 'long' ? 3500 : 2000;
                    }
                    toast = document.createElement('pwa-toast');
                    toast.duration = duration;
                    toast.message = options.text;
                    document.body.appendChild(toast);
                    return [2 /*return*/];
                });
            });
        };
        return ToastPluginWeb;
    }(WebPlugin));
    new ToastPluginWeb();

    mergeWebPlugins(Plugins);
    var registerWebPlugin = function (plugin) {
        mergeWebPlugin(Plugins, plugin);
    };

    var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
    class HttpPluginWeb extends WebPlugin {
        constructor() {
            super({
                name: 'Http',
                platforms: ['web', 'electron'],
            });
        }
        getRequestHeader(headers, key) {
            const originalKeys = Object.keys(headers);
            const keys = Object.keys(headers).map(k => k.toLocaleLowerCase());
            const lowered = keys.reduce((newHeaders, key, index) => {
                newHeaders[key] = headers[originalKeys[index]];
                return newHeaders;
            }, {});
            return lowered[key.toLocaleLowerCase()];
        }
        nativeHeadersToObject(headers) {
            const h = {};
            headers.forEach((value, key) => {
                h[key] = value;
            });
            return h;
        }
        makeFetchOptions(options, fetchExtra) {
            const req = Object.assign({ method: options.method || 'GET', headers: options.headers }, (fetchExtra || {}));
            const contentType = this.getRequestHeader(options.headers || {}, 'content-type') || '';
            if (contentType.indexOf('application/json') === 0) {
                req['body'] = JSON.stringify(options.data);
            }
            else if (contentType.indexOf('application/x-www-form-urlencoded') === 0) {
                const urlSearchParams = new URLSearchParams();
                for (let key of Object.keys(options.data)) {
                    urlSearchParams.set(key, options.data[key]);
                }
                req['body'] = urlSearchParams.toString();
            }
            else if (contentType.indexOf('multipart/form-data') === 0 ||
                typeof options.data === 'object') {
                let formData = new FormData();
                for (let key of Object.keys(options.data)) {
                    formData.append(key, options.data[key]);
                }
                req['body'] = formData;
            }
            return req;
        }
        makeFetchParams(params) {
            if (!params)
                return null;
            return Object.entries(params).reduce((prev, [key, value]) => {
                const encodedValue = encodeURIComponent(value);
                const keyValue = `${key}=${encodedValue}`;
                return prev ? `${prev}&${keyValue}` : keyValue;
            }, '');
        }
        request(options) {
            return __awaiter(this, void 0, void 0, function* () {
                const fetchOptions = this.makeFetchOptions(options, options.webFetchExtra);
                const fetchParams = this.makeFetchParams(options.params);
                const fetchUrl = fetchParams
                    ? `${options.url}?${fetchParams}`
                    : options.url;
                const ret = yield fetch(fetchUrl, fetchOptions);
                const contentType = ret.headers.get('content-type');
                let data;
                if (contentType && contentType.indexOf('application/json') === 0) {
                    data = yield ret.json();
                }
                else {
                    data = yield ret.text();
                }
                return {
                    status: ret.status,
                    data,
                    headers: this.nativeHeadersToObject(ret.headers),
                    url: ret.url,
                };
            });
        }
        setCookie(options) {
            return __awaiter(this, void 0, void 0, function* () {
                var expires = '';
                if (options.expires) {
                    // remove "expires=" so you can pass with or without the prefix
                    expires = `; expires=${expires.replace('expires=', '')}`;
                }
                else if (options.ageDays) {
                    const date = new Date();
                    date.setTime(date.getTime() + options.ageDays * 24 * 60 * 60 * 1000);
                    expires = '; expires=' + date.toUTCString();
                }
                document.cookie =
                    options.key + '=' + (options.value || '') + expires + '; path=/';
            });
        }
        getCookies(_options) {
            return __awaiter(this, void 0, void 0, function* () {
                if (!document.cookie) {
                    return { value: [] };
                }
                var cookies = document.cookie.split(';');
                return {
                    value: cookies.map(c => {
                        const cParts = c.split(';').map(cv => cv.trim());
                        const cNameValue = cParts[0];
                        const cValueParts = cNameValue.split('=');
                        const key = cValueParts[0];
                        const value = cValueParts[1];
                        return {
                            key,
                            value,
                        };
                    }),
                };
            });
        }
        deleteCookie(options) {
            return __awaiter(this, void 0, void 0, function* () {
                document.cookie = options.key + '=; Max-Age=0';
            });
        }
        clearCookies(_options) {
            return __awaiter(this, void 0, void 0, function* () {
                document.cookie
                    .split(';')
                    .forEach(c => (document.cookie = c
                    .replace(/^ +/, '')
                    .replace(/=.*/, `=;expires=${new Date().toUTCString()};path=/`)));
            });
        }
        uploadFile(options) {
            return __awaiter(this, void 0, void 0, function* () {
                const fetchOptions = this.makeFetchOptions(options, options.webFetchExtra);
                const formData = new FormData();
                formData.append(options.name, options.blob);
                yield fetch(options.url, Object.assign(Object.assign({}, fetchOptions), { body: formData, method: 'POST' }));
                return {};
            });
        }
        downloadFile(options) {
            return __awaiter(this, void 0, void 0, function* () {
                const fetchOptions = this.makeFetchOptions(options, options.webFetchExtra);
                const ret = yield fetch(options.url, fetchOptions);
                const blob = yield ret.blob();
                return {
                    blob,
                };
            });
        }
    }
    const Http = new HttpPluginWeb();
    registerWebPlugin(Http);

    const { Filesystem } = Plugins;

    let filePath;
    let codePath;

    const readdir = async (path = "") => {
      try {
        let ret = await Filesystem.readdir({
          path,
          directory: FilesystemDirectory.Data
        });
        console.log("readdir", path, ret);
        if(ret.files.length) return true;
      } catch(e) {
        console.error('Unable to read dir', e);
      }
    };
     
    const downloadBundle = async (bundleZipURL) => {

      // delete bundle zip if there is already one 
      console.log("deleting old bundle...");
      try {
        await Filesystem.deleteFile({
          path: "bundle.zip",
          directory: FilesystemDirectory.Data
        });
      } catch(e) {
        console.log(e);
      }

      console.log("attempting download of " + bundleZipURL);

      // do the download and save the absolute paths
      try {
        const fileDownload = await Plugins.Http.downloadFile({
            url: bundleZipURL,
            filePath: 'bundle.zip',
            fileDirectory: FilesystemDirectory.Data
          });
        console.log("download complete: " + JSON.stringify(fileDownload));
        filePath = fileDownload.path;      
        codePath = filePath.replace(".zip", "");
      } catch(e) {
        console.log(JSON.stringify(e));
      }

      await readdir();
    };

    const unzipBundle = async () => {
      return new Promise((resolve, reject) => {

        // Handle the result of the process
        const StatusCallback = async (status) => {
            console.log("unzip done, status", status);     
            await readdir("/bundle");
            if(status == 0)
              resolve();
            else
              reject();
        };

        // Handle the progress of the decompression
        const ProgressCallback = (progressEvent) => {
            var percent =  Math.round((progressEvent.loaded / progressEvent.total) * 100);
            // Display progress in the console : 8% ...
            console.log(percent + "%");
        };

        // Unzip it !
        window.zip.unzip(filePath, codePath, StatusCallback, ProgressCallback);

      })
    };
      
    const activateBundle = async () => {
      
      Plugins.WebView.setServerBasePath({ path: codePath.replace("file://", "") });
      
      let serverBasePath = await Plugins.WebView.getServerBasePath();  
      console.log("serverBasePath", serverBasePath);    

      //Plugins.WebView.persistServerBasePath()
      // this would be nice, but on iOS the absolute path changes every time the app opens!!
    };

    const downloadAndActivateBundle = async (bundleZipURL) => {

      if(Capacitor$1.isNative) {
        await downloadBundle(bundleZipURL);
        await unzipBundle();
        await activateBundle();
      } else {
        console.log("we are in web context, skipping live reload");
      }
    };

    const checkDownloadedVersion = async () => {

      if(Capacitor$1.isNative) {
        console.log("looking for downloaded Bundle...");
        let json;
        if(await readdir("bundle")) {
          json = await Filesystem.readFile({
            path: "bundle/interkit.config.json",
            directory: FilesystemDirectory.Data,
            encoding: FilesystemEncoding.UTF8
          });
          //console.log(json?.data);
          if(json?.data) {
            try {
              let config = JSON.parse(json?.data);
              //console.log(config)
              //console.log("bundle version" + config.bundle_version)
              if(config.bundle_version) {
                return config.bundle_version;
              }
            } catch(e) {
              console.log("cannot parse config json", e);
            }
          }
        }
      } else {
         console.log("we are in web context, skipping check for downloaded bundle"); 
      }
      return null;
    };

    const activateInstalledBundle = async () => {

      let serverBasePath = await Plugins.WebView.getServerBasePath();  
      console.log("serverBasePath", serverBasePath);    
      
      // check if directory with new code already exists, create serverBasePath for us and switch over
      if(await readdir("bundle")) {
        console.log("found updated source code, creating serverBasePath...");
        let uri = await Filesystem.getUri({
          path: "bundle",
          directory: FilesystemDirectory.Data
        });
        console.log("uri", uri);
        Plugins.WebView.setServerBasePath({ path: uri.uri.replace("file://", "") });
      }
    };

    const InterkitLiveReload = {
      downloadAndActivateBundle,
      checkDownloadedVersion,
      activateInstalledBundle
    };

    var constants = createCommonjsModule(function (module, exports) {
    Object.defineProperty(exports,"__esModule",{value:true});exports.areaConversion=exports.timeConversion=exports.distanceConversion=exports.altitudeKeys=exports.latitudeKeys=exports.longitudeKeys=exports.MAXLON=exports.MINLON=exports.MAXLAT=exports.MINLAT=exports.earthRadius=exports.sexagesimalPattern=void 0;var sexagesimalPattern=/^([0-9]{1,3})°\s*([0-9]{1,3}(?:\.(?:[0-9]{1,}))?)['′]\s*(([0-9]{1,3}(\.([0-9]{1,}))?)["″]\s*)?([NEOSW]?)$/;exports.sexagesimalPattern=sexagesimalPattern;var earthRadius=6378137;exports.earthRadius=earthRadius;var MINLAT=-90;exports.MINLAT=MINLAT;var MAXLAT=90;exports.MAXLAT=MAXLAT;var MINLON=-180;exports.MINLON=MINLON;var MAXLON=180;exports.MAXLON=MAXLON;var longitudeKeys=["lng","lon","longitude",0];exports.longitudeKeys=longitudeKeys;var latitudeKeys=["lat","latitude",1];exports.latitudeKeys=latitudeKeys;var altitudeKeys=["alt","altitude","elevation","elev",2];exports.altitudeKeys=altitudeKeys;var distanceConversion={m:1,km:0.001,cm:100,mm:1000,mi:1/1609.344,sm:1/1852.216,ft:100/30.48,in:100/2.54,yd:1/0.9144};exports.distanceConversion=distanceConversion;var timeConversion={m:60,h:3600,d:86400};exports.timeConversion=timeConversion;var areaConversion={m2:1,km2:0.000001,ha:0.0001,a:0.01,ft2:10.763911,yd2:1.19599,in2:1550.0031};exports.areaConversion=areaConversion;areaConversion.sqm=areaConversion.m2;areaConversion.sqkm=areaConversion.km2;areaConversion.sqft=areaConversion.ft2;areaConversion.sqyd=areaConversion.yd2;areaConversion.sqin=areaConversion.in2;
    });

    var getCoordinateKey_1 = createCommonjsModule(function (module, exports) {
    Object.defineProperty(exports,"__esModule",{value:true});exports.default=void 0;var getCoordinateKey=function getCoordinateKey(point,keysToLookup){return keysToLookup.reduce(function(foundKey,key){if(typeof point==="undefined"||point===null){throw new Error("'".concat(point,"' is no valid coordinate."))}if(Object.prototype.hasOwnProperty.call(point,key)&&typeof key!=="undefined"&&typeof foundKey==="undefined"){foundKey=key;return key}return foundKey},undefined)};var _default=getCoordinateKey;exports.default=_default;
    });

    var isDecimal_1 = createCommonjsModule(function (module, exports) {
    Object.defineProperty(exports,"__esModule",{value:true});exports.default=void 0;var isDecimal=function isDecimal(value){var checkedValue=value.toString().trim();if(isNaN(parseFloat(checkedValue))){return false}return parseFloat(checkedValue)===Number(checkedValue)};var _default=isDecimal;exports.default=_default;
    });

    var isSexagesimal_1 = createCommonjsModule(function (module, exports) {
    Object.defineProperty(exports,"__esModule",{value:true});exports.default=void 0;var isSexagesimal=function isSexagesimal(value){return constants.sexagesimalPattern.test(value.toString().trim())};var _default=isSexagesimal;exports.default=_default;
    });

    var sexagesimalToDecimal_1 = createCommonjsModule(function (module, exports) {
    Object.defineProperty(exports,"__esModule",{value:true});exports.default=void 0;var sexagesimalToDecimal=function sexagesimalToDecimal(sexagesimal){var data=new RegExp(constants.sexagesimalPattern).exec(sexagesimal);if(typeof data==="undefined"||data===null){throw new Error("Given value is not in sexagesimal format")}var min=Number(data[2])/60||0;var sec=Number(data[4])/3600||0;var decimal=parseFloat(data[1])+min+sec;return ["S","W"].includes(data[7])?-decimal:decimal};var _default=sexagesimalToDecimal;exports.default=_default;
    });

    var getCoordinateKeys_1 = createCommonjsModule(function (module, exports) {
    Object.defineProperty(exports,"__esModule",{value:true});exports.default=void 0;var _getCoordinateKey=_interopRequireDefault(getCoordinateKey_1);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj}}function ownKeys(object,enumerableOnly){var keys=Object.keys(object);if(Object.getOwnPropertySymbols){var symbols=Object.getOwnPropertySymbols(object);if(enumerableOnly)symbols=symbols.filter(function(sym){return Object.getOwnPropertyDescriptor(object,sym).enumerable});keys.push.apply(keys,symbols);}return keys}function _objectSpread(target){for(var i=1;i<arguments.length;i++){var source=arguments[i]!=null?arguments[i]:{};if(i%2){ownKeys(Object(source),true).forEach(function(key){_defineProperty(target,key,source[key]);});}else if(Object.getOwnPropertyDescriptors){Object.defineProperties(target,Object.getOwnPropertyDescriptors(source));}else {ownKeys(Object(source)).forEach(function(key){Object.defineProperty(target,key,Object.getOwnPropertyDescriptor(source,key));});}}return target}function _defineProperty(obj,key,value){if(key in obj){Object.defineProperty(obj,key,{value:value,enumerable:true,configurable:true,writable:true});}else {obj[key]=value;}return obj}var getCoordinateKeys=function getCoordinateKeys(point){var keysToLookup=arguments.length>1&&arguments[1]!==undefined?arguments[1]:{longitude:constants.longitudeKeys,latitude:constants.latitudeKeys,altitude:constants.altitudeKeys};var longitude=(0, _getCoordinateKey.default)(point,keysToLookup.longitude);var latitude=(0, _getCoordinateKey.default)(point,keysToLookup.latitude);var altitude=(0, _getCoordinateKey.default)(point,keysToLookup.altitude);return _objectSpread({latitude:latitude,longitude:longitude},altitude?{altitude:altitude}:{})};var _default=getCoordinateKeys;exports.default=_default;
    });

    var isValidLatitude_1 = createCommonjsModule(function (module, exports) {
    Object.defineProperty(exports,"__esModule",{value:true});exports.default=void 0;var _isDecimal=_interopRequireDefault(isDecimal_1);var _isSexagesimal=_interopRequireDefault(isSexagesimal_1);var _sexagesimalToDecimal=_interopRequireDefault(sexagesimalToDecimal_1);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj}}var isValidLatitude=function isValidLatitude(value){if((0, _isDecimal.default)(value)){if(parseFloat(value)>constants.MAXLAT||value<constants.MINLAT){return false}return true}if((0, _isSexagesimal.default)(value)){return isValidLatitude((0, _sexagesimalToDecimal.default)(value))}return false};var _default=isValidLatitude;exports.default=_default;
    });

    var isValidLongitude_1 = createCommonjsModule(function (module, exports) {
    Object.defineProperty(exports,"__esModule",{value:true});exports.default=void 0;var _isDecimal=_interopRequireDefault(isDecimal_1);var _isSexagesimal=_interopRequireDefault(isSexagesimal_1);var _sexagesimalToDecimal=_interopRequireDefault(sexagesimalToDecimal_1);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj}}var isValidLongitude=function isValidLongitude(value){if((0, _isDecimal.default)(value)){if(parseFloat(value)>constants.MAXLON||value<constants.MINLON){return false}return true}if((0, _isSexagesimal.default)(value)){return isValidLongitude((0, _sexagesimalToDecimal.default)(value))}return false};var _default=isValidLongitude;exports.default=_default;
    });

    var isValidCoordinate_1 = createCommonjsModule(function (module, exports) {
    Object.defineProperty(exports,"__esModule",{value:true});exports.default=void 0;var _getCoordinateKeys2=_interopRequireDefault(getCoordinateKeys_1);var _isValidLatitude=_interopRequireDefault(isValidLatitude_1);var _isValidLongitude=_interopRequireDefault(isValidLongitude_1);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj}}var isValidCoordinate=function isValidCoordinate(point){var _getCoordinateKeys=(0, _getCoordinateKeys2.default)(point),latitude=_getCoordinateKeys.latitude,longitude=_getCoordinateKeys.longitude;if(Array.isArray(point)&&point.length>=2){return (0, _isValidLongitude.default)(point[0])&&(0, _isValidLatitude.default)(point[1])}if(typeof latitude==="undefined"||typeof longitude==="undefined"){return false}var lon=point[longitude];var lat=point[latitude];if(typeof lat==="undefined"||typeof lon==="undefined"){return false}if((0, _isValidLatitude.default)(lat)===false||(0, _isValidLongitude.default)(lon)===false){return false}return true};var _default=isValidCoordinate;exports.default=_default;
    });

    var toDecimal_1 = createCommonjsModule(function (module, exports) {
    Object.defineProperty(exports,"__esModule",{value:true});exports.default=void 0;var _isDecimal=_interopRequireDefault(isDecimal_1);var _isSexagesimal=_interopRequireDefault(isSexagesimal_1);var _sexagesimalToDecimal=_interopRequireDefault(sexagesimalToDecimal_1);var _isValidCoordinate=_interopRequireDefault(isValidCoordinate_1);var _getCoordinateKeys=_interopRequireDefault(getCoordinateKeys_1);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj}}function ownKeys(object,enumerableOnly){var keys=Object.keys(object);if(Object.getOwnPropertySymbols){var symbols=Object.getOwnPropertySymbols(object);if(enumerableOnly)symbols=symbols.filter(function(sym){return Object.getOwnPropertyDescriptor(object,sym).enumerable});keys.push.apply(keys,symbols);}return keys}function _objectSpread(target){for(var i=1;i<arguments.length;i++){var source=arguments[i]!=null?arguments[i]:{};if(i%2){ownKeys(Object(source),true).forEach(function(key){_defineProperty(target,key,source[key]);});}else if(Object.getOwnPropertyDescriptors){Object.defineProperties(target,Object.getOwnPropertyDescriptors(source));}else {ownKeys(Object(source)).forEach(function(key){Object.defineProperty(target,key,Object.getOwnPropertyDescriptor(source,key));});}}return target}function _defineProperty(obj,key,value){if(key in obj){Object.defineProperty(obj,key,{value:value,enumerable:true,configurable:true,writable:true});}else {obj[key]=value;}return obj}var toDecimal=function toDecimal(value){if((0, _isDecimal.default)(value)){return Number(value)}if((0, _isSexagesimal.default)(value)){return (0, _sexagesimalToDecimal.default)(value)}if((0, _isValidCoordinate.default)(value)){var keys=(0, _getCoordinateKeys.default)(value);if(Array.isArray(value)){return value.map(function(v,index){return [0,1].includes(index)?toDecimal(v):v})}return _objectSpread(_objectSpread(_objectSpread({},value),keys.latitude&&_defineProperty({},keys.latitude,toDecimal(value[keys.latitude]))),keys.longitude&&_defineProperty({},keys.longitude,toDecimal(value[keys.longitude])))}if(Array.isArray(value)){return value.map(function(point){return (0, _isValidCoordinate.default)(point)?toDecimal(point):point})}return value};var _default=toDecimal;exports.default=_default;
    });

    var getLatitude_1 = createCommonjsModule(function (module, exports) {
    Object.defineProperty(exports,"__esModule",{value:true});exports.default=void 0;var _getCoordinateKey=_interopRequireDefault(getCoordinateKey_1);var _toDecimal=_interopRequireDefault(toDecimal_1);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj}}var getLatitude=function getLatitude(point,raw){var latKey=(0, _getCoordinateKey.default)(point,constants.latitudeKeys);if(typeof latKey==="undefined"||latKey===null){return}var value=point[latKey];return raw===true?value:(0, _toDecimal.default)(value)};var _default=getLatitude;exports.default=_default;
    });

    var getLongitude_1 = createCommonjsModule(function (module, exports) {
    Object.defineProperty(exports,"__esModule",{value:true});exports.default=void 0;var _getCoordinateKey=_interopRequireDefault(getCoordinateKey_1);var _toDecimal=_interopRequireDefault(toDecimal_1);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj}}var getLongitude=function getLongitude(point,raw){var latKey=(0, _getCoordinateKey.default)(point,constants.longitudeKeys);if(typeof latKey==="undefined"||latKey===null){return}var value=point[latKey];return raw===true?value:(0, _toDecimal.default)(value)};var _default=getLongitude;exports.default=_default;
    });

    var toRad_1 = createCommonjsModule(function (module, exports) {
    Object.defineProperty(exports,"__esModule",{value:true});exports.default=void 0;var toRad=function toRad(value){return value*Math.PI/180};var _default=toRad;exports.default=_default;
    });

    var toDeg_1 = createCommonjsModule(function (module, exports) {
    Object.defineProperty(exports,"__esModule",{value:true});exports.default=void 0;var toDeg=function toDeg(value){return value*180/Math.PI};var _default=toDeg;exports.default=_default;
    });

    var computeDestinationPoint_1 = createCommonjsModule(function (module, exports) {
    Object.defineProperty(exports,"__esModule",{value:true});exports.default=void 0;var _getLatitude=_interopRequireDefault(getLatitude_1);var _getLongitude=_interopRequireDefault(getLongitude_1);var _toRad=_interopRequireDefault(toRad_1);var _toDeg=_interopRequireDefault(toDeg_1);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj}}var computeDestinationPoint=function computeDestinationPoint(start,distance,bearing){var radius=arguments.length>3&&arguments[3]!==undefined?arguments[3]:6371000;var lat=(0, _getLatitude.default)(start);var lng=(0, _getLongitude.default)(start);var delta=distance/radius;var theta=(0, _toRad.default)(bearing);var phi1=(0, _toRad.default)(lat);var lambda1=(0, _toRad.default)(lng);var phi2=Math.asin(Math.sin(phi1)*Math.cos(delta)+Math.cos(phi1)*Math.sin(delta)*Math.cos(theta));var lambda2=lambda1+Math.atan2(Math.sin(theta)*Math.sin(delta)*Math.cos(phi1),Math.cos(delta)-Math.sin(phi1)*Math.sin(phi2));var longitude=(0, _toDeg.default)(lambda2);if(longitude<constants.MINLON||longitude>constants.MAXLON){lambda2=(lambda2+3*Math.PI)%(2*Math.PI)-Math.PI;longitude=(0, _toDeg.default)(lambda2);}return {latitude:(0, _toDeg.default)(phi2),longitude:longitude}};var _default=computeDestinationPoint;exports.default=_default;
    });

    var convertArea_1 = createCommonjsModule(function (module, exports) {
    Object.defineProperty(exports,"__esModule",{value:true});exports.default=void 0;var convertArea=function convertArea(squareMeters){var targetUnit=arguments.length>1&&arguments[1]!==undefined?arguments[1]:"m";var factor=constants.areaConversion[targetUnit];if(factor){return squareMeters*factor}throw new Error("Invalid unit used for area conversion.")};var _default=convertArea;exports.default=_default;
    });

    var convertDistance_1 = createCommonjsModule(function (module, exports) {
    Object.defineProperty(exports,"__esModule",{value:true});exports.default=void 0;var convertDistance=function convertDistance(meters){var targetUnit=arguments.length>1&&arguments[1]!==undefined?arguments[1]:"m";var factor=constants.distanceConversion[targetUnit];if(factor){return meters*factor}throw new Error("Invalid unit used for distance conversion.")};var _default=convertDistance;exports.default=_default;
    });

    var convertSpeed_1 = createCommonjsModule(function (module, exports) {
    Object.defineProperty(exports,"__esModule",{value:true});exports.default=void 0;var convertSpeed=function convertSpeed(metersPerSecond){var targetUnit=arguments.length>1&&arguments[1]!==undefined?arguments[1]:"kmh";switch(targetUnit){case"kmh":return metersPerSecond*constants.timeConversion.h*constants.distanceConversion.km;case"mph":return metersPerSecond*constants.timeConversion.h*constants.distanceConversion.mi;default:return metersPerSecond;}};var _default=convertSpeed;exports.default=_default;
    });

    var decimalToSexagesimal = createCommonjsModule(function (module, exports) {
    Object.defineProperty(exports,"__esModule",{value:true});exports.default=void 0;function _slicedToArray(arr,i){return _arrayWithHoles(arr)||_iterableToArrayLimit(arr,i)||_unsupportedIterableToArray(arr,i)||_nonIterableRest()}function _nonIterableRest(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function _unsupportedIterableToArray(o,minLen){if(!o)return;if(typeof o==="string")return _arrayLikeToArray(o,minLen);var n=Object.prototype.toString.call(o).slice(8,-1);if(n==="Object"&&o.constructor)n=o.constructor.name;if(n==="Map"||n==="Set")return Array.from(o);if(n==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return _arrayLikeToArray(o,minLen)}function _arrayLikeToArray(arr,len){if(len==null||len>arr.length)len=arr.length;for(var i=0,arr2=new Array(len);i<len;i++){arr2[i]=arr[i];}return arr2}function _iterableToArrayLimit(arr,i){if(typeof Symbol==="undefined"||!(Symbol.iterator in Object(arr)))return;var _arr=[];var _n=true;var _d=false;var _e=undefined;try{for(var _i=arr[Symbol.iterator](),_s;!(_n=(_s=_i.next()).done);_n=true){_arr.push(_s.value);if(i&&_arr.length===i)break}}catch(err){_d=true;_e=err;}finally{try{if(!_n&&_i["return"]!=null)_i["return"]();}finally{if(_d)throw _e}}return _arr}function _arrayWithHoles(arr){if(Array.isArray(arr))return arr}var imprecise=function imprecise(number){var factor=Math.pow(10,12);return Math.round(number*factor)/factor};var decimal2sexagesimal=function decimal2sexagesimal(decimal){var _decimal$toString$spl=decimal.toString().split("."),_decimal$toString$spl2=_slicedToArray(_decimal$toString$spl,2),pre=_decimal$toString$spl2[0],post=_decimal$toString$spl2[1];var deg=Math.abs(Number(pre));var minFull=imprecise(Number("0."+(post||0))*60);var min=Math.floor(minFull);var sec=imprecise((minFull%min||0)*60);return deg+"\xB0 "+Number(min.toFixed(6)).toString().split(".").map(function(v,i){return i===0?v.padStart(2,"0"):v}).join(".")+"' "+Number(sec.toFixed(4)).toString().split(".").map(function(v,i){return i===0?v.padStart(2,"0"):v}).join(".")+"\""};var _default=decimal2sexagesimal;exports.default=_default;
    });

    var robustAcos_1 = createCommonjsModule(function (module, exports) {
    Object.defineProperty(exports,"__esModule",{value:true});exports.default=void 0;var robustAcos=function robustAcos(value){if(value>1){return 1}if(value<-1){return -1}return value};var _default=robustAcos;exports.default=_default;
    });

    var getDistance_1 = createCommonjsModule(function (module, exports) {
    Object.defineProperty(exports,"__esModule",{value:true});exports.default=void 0;var _getLatitude=_interopRequireDefault(getLatitude_1);var _getLongitude=_interopRequireDefault(getLongitude_1);var _toRad=_interopRequireDefault(toRad_1);var _robustAcos=_interopRequireDefault(robustAcos_1);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj}}var getDistance=function getDistance(from,to){var accuracy=arguments.length>2&&arguments[2]!==undefined?arguments[2]:1;accuracy=typeof accuracy!=="undefined"&&!isNaN(accuracy)?accuracy:1;var fromLat=(0, _getLatitude.default)(from);var fromLon=(0, _getLongitude.default)(from);var toLat=(0, _getLatitude.default)(to);var toLon=(0, _getLongitude.default)(to);var distance=Math.acos((0, _robustAcos.default)(Math.sin((0, _toRad.default)(toLat))*Math.sin((0, _toRad.default)(fromLat))+Math.cos((0, _toRad.default)(toLat))*Math.cos((0, _toRad.default)(fromLat))*Math.cos((0, _toRad.default)(fromLon)-(0, _toRad.default)(toLon))))*constants.earthRadius;return Math.round(distance/accuracy)*accuracy};var _default=getDistance;exports.default=_default;
    });

    var orderByDistance_1 = createCommonjsModule(function (module, exports) {
    Object.defineProperty(exports,"__esModule",{value:true});exports.default=void 0;var _getDistance=_interopRequireDefault(getDistance_1);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj}}var orderByDistance=function orderByDistance(point,coords){var distanceFn=arguments.length>2&&arguments[2]!==undefined?arguments[2]:_getDistance.default;distanceFn=typeof distanceFn==="function"?distanceFn:_getDistance.default;return coords.slice().sort(function(a,b){return distanceFn(point,a)-distanceFn(point,b)})};var _default=orderByDistance;exports.default=_default;
    });

    var findNearest_1 = createCommonjsModule(function (module, exports) {
    Object.defineProperty(exports,"__esModule",{value:true});exports.default=void 0;var _orderByDistance=_interopRequireDefault(orderByDistance_1);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj}}var findNearest=function findNearest(point,coords){return (0, _orderByDistance.default)(point,coords)[0]};var _default=findNearest;exports.default=_default;
    });

    var getAreaOfPolygon_1 = createCommonjsModule(function (module, exports) {
    Object.defineProperty(exports,"__esModule",{value:true});exports.default=void 0;var _toRad=_interopRequireDefault(toRad_1);var _getLatitude=_interopRequireDefault(getLatitude_1);var _getLongitude=_interopRequireDefault(getLongitude_1);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj}}var getAreaOfPolygon=function getAreaOfPolygon(points){var area=0;if(points.length>2){var lowerIndex;var middleIndex;var upperIndex;for(var i=0;i<points.length;i++){if(i===points.length-2){lowerIndex=points.length-2;middleIndex=points.length-1;upperIndex=0;}else if(i===points.length-1){lowerIndex=points.length-1;middleIndex=0;upperIndex=1;}else {lowerIndex=i;middleIndex=i+1;upperIndex=i+2;}var p1lon=(0, _getLongitude.default)(points[lowerIndex]);var p2lat=(0, _getLatitude.default)(points[middleIndex]);var p3lon=(0, _getLongitude.default)(points[upperIndex]);area+=((0, _toRad.default)(p3lon)-(0, _toRad.default)(p1lon))*Math.sin((0, _toRad.default)(p2lat));}area=area*constants.earthRadius*constants.earthRadius/2;}return Math.abs(area)};var _default=getAreaOfPolygon;exports.default=_default;
    });

    var getBounds_1 = createCommonjsModule(function (module, exports) {
    Object.defineProperty(exports,"__esModule",{value:true});exports.default=void 0;var _getLatitude=_interopRequireDefault(getLatitude_1);var _getLongitude=_interopRequireDefault(getLongitude_1);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj}}var getBounds=function getBounds(points){if(Array.isArray(points)===false||points.length===0){throw new Error("No points were given.")}return points.reduce(function(stats,point){var latitude=(0, _getLatitude.default)(point);var longitude=(0, _getLongitude.default)(point);return {maxLat:Math.max(latitude,stats.maxLat),minLat:Math.min(latitude,stats.minLat),maxLng:Math.max(longitude,stats.maxLng),minLng:Math.min(longitude,stats.minLng)}},{maxLat:-Infinity,minLat:Infinity,maxLng:-Infinity,minLng:Infinity})};var _default=getBounds;exports.default=_default;
    });

    var getBoundsOfDistance_1 = createCommonjsModule(function (module, exports) {
    Object.defineProperty(exports,"__esModule",{value:true});exports.default=void 0;var _getLatitude=_interopRequireDefault(getLatitude_1);var _getLongitude=_interopRequireDefault(getLongitude_1);var _toRad=_interopRequireDefault(toRad_1);var _toDeg=_interopRequireDefault(toDeg_1);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj}}var getBoundsOfDistance=function getBoundsOfDistance(point,distance){var latitude=(0, _getLatitude.default)(point);var longitude=(0, _getLongitude.default)(point);var radLat=(0, _toRad.default)(latitude);var radLon=(0, _toRad.default)(longitude);var radDist=distance/constants.earthRadius;var minLat=radLat-radDist;var maxLat=radLat+radDist;var MAX_LAT_RAD=(0, _toRad.default)(constants.MAXLAT);var MIN_LAT_RAD=(0, _toRad.default)(constants.MINLAT);var MAX_LON_RAD=(0, _toRad.default)(constants.MAXLON);var MIN_LON_RAD=(0, _toRad.default)(constants.MINLON);var minLon;var maxLon;if(minLat>MIN_LAT_RAD&&maxLat<MAX_LAT_RAD){var deltaLon=Math.asin(Math.sin(radDist)/Math.cos(radLat));minLon=radLon-deltaLon;if(minLon<MIN_LON_RAD){minLon+=Math.PI*2;}maxLon=radLon+deltaLon;if(maxLon>MAX_LON_RAD){maxLon-=Math.PI*2;}}else {minLat=Math.max(minLat,MIN_LAT_RAD);maxLat=Math.min(maxLat,MAX_LAT_RAD);minLon=MIN_LON_RAD;maxLon=MAX_LON_RAD;}return [{latitude:(0, _toDeg.default)(minLat),longitude:(0, _toDeg.default)(minLon)},{latitude:(0, _toDeg.default)(maxLat),longitude:(0, _toDeg.default)(maxLon)}]};var _default=getBoundsOfDistance;exports.default=_default;
    });

    var getCenter_1 = createCommonjsModule(function (module, exports) {
    Object.defineProperty(exports,"__esModule",{value:true});exports.default=void 0;var _getLatitude=_interopRequireDefault(getLatitude_1);var _getLongitude=_interopRequireDefault(getLongitude_1);var _toRad=_interopRequireDefault(toRad_1);var _toDeg=_interopRequireDefault(toDeg_1);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj}}var getCenter=function getCenter(points){if(Array.isArray(points)===false||points.length===0){return false}var numberOfPoints=points.length;var sum=points.reduce(function(acc,point){var pointLat=(0, _toRad.default)((0, _getLatitude.default)(point));var pointLon=(0, _toRad.default)((0, _getLongitude.default)(point));return {X:acc.X+Math.cos(pointLat)*Math.cos(pointLon),Y:acc.Y+Math.cos(pointLat)*Math.sin(pointLon),Z:acc.Z+Math.sin(pointLat)}},{X:0,Y:0,Z:0});var X=sum.X/numberOfPoints;var Y=sum.Y/numberOfPoints;var Z=sum.Z/numberOfPoints;return {longitude:(0, _toDeg.default)(Math.atan2(Y,X)),latitude:(0, _toDeg.default)(Math.atan2(Z,Math.sqrt(X*X+Y*Y)))}};var _default=getCenter;exports.default=_default;
    });

    var getCenterOfBounds_1 = createCommonjsModule(function (module, exports) {
    Object.defineProperty(exports,"__esModule",{value:true});exports.default=void 0;var _getBounds=_interopRequireDefault(getBounds_1);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj}}var getCenterOfBounds=function getCenterOfBounds(coords){var bounds=(0, _getBounds.default)(coords);var latitude=bounds.minLat+(bounds.maxLat-bounds.minLat)/2;var longitude=bounds.minLng+(bounds.maxLng-bounds.minLng)/2;return {latitude:parseFloat(latitude.toFixed(6)),longitude:parseFloat(longitude.toFixed(6))}};var _default=getCenterOfBounds;exports.default=_default;
    });

    var getRhumbLineBearing_1 = createCommonjsModule(function (module, exports) {
    Object.defineProperty(exports,"__esModule",{value:true});exports.default=void 0;var _getLatitude=_interopRequireDefault(getLatitude_1);var _getLongitude=_interopRequireDefault(getLongitude_1);var _toRad=_interopRequireDefault(toRad_1);var _toDeg=_interopRequireDefault(toDeg_1);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj}}var getRhumbLineBearing=function getRhumbLineBearing(origin,dest){var diffLon=(0, _toRad.default)((0, _getLongitude.default)(dest))-(0, _toRad.default)((0, _getLongitude.default)(origin));var diffPhi=Math.log(Math.tan((0, _toRad.default)((0, _getLatitude.default)(dest))/2+Math.PI/4)/Math.tan((0, _toRad.default)((0, _getLatitude.default)(origin))/2+Math.PI/4));if(Math.abs(diffLon)>Math.PI){if(diffLon>0){diffLon=(Math.PI*2-diffLon)*-1;}else {diffLon=Math.PI*2+diffLon;}}return ((0, _toDeg.default)(Math.atan2(diffLon,diffPhi))+360)%360};var _default=getRhumbLineBearing;exports.default=_default;
    });

    var getCompassDirection_1 = createCommonjsModule(function (module, exports) {
    Object.defineProperty(exports,"__esModule",{value:true});exports.default=void 0;var _getRhumbLineBearing=_interopRequireDefault(getRhumbLineBearing_1);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj}}var getCompassDirection=function getCompassDirection(origin,dest){var bearingFn=arguments.length>2&&arguments[2]!==undefined?arguments[2]:_getRhumbLineBearing.default;var bearing=typeof bearingFn==="function"?bearingFn(origin,dest):(0, _getRhumbLineBearing.default)(origin,dest);if(isNaN(bearing)){throw new Error("Could not calculate bearing for given points. Check your bearing function")}switch(Math.round(bearing/22.5)){case 1:return "NNE";case 2:return "NE";case 3:return "ENE";case 4:return "E";case 5:return "ESE";case 6:return "SE";case 7:return "SSE";case 8:return "S";case 9:return "SSW";case 10:return "SW";case 11:return "WSW";case 12:return "W";case 13:return "WNW";case 14:return "NW";case 15:return "NNW";default:return "N";}};var _default=getCompassDirection;exports.default=_default;
    });

    var getDistanceFromLine_1 = createCommonjsModule(function (module, exports) {
    Object.defineProperty(exports,"__esModule",{value:true});exports.default=void 0;var _getDistance=_interopRequireDefault(getDistance_1);var _robustAcos=_interopRequireDefault(robustAcos_1);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj}}var getDistanceFromLine=function getDistanceFromLine(point,lineStart,lineEnd){var d1=(0, _getDistance.default)(lineStart,point);var d2=(0, _getDistance.default)(point,lineEnd);var d3=(0, _getDistance.default)(lineStart,lineEnd);var alpha=Math.acos((0, _robustAcos.default)((d1*d1+d3*d3-d2*d2)/(2*d1*d3)));var beta=Math.acos((0, _robustAcos.default)((d2*d2+d3*d3-d1*d1)/(2*d2*d3)));if(alpha>Math.PI/2){return d1}if(beta>Math.PI/2){return d2}return Math.sin(alpha)*d1};var _default=getDistanceFromLine;exports.default=_default;
    });

    var getGreatCircleBearing_1 = createCommonjsModule(function (module, exports) {
    Object.defineProperty(exports,"__esModule",{value:true});exports.default=void 0;var _getLatitude=_interopRequireDefault(getLatitude_1);var _getLongitude=_interopRequireDefault(getLongitude_1);var _toRad=_interopRequireDefault(toRad_1);var _toDeg=_interopRequireDefault(toDeg_1);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj}}var getGreatCircleBearing=function getGreatCircleBearing(origin,dest){var destLat=(0, _getLatitude.default)(dest);var detLon=(0, _getLongitude.default)(dest);var originLat=(0, _getLatitude.default)(origin);var originLon=(0, _getLongitude.default)(origin);var bearing=((0, _toDeg.default)(Math.atan2(Math.sin((0, _toRad.default)(detLon)-(0, _toRad.default)(originLon))*Math.cos((0, _toRad.default)(destLat)),Math.cos((0, _toRad.default)(originLat))*Math.sin((0, _toRad.default)(destLat))-Math.sin((0, _toRad.default)(originLat))*Math.cos((0, _toRad.default)(destLat))*Math.cos((0, _toRad.default)(detLon)-(0, _toRad.default)(originLon))))+360)%360;return bearing};var _default=getGreatCircleBearing;exports.default=_default;
    });

    var getPathLength_1 = createCommonjsModule(function (module, exports) {
    Object.defineProperty(exports,"__esModule",{value:true});exports.default=void 0;var _getDistance=_interopRequireDefault(getDistance_1);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj}}function _typeof(obj){"@babel/helpers - typeof";if(typeof Symbol==="function"&&typeof Symbol.iterator==="symbol"){_typeof=function _typeof(obj){return typeof obj};}else {_typeof=function _typeof(obj){return obj&&typeof Symbol==="function"&&obj.constructor===Symbol&&obj!==Symbol.prototype?"symbol":typeof obj};}return _typeof(obj)}var getPathLength=function getPathLength(points){var distanceFn=arguments.length>1&&arguments[1]!==undefined?arguments[1]:_getDistance.default;return points.reduce(function(acc,point){if(_typeof(acc)==="object"&&acc.last!==null){acc.distance+=distanceFn(point,acc.last);}acc.last=point;return acc},{last:null,distance:0}).distance};var _default=getPathLength;exports.default=_default;
    });

    var getPreciseDistance = createCommonjsModule(function (module, exports) {
    Object.defineProperty(exports,"__esModule",{value:true});exports.default=void 0;var _getLatitude=_interopRequireDefault(getLatitude_1);var _getLongitude=_interopRequireDefault(getLongitude_1);var _toRad=_interopRequireDefault(toRad_1);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj}}var getDistance=function getDistance(start,end){var accuracy=arguments.length>2&&arguments[2]!==undefined?arguments[2]:1;accuracy=typeof accuracy!=="undefined"&&!isNaN(accuracy)?accuracy:1;var startLat=(0, _getLatitude.default)(start);var startLon=(0, _getLongitude.default)(start);var endLat=(0, _getLatitude.default)(end);var endLon=(0, _getLongitude.default)(end);var b=6356752.314245;var ellipsoidParams=1/298.257223563;var L=(0, _toRad.default)(endLon-startLon);var cosSigma;var sigma;var sinAlpha;var cosSqAlpha;var cos2SigmaM;var sinSigma;var U1=Math.atan((1-ellipsoidParams)*Math.tan((0, _toRad.default)(parseFloat(startLat))));var U2=Math.atan((1-ellipsoidParams)*Math.tan((0, _toRad.default)(parseFloat(endLat))));var sinU1=Math.sin(U1);var cosU1=Math.cos(U1);var sinU2=Math.sin(U2);var cosU2=Math.cos(U2);var lambda=L;var lambdaP;var iterLimit=100;do{var sinLambda=Math.sin(lambda);var cosLambda=Math.cos(lambda);sinSigma=Math.sqrt(cosU2*sinLambda*(cosU2*sinLambda)+(cosU1*sinU2-sinU1*cosU2*cosLambda)*(cosU1*sinU2-sinU1*cosU2*cosLambda));if(sinSigma===0){return 0}cosSigma=sinU1*sinU2+cosU1*cosU2*cosLambda;sigma=Math.atan2(sinSigma,cosSigma);sinAlpha=cosU1*cosU2*sinLambda/sinSigma;cosSqAlpha=1-sinAlpha*sinAlpha;cos2SigmaM=cosSigma-2*sinU1*sinU2/cosSqAlpha;if(isNaN(cos2SigmaM)){cos2SigmaM=0;}var C=ellipsoidParams/16*cosSqAlpha*(4+ellipsoidParams*(4-3*cosSqAlpha));lambdaP=lambda;lambda=L+(1-C)*ellipsoidParams*sinAlpha*(sigma+C*sinSigma*(cos2SigmaM+C*cosSigma*(-1+2*cos2SigmaM*cos2SigmaM)));}while(Math.abs(lambda-lambdaP)>1e-12&&--iterLimit>0);if(iterLimit===0){return NaN}var uSq=cosSqAlpha*(constants.earthRadius*constants.earthRadius-b*b)/(b*b);var A=1+uSq/16384*(4096+uSq*(-768+uSq*(320-175*uSq)));var B=uSq/1024*(256+uSq*(-128+uSq*(74-47*uSq)));var deltaSigma=B*sinSigma*(cos2SigmaM+B/4*(cosSigma*(-1+2*cos2SigmaM*cos2SigmaM)-B/6*cos2SigmaM*(-3+4*sinSigma*sinSigma)*(-3+4*cos2SigmaM*cos2SigmaM)));var distance=b*A*(sigma-deltaSigma);return Math.round(distance/accuracy)*accuracy};var _default=getDistance;exports.default=_default;
    });

    var getRoughCompassDirection_1 = createCommonjsModule(function (module, exports) {
    Object.defineProperty(exports,"__esModule",{value:true});exports.default=void 0;var getRoughCompassDirection=function getRoughCompassDirection(exact){if(/^NNE|NE|NNW|N$/.test(exact)){return "N"}if(/^ENE|E|ESE|SE$/.test(exact)){return "E"}if(/^SSE|S|SSW|SW$/.test(exact)){return "S"}if(/^WSW|W|WNW|NW$/.test(exact)){return "W"}};var _default=getRoughCompassDirection;exports.default=_default;
    });

    var getSpeed_1 = createCommonjsModule(function (module, exports) {
    Object.defineProperty(exports,"__esModule",{value:true});exports.default=void 0;var _getDistance=_interopRequireDefault(getDistance_1);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj}}var getSpeed=function getSpeed(start,end){var distanceFn=arguments.length>2&&arguments[2]!==undefined?arguments[2]:_getDistance.default;var distance=distanceFn(start,end);var time=Number(end.time)-Number(start.time);var metersPerSecond=distance/time*1000;return metersPerSecond};var _default=getSpeed;exports.default=_default;
    });

    var isPointInLine_1 = createCommonjsModule(function (module, exports) {
    Object.defineProperty(exports,"__esModule",{value:true});exports.default=void 0;var _getDistance=_interopRequireDefault(getDistance_1);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj}}var isPointInLine=function isPointInLine(point,lineStart,lineEnd){return (0, _getDistance.default)(lineStart,point)+(0, _getDistance.default)(point,lineEnd)===(0, _getDistance.default)(lineStart,lineEnd)};var _default=isPointInLine;exports.default=_default;
    });

    var isPointInPolygon_1 = createCommonjsModule(function (module, exports) {
    Object.defineProperty(exports,"__esModule",{value:true});exports.default=void 0;var _getLatitude=_interopRequireDefault(getLatitude_1);var _getLongitude=_interopRequireDefault(getLongitude_1);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj}}var isPointInPolygon=function isPointInPolygon(point,polygon){var isInside=false;var totalPolys=polygon.length;for(var i=-1,j=totalPolys-1;++i<totalPolys;j=i){if(((0, _getLongitude.default)(polygon[i])<=(0, _getLongitude.default)(point)&&(0, _getLongitude.default)(point)<(0, _getLongitude.default)(polygon[j])||(0, _getLongitude.default)(polygon[j])<=(0, _getLongitude.default)(point)&&(0, _getLongitude.default)(point)<(0, _getLongitude.default)(polygon[i]))&&(0, _getLatitude.default)(point)<((0, _getLatitude.default)(polygon[j])-(0, _getLatitude.default)(polygon[i]))*((0, _getLongitude.default)(point)-(0, _getLongitude.default)(polygon[i]))/((0, _getLongitude.default)(polygon[j])-(0, _getLongitude.default)(polygon[i]))+(0, _getLatitude.default)(polygon[i])){isInside=!isInside;}}return isInside};var _default=isPointInPolygon;exports.default=_default;
    });

    var isPointNearLine_1 = createCommonjsModule(function (module, exports) {
    Object.defineProperty(exports,"__esModule",{value:true});exports.default=void 0;var _getDistanceFromLine=_interopRequireDefault(getDistanceFromLine_1);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj}}var isPointNearLine=function isPointNearLine(point,start,end,distance){return (0, _getDistanceFromLine.default)(point,start,end)<distance};var _default=isPointNearLine;exports.default=_default;
    });

    var isPointWithinRadius_1 = createCommonjsModule(function (module, exports) {
    Object.defineProperty(exports,"__esModule",{value:true});exports.default=void 0;var _getDistance=_interopRequireDefault(getDistance_1);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj}}var isPointWithinRadius=function isPointWithinRadius(point,center,radius){return (0, _getDistance.default)(point,center)<radius};var _default=isPointWithinRadius;exports.default=_default;
    });

    var wktToPolygon_1 = createCommonjsModule(function (module, exports) {
    Object.defineProperty(exports,"__esModule",{value:true});exports.default=void 0;function _slicedToArray(arr,i){return _arrayWithHoles(arr)||_iterableToArrayLimit(arr,i)||_unsupportedIterableToArray(arr,i)||_nonIterableRest()}function _nonIterableRest(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}function _unsupportedIterableToArray(o,minLen){if(!o)return;if(typeof o==="string")return _arrayLikeToArray(o,minLen);var n=Object.prototype.toString.call(o).slice(8,-1);if(n==="Object"&&o.constructor)n=o.constructor.name;if(n==="Map"||n==="Set")return Array.from(o);if(n==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return _arrayLikeToArray(o,minLen)}function _arrayLikeToArray(arr,len){if(len==null||len>arr.length)len=arr.length;for(var i=0,arr2=new Array(len);i<len;i++){arr2[i]=arr[i];}return arr2}function _iterableToArrayLimit(arr,i){if(typeof Symbol==="undefined"||!(Symbol.iterator in Object(arr)))return;var _arr=[];var _n=true;var _d=false;var _e=undefined;try{for(var _i=arr[Symbol.iterator](),_s;!(_n=(_s=_i.next()).done);_n=true){_arr.push(_s.value);if(i&&_arr.length===i)break}}catch(err){_d=true;_e=err;}finally{try{if(!_n&&_i["return"]!=null)_i["return"]();}finally{if(_d)throw _e}}return _arr}function _arrayWithHoles(arr){if(Array.isArray(arr))return arr}var wktToPolygon=function wktToPolygon(wkt){if(!wkt.startsWith("POLYGON")){throw new Error("Invalid wkt.")}var coordsText=wkt.slice(wkt.indexOf("(")+2,wkt.indexOf(")")).split(", ");var polygon=coordsText.map(function(coordText){var _coordText$split=coordText.split(" "),_coordText$split2=_slicedToArray(_coordText$split,2),longitude=_coordText$split2[0],latitude=_coordText$split2[1];return {longitude:parseFloat(longitude),latitude:parseFloat(latitude)}});return polygon};var _default=wktToPolygon;exports.default=_default;
    });

    var es = createCommonjsModule(function (module, exports) {
    Object.defineProperty(exports,"__esModule",{value:true});var _exportNames={computeDestinationPoint:true,convertArea:true,convertDistance:true,convertSpeed:true,decimalToSexagesimal:true,findNearest:true,getAreaOfPolygon:true,getBounds:true,getBoundsOfDistance:true,getCenter:true,getCenterOfBounds:true,getCompassDirection:true,getCoordinateKey:true,getCoordinateKeys:true,getDistance:true,getDistanceFromLine:true,getGreatCircleBearing:true,getLatitude:true,getLongitude:true,getPathLength:true,getPreciseDistance:true,getRhumbLineBearing:true,getRoughCompassDirection:true,getSpeed:true,isDecimal:true,isPointInLine:true,isPointInPolygon:true,isPointNearLine:true,isPointWithinRadius:true,isSexagesimal:true,isValidCoordinate:true,isValidLatitude:true,isValidLongitude:true,orderByDistance:true,sexagesimalToDecimal:true,toDecimal:true,toRad:true,toDeg:true,wktToPolygon:true};Object.defineProperty(exports,"computeDestinationPoint",{enumerable:true,get:function get(){return _computeDestinationPoint.default}});Object.defineProperty(exports,"convertArea",{enumerable:true,get:function get(){return _convertArea.default}});Object.defineProperty(exports,"convertDistance",{enumerable:true,get:function get(){return _convertDistance.default}});Object.defineProperty(exports,"convertSpeed",{enumerable:true,get:function get(){return _convertSpeed.default}});Object.defineProperty(exports,"decimalToSexagesimal",{enumerable:true,get:function get(){return _decimalToSexagesimal.default}});Object.defineProperty(exports,"findNearest",{enumerable:true,get:function get(){return _findNearest.default}});Object.defineProperty(exports,"getAreaOfPolygon",{enumerable:true,get:function get(){return _getAreaOfPolygon.default}});Object.defineProperty(exports,"getBounds",{enumerable:true,get:function get(){return _getBounds.default}});Object.defineProperty(exports,"getBoundsOfDistance",{enumerable:true,get:function get(){return _getBoundsOfDistance.default}});Object.defineProperty(exports,"getCenter",{enumerable:true,get:function get(){return _getCenter.default}});Object.defineProperty(exports,"getCenterOfBounds",{enumerable:true,get:function get(){return _getCenterOfBounds.default}});Object.defineProperty(exports,"getCompassDirection",{enumerable:true,get:function get(){return _getCompassDirection.default}});Object.defineProperty(exports,"getCoordinateKey",{enumerable:true,get:function get(){return _getCoordinateKey.default}});Object.defineProperty(exports,"getCoordinateKeys",{enumerable:true,get:function get(){return _getCoordinateKeys.default}});Object.defineProperty(exports,"getDistance",{enumerable:true,get:function get(){return _getDistance.default}});Object.defineProperty(exports,"getDistanceFromLine",{enumerable:true,get:function get(){return _getDistanceFromLine.default}});Object.defineProperty(exports,"getGreatCircleBearing",{enumerable:true,get:function get(){return _getGreatCircleBearing.default}});Object.defineProperty(exports,"getLatitude",{enumerable:true,get:function get(){return _getLatitude.default}});Object.defineProperty(exports,"getLongitude",{enumerable:true,get:function get(){return _getLongitude.default}});Object.defineProperty(exports,"getPathLength",{enumerable:true,get:function get(){return _getPathLength.default}});Object.defineProperty(exports,"getPreciseDistance",{enumerable:true,get:function get(){return _getPreciseDistance.default}});Object.defineProperty(exports,"getRhumbLineBearing",{enumerable:true,get:function get(){return _getRhumbLineBearing.default}});Object.defineProperty(exports,"getRoughCompassDirection",{enumerable:true,get:function get(){return _getRoughCompassDirection.default}});Object.defineProperty(exports,"getSpeed",{enumerable:true,get:function get(){return _getSpeed.default}});Object.defineProperty(exports,"isDecimal",{enumerable:true,get:function get(){return _isDecimal.default}});Object.defineProperty(exports,"isPointInLine",{enumerable:true,get:function get(){return _isPointInLine.default}});Object.defineProperty(exports,"isPointInPolygon",{enumerable:true,get:function get(){return _isPointInPolygon.default}});Object.defineProperty(exports,"isPointNearLine",{enumerable:true,get:function get(){return _isPointNearLine.default}});Object.defineProperty(exports,"isPointWithinRadius",{enumerable:true,get:function get(){return _isPointWithinRadius.default}});Object.defineProperty(exports,"isSexagesimal",{enumerable:true,get:function get(){return _isSexagesimal.default}});Object.defineProperty(exports,"isValidCoordinate",{enumerable:true,get:function get(){return _isValidCoordinate.default}});Object.defineProperty(exports,"isValidLatitude",{enumerable:true,get:function get(){return _isValidLatitude.default}});Object.defineProperty(exports,"isValidLongitude",{enumerable:true,get:function get(){return _isValidLongitude.default}});Object.defineProperty(exports,"orderByDistance",{enumerable:true,get:function get(){return _orderByDistance.default}});Object.defineProperty(exports,"sexagesimalToDecimal",{enumerable:true,get:function get(){return _sexagesimalToDecimal.default}});Object.defineProperty(exports,"toDecimal",{enumerable:true,get:function get(){return _toDecimal.default}});Object.defineProperty(exports,"toRad",{enumerable:true,get:function get(){return _toRad.default}});Object.defineProperty(exports,"toDeg",{enumerable:true,get:function get(){return _toDeg.default}});Object.defineProperty(exports,"wktToPolygon",{enumerable:true,get:function get(){return _wktToPolygon.default}});var _computeDestinationPoint=_interopRequireDefault(computeDestinationPoint_1);var _convertArea=_interopRequireDefault(convertArea_1);var _convertDistance=_interopRequireDefault(convertDistance_1);var _convertSpeed=_interopRequireDefault(convertSpeed_1);var _decimalToSexagesimal=_interopRequireDefault(decimalToSexagesimal);var _findNearest=_interopRequireDefault(findNearest_1);var _getAreaOfPolygon=_interopRequireDefault(getAreaOfPolygon_1);var _getBounds=_interopRequireDefault(getBounds_1);var _getBoundsOfDistance=_interopRequireDefault(getBoundsOfDistance_1);var _getCenter=_interopRequireDefault(getCenter_1);var _getCenterOfBounds=_interopRequireDefault(getCenterOfBounds_1);var _getCompassDirection=_interopRequireDefault(getCompassDirection_1);var _getCoordinateKey=_interopRequireDefault(getCoordinateKey_1);var _getCoordinateKeys=_interopRequireDefault(getCoordinateKeys_1);var _getDistance=_interopRequireDefault(getDistance_1);var _getDistanceFromLine=_interopRequireDefault(getDistanceFromLine_1);var _getGreatCircleBearing=_interopRequireDefault(getGreatCircleBearing_1);var _getLatitude=_interopRequireDefault(getLatitude_1);var _getLongitude=_interopRequireDefault(getLongitude_1);var _getPathLength=_interopRequireDefault(getPathLength_1);var _getPreciseDistance=_interopRequireDefault(getPreciseDistance);var _getRhumbLineBearing=_interopRequireDefault(getRhumbLineBearing_1);var _getRoughCompassDirection=_interopRequireDefault(getRoughCompassDirection_1);var _getSpeed=_interopRequireDefault(getSpeed_1);var _isDecimal=_interopRequireDefault(isDecimal_1);var _isPointInLine=_interopRequireDefault(isPointInLine_1);var _isPointInPolygon=_interopRequireDefault(isPointInPolygon_1);var _isPointNearLine=_interopRequireDefault(isPointNearLine_1);var _isPointWithinRadius=_interopRequireDefault(isPointWithinRadius_1);var _isSexagesimal=_interopRequireDefault(isSexagesimal_1);var _isValidCoordinate=_interopRequireDefault(isValidCoordinate_1);var _isValidLatitude=_interopRequireDefault(isValidLatitude_1);var _isValidLongitude=_interopRequireDefault(isValidLongitude_1);var _orderByDistance=_interopRequireDefault(orderByDistance_1);var _sexagesimalToDecimal=_interopRequireDefault(sexagesimalToDecimal_1);var _toDecimal=_interopRequireDefault(toDecimal_1);var _toRad=_interopRequireDefault(toRad_1);var _toDeg=_interopRequireDefault(toDeg_1);var _wktToPolygon=_interopRequireDefault(wktToPolygon_1);Object.keys(constants).forEach(function(key){if(key==="default"||key==="__esModule")return;if(Object.prototype.hasOwnProperty.call(_exportNames,key))return;Object.defineProperty(exports,key,{enumerable:true,get:function get(){return constants[key]}});});function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj}}
    });

    const colKey = (sheetColumn) => {
        return sheetColumn?.split("/")?.[1]
    };

    const rowVal = (row, sheetColumn) => {
        return row?.values[colKey(sheetColumn)]
    };

    /* utility function to convert a sheet row into a more conveniently accessible object 
     row = {
        "name": "anna"
     }
     columnMap = {
        "elements/name": "name"
     }
     object = {
        "name": "anna"
     }
    */

    const rowToObject = (row, columnMap) => {
      let object = {};
      object.key = row.key; // preserve the row key
      object.row = row; // preserve the original row
      for(let key in columnMap) {
        object[key] = rowVal(row, columnMap[key]);
      }
      //console.log("rowToObject", row, columnMap, object)
      return object
    };


    var util = {

      colKey,
      rowVal,

      rowValString: (row, sheetColumn) => {
        let v = rowVal(row, sheetColumn);
        let r = v ? v : "";
        //console.log("rowValString", v, r)
        return r;
      },

      getSheetKey: (sheetColumn) => {
        return sheetColumn?.split("/")?.[0];
      },

      getSheetId: (sheetColumn) => {
        alert("deprecated use of getSheetId");
        return sheetColumn?.split("/")?.[0];
      },
      
      rowToObject,
      rowsToObjects: (rows, columnMap) => {
        if(!columnMap) return [];
        if(Array.isArray(rows))
          return rows.map((r)=>{return rowToObject(r, columnMap)})
        if(typeof data == "object")
          return rowToObject(rows, columnMap)
        console.log("rowsToObjects conversion error");
        return [];
      },

      // finds the column key of the first text column in a sheet
      firstTextColKey: (sheet) => {
        //console.log(sheet)
        let textColumn = sheet.columns.find(c => c.type == "string");
        //console.log(textColumn)
        return textColumn?.key;
      },

      getCategoryIndex: (sectionRow, sectionColumns) => {
        let categoryIndex;
        if(rowVal(sectionRow, sectionColumns.categoryRefsColumn[0])) {
          categoryIndex = 0;
        }
        if(rowVal(sectionRow, sectionColumns.categoryRefsColumn[1])) {
          categoryIndex = 1;
        }
        if(categoryIndex == undefined) {
          console.log("warning: no category selected for slider");
        }
        return categoryIndex;
      },

      getDistance: (elementPosition, userPosition) => {
        if(elementPosition && userPosition) {
          //console.log("getDistance", elementPosition, userPosition)
          let meters = es.getDistance({
            longitude: userPosition.lng,
            latitude: userPosition.lat
          }, {
            longitude: elementPosition.lng,
            latitude: elementPosition.lat
          });
          //console.log("meters", meters)
          return meters;
        }
      },

      formatDuration: (milliseconds) => {
        if (isNaN(milliseconds)) return '';
        let seconds = Math.floor(milliseconds / 1000);
        //console.log("formatDuration", seconds);
        const minutes = Math.floor(seconds / 60);
        seconds = Math.floor(seconds % 60);
        if (seconds < 10) seconds = '0' + seconds;
        return `${minutes}:${seconds}`;
      },

      filterColorRGB: (categoryRow, categoryColorColumn) => {
        let value = rowVal(categoryRow, categoryColorColumn);
        if(value) {
          try {
            let rgbArray = JSON.parse(value);
            const c = (index) => Math.floor(rgbArray[index] * 256);
            return `rgb(${c(0)},${c(1)},${c(2)})`
          } catch(e) {
            console.log(e);
          }
        } else {
          return ""
        }
      },

      formatDistance: (meters) => {
        let d = "";
        if(meters < 1000) d = meters + "m";
        else d = Math.floor(meters / 1000) + "km";
        return d;
      },

      getUrlParameter(name) {
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
        var results = regex.exec(location.search);
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
      },

      extractContextProp(propValue) {

        if(propValue.includes("$ElementProvider")) { // only implemented for ElementProvider for now
          console.log("getting channel_key from context...");
          const parts = propValue.split(".");
          const attributeName = parts[1]; 

          let context = getContext("ElementProvider");
          let element = get_store_value(context?.element); // we assume for now this is always a store containing a row
          let extractedValue = element?.values?.[attributeName];
          console.log("retrieved", extractedValue);
          return extractedValue
        } else {
          return propValue
        }

      }

    };

    const { PushNotifications } = Plugins;

    /**
     * Consider heartbeats for push notification eligibility?
     * If true: current implementation might have performance problems,
     * since every hearbeat causes a user collection onChange.
     * If false: every device receives a push notification. Where the app
     * is still active/visible, the OS does not display a notification,
     * instead, the app can react in a handler (e.g. route to a tab or
     * trigger a poll, update the "new message small red badge counters").
     * See pushNotificationReceived handler.
     * This flag must be (kept manually) in sync with its counterpart in
     * meteor-server/imports/pushnotifications.js !!!
     * @default
     */
    const enableHeartbeat = false;

    const addListeners = async () => {
      await PushNotifications.addListener('registration', token => {
        console.info('Registration token', token);
        InterkitClient.pushnotificationRegistrationToken.set(token.value);
      });

      await PushNotifications.addListener('registrationError', err => {
        // TODO do something
        console.error('Registration error: ', err.error);
      });

      await PushNotifications.addListener('pushNotificationReceived', notification => {
        // if tab is visible & still does receive a push notification,
        // we "handle" it hereby & it "disappears"
        // TODO could be used to focus a "chat tab"
        console.log('Push notification received: ', notification);
        // alert('got push:' + JSON.stringify(notification))
      });

      await PushNotifications.addListener('pushNotificationActionPerformed', notification => {
        // after the OS receives & displays the notification & users taps it,
        // we can handle the event here.
        // it sends OS/FCM stuff about the notification, like
        // (on Android) actionId: tap, very long IDs, google.delivered_priority and
        // collapse_key (which holds the bundle id, like 'interkit.app.cs3')
        // alert('push action performed:' + JSON.stringify(notification))
        // TODO could be used to focus a "chat tab"?
        console.log('Push notification action performed', notification.actionId, notification.inputValue);
      });
    };

    const registerNotifications = async () => {
      // docs seemed out of date, the surrounding code used to be necessary? TODO recheck
      // let permStatus = await PushNotifications.checkPermissions();
      // if (permStatus.receive === 'prompt') {
      let permStatus = await PushNotifications.requestPermission();
      // }
      console.info('pushNotifications requestPermission returned', permStatus);

      if (permStatus.granted !== true) {
        throw new Error('User denied permissions!');
      }

      await PushNotifications.register();
    };

    const getDeliveredNotifications = async () => {
      const notificationList = await PushNotifications.getDeliveredNotifications();
      console.log('delivered notifications', notificationList);
      // TODO do something with them? maybe just throw them out, since app is being opened
    };

    const startHeartbeat = () => {
      {
        console.log('heartbeat disabled');
        return
      }
    };

    // this store holds the basic data from interkit.config.json
    let config = writable(null); 

    // this store holds the projctId that is loaded with info from the config
    let projectId = writable(null);
    let connectionIssue = writable(false);
    let connected = writable(false);

    let server;

    // get auth token from local storage if available
    let userAuth;
    try {
      let userAuthObj = JSON.parse(localStorage.getItem('userAuth'));
      userAuth = writable(userAuthObj);
    } catch(e) {
      console.log(e);
    }
    //console.log(get(userAuth))
    // this is set only after user logs in sucessfully / or continues user sessio
    let userId = writable(null); 

    let pushnotificationRegistrationToken = writable(null);

    // a global store to store the state history of stores relavant to the UI
    let uiHistoryStore = writable([]);

     // reactive user data related to this project
    let userProjectDataStore = writable();

    // centrally store all subscriptions to sheets, using sheetKey as key on this object
    let rowSubs = {};
    let mediaFileSub;
    let userProjectDataSub;
    let sheetSub;

    // can probably be deprecated - used to make sure last subcription is closed
    let subscriptionCounter = {};

    let globalStores = {};
    let globalMethods = {};

    // restores the meteor style _id attribute on all elements in array or single object
    const restore_ids = (data) => {
      if(Array.isArray(data))
        return data.map((e)=>{return {...e, _id: e.id}})
      if(typeof data == "object")
        return {...data, _id: data.id}
      return data;
    };

    // connects to the meteor server
    const connect = async (url) => {
      if(!url)
        url = get_store_value(config)?.INTERKIT_SERVER_WEBSOCKETS_URL;
      
      console.log("InterkitClient.connect", url);
      if(server) {
        console.log("server already initialized, ignoring");
        return
      }
      let opts = {
        endpoint: url,
        SocketConstructor: browser,
        reconnectInterval: 5000
      };
      server = new simpleDDP(opts, [main.simpleDDPLogin]);

      server.on('connected', () => {
        connected.set(true);
      });

      server.on('disconnected', () => {
        connected.set(false);
      });

      // this needs to be done once in the client app
      await server.connect();
      console.log("connected");

      let result = await server.call("resumeUserSession", get_store_value(userAuth));
      //console.log("resumeUserSession result", result)

      // these can be very async so we listen to both and the handler acts when both are set
      userId.subscribe(saveUserPushnotificationRegistrationToken);
      pushnotificationRegistrationToken.subscribe(saveUserPushnotificationRegistrationToken);
      InterkitClient.saveUserPushnotificationRegistrationToken();

      // on app load the client is not necessarily connected yet, so we do it here, too
      InterkitClient.userHeartbeat(true); 

      if(result) {
        // login again
        userId.set(get_store_value(userAuth)?.id);
      }
    };

    // loads local config file to get basic info about project
    const loadConfig = async () => {
        let params = (new URL(document.location)).searchParams;
        let _config;
        
        if(params.get("localConfigURL")) {

          console.log("localConfigURL", params.get("localConfigURL"));

          // we are in the authoring system preview - load generated config from budler
          let response = await fetch(params.get("localConfigURL"));    
          try {
            _config = await response.json();
            console.log("interkit.config.json", _config);
          } catch(e) {
            console.log("error parsing config", e);
          }

        } else {

          // we are in standalone/capacitor mode - load config from our own public directory
          let response = await fetch("interkit.config.json");    
          try {
            _config = await response.json();
            console.log("interkit.config.json", _config);
          } catch(e) {
            console.log("error parsing config", e);
          }
        }

        // override loadTheme option that might be set in config
        if(params.get("loadTheme")) {
          _config.INTERKIT_APP_LOAD_THEME = params.get("loadTheme") === "true";
        }
        console.log(`INTERKIT_APP_LOAD_THEME=${_config.INTERKIT_APP_LOAD_THEME}`);
        
        config.set(_config);
    };

    const fetchWithTimeout = async (resource, options={timeout: 8000}) => { 
      const { timeout } = options;
      var response = false;
      if ('AbortController' in window) {
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), timeout);
        response = await fetch(resource, {
          ...options,
          signal: controller.signal
        });
        clearTimeout(id);
      } else {
        console.log('no AbortController...');
        // warning: this will never time out. TODO find a better polyfill?
        response = await fetch(resource, { ...options });
      }
      return response;
    };

    let connectionAlert = false;

    const getProjectId = async() => {

      let _projectId;
      let params = (new URL(document.location)).searchParams;
      if(params.get("projectId")) {
        console.log("got projectId from url param, using that");
        _projectId = params.get("projectId");
      } else {
        console.log("trying to get projectId from server via slug", get_store_value(config)?.project_slug);
        let url = get_store_value(config)?.INTERKIT_BUNDLER_URL + "/project_id/" + get_store_value(config)?.project_slug;
        let result;
        try {
          result = await fetchWithTimeout(url);
        } catch (e) {
          console.log(e);
          if(!connectionAlert) {
            alert("Diese App benötigt Internet-Zugriff. Bitte überprüfen Sie Ihre Verbindung.");
            connectionAlert = true;
            connectionIssue.set(true);
          }
        }    

        if(result) {
          _projectId = await result.text();
        } else {
          console.log("couldn't retrieve projectId from slug " + get_store_value(config)?.project_slug);
        }
      } 
      console.log("INTERKIT_PROJECT_ID", _projectId);
      projectId.set(_projectId);
    };

    // compares two version strings of the format "0.1", returns 0 if equal, -1 if a > b, 1 if a < b
    const versionCompare = (a, b) => {
      if(a == b) return 0;
      let aNumeric = a.split(".").map(c => parseInt(c));
      let bNumeric = b.split(".").map(c => parseInt(c));
      // compare first digit
      if(aNumeric[0] > bNumeric[0]) return -1;
      if(aNumeric[0] < bNumeric[0]) return 1;
      // compare second digit
      if(aNumeric[1] > bNumeric[1]) return -1;
      if(aNumeric[1] < bNumeric[1]) return 1;
    };

    const checkForUpdates = async () => {

        let _config = get_store_value(config);
        let _projectId = get_store_value(projectId);

        if(!_projectId) {
          console.log("no projectId, aborting update");
          return
        }

        let url = `${_config?.INTERKIT_BUNDLER_URL}/app/${_projectId}/interkit.config.json`;
        console.log("looking for online config at", url);
        let response = await fetch(url);
        let onlineConfig;
        try {
          onlineConfig = await response.json();
          console.log("found online config", onlineConfig);  
        } catch(e) {
          console.log("error during update", e);
        }

        let myVersion = _config?.bundle_version;
        let onlineVersion = onlineConfig?.bundle_version;
        console.log(`my version: ${myVersion} - online version: ${onlineVersion}`);

        let downloadedVersion = await InterkitLiveReload.checkDownloadedVersion();

        if(downloadedVersion) {
          console.log("found a downloaded bundle with version " + downloadedVersion);
          if(
            versionCompare(downloadedVersion, myVersion) >= 0  // I am newer or equal downloaded
            && versionCompare(onlineVersion, myVersion) >= 0 // I am newer or queal online
          ) {
            console.log("I'm at the newest available version, no need to update");
            return false;
          }

          // If the downloaded version is newer or equal to the online version, switch 
          if(versionCompare(onlineVersion, downloadedVersion) >= 0) {
            console.log("The downloaded version is the newest available, switching to that...");
            await InterkitLiveReload.activateInstalledBundle();
            return true;
          } 
        }

        // if the online version is newer than me, downnload it and switch!
        if(versionCompare(myVersion, onlineVersion) == 1) {
           console.log("online is newer, we need to update!");
           let bundleURL = `${_config?.INTERKIT_BUNDLER_URL}/bundlezip/${_projectId}`;
           //let bundleURL = "https://app.demo.interkit.app/bundlezip/Pn5M862Kw9Zj7C8ot"

           await InterkitLiveReload.downloadAndActivateBundle(encodeURI(bundleURL));
           return true;

        } else {
          console.log("online is same or older - we are on the newest available version, no update or switch needed");
        }
        return false;   
    };

    /*
      col: the meteor collection 
      pub: the meteor publication to subscribe to
      pubArgs: an object with arguments for the subscription - projectId is added from config
      cFilter: a filter function to narrow down the results
      single: track a single document or an array
      columnMap: column keys for conversion into more convenient objects

      returns {
        data // a svelte store
      }

      -> components should not use this directly but use getRowSubStore (see below)
    */

    const getSub = async (col, pub, pubArgs={}, cFilter=(a)=>true, single=false, columnMap) => {
      
      // setup the store
      let sub = {};
      sub.data = writable([]); // save svelte store under data
      sub.objects = writable([]); // svelte store to contain converted objects

      // add projectId to arguments object
      if(pubArgs) {
        if(!pubArgs?.projectId && get_store_value(projectId)) {
          pubArgs.projectId = get_store_value(projectId);
        }
      }
      console.log("getSub", col, pub, pubArgs);

      // setup the subscription
      sub.sub = server.sub(pub, [pubArgs]);
      await sub.sub.ready();
      //console.log("sub ready", pub, pubArgs)

      if(!subscriptionCounter[pub]) subscriptionCounter[pub] = 0;
      subscriptionCounter[pub] += 1;
      //console.log("incremented subscriptionCounter", pub, subscriptionCounter[pub])

      let collection = server.collection(col).filter(cFilter);
      let data = single ? collection.fetch()[0] : collection.fetch();
      let dataRestored = restore_ids(data);

      // write an initial fetch of the collection into the stores
      sub.data.set(dataRestored);
      sub.objects.set(util.rowsToObjects(dataRestored, columnMap));
      
      // update the store through simpleDDP's onChange listener
      sub.reactiveCollection = single ? collection.reactive().one() : collection.reactive();


      let bufferedWritesInterval = 350;
      let bufferedWritesMaxAge = 2000;
      let bufferedWritesFlushAt = null;
      let bufferedWritesFlushHandle = null;

      const updateAndFlush = (d) => {
        if (bufferedWritesFlushHandle) {
          clearTimeout(bufferedWritesFlushHandle);
          bufferedWritesFlushHandle = null;
        }
        bufferedWritesFlushAt = null;
        let dataRestored = restore_ids(d);
        sub.data.set(dataRestored);
        sub.objects.set(util.rowsToObjects(dataRestored, columnMap));
      };

      sub.reactiveCollection.onChange((newData)=>{
        //console.log("onChange", col, newData)
        
        if (bufferedWritesFlushAt === null) {
          bufferedWritesFlushAt = new Date().valueOf() + bufferedWritesMaxAge;
        }
        else if (bufferedWritesFlushAt < new Date().valueOf()) {
          updateAndFlush(newData);
          return;
        }

        // schedule next flush time to bufferedWritesInterval ahead of now
        if (bufferedWritesFlushHandle) {
          clearTimeout(bufferedWritesFlushHandle);
          bufferedWritesFlushHandle = null;
        }
        bufferedWritesFlushHandle = setTimeout(() => updateAndFlush(newData), bufferedWritesInterval);
        
      });

      sub.stop = async () => {
        if(subscriptionCounter[pub] > 0) {
          subscriptionCounter[pub] -= 1;
          //console.log("reduced subscriptionCounter", pub, subscriptionCounter[pub])
        }
        
        if(subscriptionCounter[pub] == 0) {
          console.log("stopping subscription to", pub);
          await sub.sub.remove();
        }
      }; 

      sub.status = "subscribed";

      return sub;
    };

    // this gets a sub to messages of specified channel
    const getMessageSub = async (channel_key) => {
      let sub = await InterkitClient.getSub("messages", "messages", {channel_key, userId: get_store_value(userId)}, m=>m.channel_key==channel_key);
      return sub;
    };

    // returns the row store for a given sheet, created one if not available or waits for subscription to complete
    // if a columnMap is passed in, returns the converted object store
    // subKey is a special key you can use to prevent conflicts with other subs that have different column maps
    const getRowSubStore = async (sheetKeyOrSheetColumn, columnMap, subKey) => {

      //console.log("getRowSubStore", columnMap)

      // check if we got a sheetKey or sheetColumn
      let sheetKey;
      if(sheetKeyOrSheetColumn.includes("/")) {
        sheetKey = util.getSheetKey(sheetKeyOrSheetColumn);
      } else {
        sheetKey = sheetKeyOrSheetColumn;
      }
      //console.log("sheetKey", sheetKey)

      // if we use a columnMap make this the subKey to avoid conflicts
      if(columnMap && !subKey) subKey = JSON.stringify(columnMap);

      // default subKey is the sheetKey
      if(!subKey) subKey = sheetKey;

      if(!rowSubs[subKey]) {
        // no subscription for this sheet yet, create one
        rowSubs[subKey] = {
          status: "subscribing",
          subPromise: new Promise(async (resolve, reject) => {
            console.log("creating row subscription on sheet", sheetKey);
            let rsub = await getSub("rows", "rows", {sheetKey}, r=>r.sheetKey==sheetKey, false, columnMap);
            resolve(rsub);
          })
        };
      }
      let sub = await rowSubs[subKey].subPromise;
      if(columnMap) {
        return sub?.objects
      } else {
        return sub?.data;  
      }
    };

    // returns the row store for a given sheet, created one if not available or waits for subscription to complete
    // returns only one row
    // if a columnMap is passed in, returns the converted object store
    // subKey is a special key you can use to prevent conflicts with other subs that have different column maps
    const getOneRowSubStore = async (sheetKeyOrSheetColumn, query, filterFunction) => {

      let data = await getRowSubStore(sheetKeyOrSheetColumn); // query not used yet

      const rowStore = writable();
      
      data.subscribe( rows => {
        rowStore.set(rows.filter(filterFunction)?.[0]);
      });

      return rowStore
    };

    const getMediaFileSubStore = async () => {
      if(!mediaFileSub) {
        // no subscription to media files yet, set it up
        mediaFileSub = new Promise(async (resolve, reject) => {
          //console.log("creating subscription for mediafiles")
          let msub = await getSub("mediafiles", "mediafiles", {});
          resolve(msub);
        });
      }    
      let sub = await mediaFileSub;
      return sub?.data;
    };

    const subscribeUserProjectDataStore = async () => {
      if (!server || !get_store_value(userId) || !get_store_value(projectId)) return
      if (!userProjectDataSub) {
        // no subscription to userProjectData yet, set it up
        userProjectDataSub = new Promise(async (resolve, reject) => {
          //console.log("creating subscription for userProjectData")
          let msub = await getSub("users", "user.projectUserData", {});
          resolve(msub);
        });
        let sub = await userProjectDataSub;
        //console.log("subscribeUserProjectDataStore", sub, sub.data)
        // subscribe to user project data
        sub.data.subscribe(d => {
          userProjectDataStore.set(d?.[0]?.projectUserData?.[get_store_value(projectId)] || null);
        });
      }
    };

    const getUiKeyStore = uiKey => {
      const key = "uiKey_" + uiKey;
      if (!globalStores[key]) {
        globalStores[key] = writable();
      }
      return globalStores[key]
    };

    const getUiKey = uiKey => {
      const key = "uiKey_" + uiKey;
      if (globalStores[key]) {
        return get_store_value(globalStores[key])
      } else {
        return false
      }
    };

    // get a local persistant store by key or initialize a new one if it doens't exist
    const getGlobalStore = (key) => {
      if(!globalStores[key]) {
        let persistedStoreJSON = localStorage.getItem(key);
        let persistedStore;
        try {
          persistedStore = JSON.parse(persistedStoreJSON);
        } catch (e) {
          console.log(e);
        }
        //console.log("localStorage store", key, persistedStore)
        globalStores[key] = writable(persistedStore);   
      }
      return globalStores[key]
    };

    // save current ui state, but also debounce
    // needs to be called *after* all changes are done
    // (alternatively the debounce should go in the different direction)
    const takeUiSnapshot = (debounceBeforeMs = 0) => {
      uiHistoryStore.update(arr => {
        //console.log(arr)
        //if (typeof arr != "array") return


        // get values from current stores
        let stores = {};
        for (let key in globalStores) {
          stores[key] = get_store_value(globalStores[key]);
        }

        // construct new entry
        const newEntry = {
          globalStores: stores,
            date: new Date(),
              id: Date.now()
        };

        let method = "pushState";

        // replace latest entry when it is less than debounceStreakMs ago
        if (arr.length > 0) {
          if (arr[arr.length - 1].date.getTime() + debounceBeforeMs > Date.now()) {
            // ...by removing the last entry before adding the new one
            arr.pop();
            method = "replaceState";
          }
        }

        const result = [...arr, newEntry];

        console.log("ui snapshot", method, result);

        if (window) {
          window.history[method]({ id: newEntry.id}, newEntry.id); // use browser history api to store the id
        }

        return result
      });
    };

    const restoreUiSnapshot = id => {
      const history = get_store_value(uiHistoryStore);
      const entry = history.find(e => e.id === id);
      if (entry) {
        console.log("restoring ui snapshot", entry);
        for (let key in globalStores) {
          if (typeof entry.globalStores[key] !== "undefined") {
            // replace existing content
            globalStores[key].set(entry.globalStores[key]);
          } else {
            // remove stores that are not in the snapshot
            globalStores[key].set(null);
            //delete globalStores[key]
          }
        }
        console.log(globalStores);
        // there is no way to remove stores, so no need to check if there are stores in the snapshot that are not there anymore
        return entry
      } else {
        return false
      }
    };

    const initApp = async () => {

      await loadConfig();
      await getProjectId();

      let updating = false;
      if (Capacitor$1.isNative) {
        updating = await checkForUpdates();
      }
      if (!updating) {
        await connect();
        return true;
      }
    };

    // create a user that is identified by a project specific userToken
    const createProjectTokenUser = async ({ userToken, projectData } = {}) => {
      //console.log("createProjectTokenUser")
      const result = await server.call("createProjectTokenUser", {
        userToken,
        projectId: get_store_value(projectId),
        projectData
      });
      return result
    };

    const loginTokenUser = async ({ userToken }) => {
      let credentials;
      try {
        credentials = await InterkitClient.call("generateLoginCredentialsForTokenUser", { userToken });
        console.log(credentials);
        const user = await InterkitClient.login(credentials);
        return user
      } catch (error) {
        return false
      }
    };

    const createProjectTokenUserAndLogin = async ({ userToken, projectData } = {}) => {
      //console.log("createProjectTokenUser")
      const token = await InterkitClient.call("createProjectTokenUser", {
        userToken,
        projectData
      });
      const userId = await InterkitClient.loginTokenUser({ userToken: token });
      return userId ? token : false
    };

    const createProjectUser = async ({ username, password, email, projectData, projectId }) => {
        const result = await InterkitClient.call("createProjectUser", {
          username,
          password,
          email,
          projectData,
          projectId
        });
        return result
      };

    const saveUserPushnotificationRegistrationToken = async () => {
      if (!userId || !pushnotificationRegistrationToken) {
        console.log('saveUserPushnotificationRegistrationToken bailing, because something\'s missing', { userId, pushnotificationRegistrationToken });
        return
      }
      let result;
      try {
        const token = get_store_value(InterkitClient.pushnotificationRegistrationToken);
        if (!token) {
          console.log('saveUserPushnotificationRegistrationToken bailing, because no token', token);
          return
        }
        result = await InterkitClient.call(
          'user.savePushnotificationRegistrationToken',
          { token }
        );
      } catch (error) {
        console.error('saveUserPushnotificationRegistrationToken error', error);
        return false
      }
      return result
    };

    const userHeartbeat = async (isAwake) => {
      let result;
      try {
        result = await InterkitClient.call('user.heartbeat', { isAwake, userId: get_store_value(InterkitClient.userId) });
      } catch (error) {
        console.error('userHeartbeat error, maybe called before connect?', error);
        return false
      }
      return result
    };

    const login = async ({ username, password }) => {
      //console.log(server)
      let userAuthData = await server.login({
        password,
        user: {
          username
        }
      });
      console.log(userAuthData);
      userId.set(userAuthData.id);
      localStorage.setItem('userId', userAuthData.id);
      localStorage.setItem('userAuth', JSON.stringify(userAuthData));
      return userAuthData
    };

    const logout = async () => {
        await server.logout();
        userId.set(null);
        localStorage.setItem('userId', null);
        localStorage.setItem('userAuth', null);
      };

    // call a meteor method, add projectId to params if needed (allow method calls without params)
    const call = async (method, params = {}) => {

        if (config && params && !params?.projectId) {
          //console.log("adding projectId to method params", params, method)
          params.projectId = get_store_value(projectId);
        }

        if (params && !params?.projectId) {
          console.log("warning, call to method before projectId has been retreived:" + method);
        }

        let response = await server.call(method, params);
        return response
      };


    const getMediaFile = async (key) => {
      if (key) {
        let store = await getMediaFileSubStore();
        let mediafile = get_store_value(store)?.find(m => m.meta.key == key);
        if (mediafile) {
          mediafile.link =
            `${get_store_value(config).INTERKIT_SERVER_URL}/cdn/storage/mediafiles/${mediafile._id}/original/${mediafile._id}.${mediafile.ext}`;
        }
        return mediafile
      } else {
        console.log("call of getMediaFile with no key", key, typeof key);
      }
    };

    const getUploadEndpoint = () =>
        `${get_store_value(config)?.INTERKIT_SERVER_URL}/mediaUpload`;

    const getSheet = async (key) => {
      if (!sheetSub) {
        // no subscription to media files yet, set it up
        sheetSub = new Promise(async (resolve, reject) => {
          //console.log("creating subscription for sheets")
          let ssub = await getSub("sheets", "sheets", {});
          resolve(ssub);
        });
      }
      let sub = await sheetSub;
      let sheet = get_store_value(sub?.data)?.find(m => m.key == key);
      return sheet
    };

    const setGlobalStore = (storeKey, value) => {
      let store = InterkitClient.getGlobalStore(storeKey);
      store.set(value);
      localStorage.setItem(storeKey, JSON.stringify(value));
    };

    // Properties are additional user-specific attributes to elements
    // they all exist in the same global store "elementProperties"
    // setElementProperty sets a property on an item and persist it
    const setElementProperty = (
      //store,  // a global store from getGlobalStore()
      key, // an id, typically a row key from database
      property, // name of the property
      value // value of the property
    ) => {
      const elementProperties = getGlobalStore("elementProperties");
      let storeData = get_store_value(elementProperties);
      if (!storeData) storeData = {};
      if (!storeData[key]) storeData[key] = {};
      storeData[key][property] = value;
      console.log("setElementProperty", key, property, value, storeData);
      elementProperties.set(storeData);
      localStorage.setItem("elementProperties", JSON.stringify(storeData));
    };

    const getElementProperty = (
      //store, // a global store from getGlobalStore()
      elementKey, // rowKey of the element to check
      property // name of the property, for example "bookmarked"
    ) => {
      const elementProperties = getGlobalStore("elementProperties");
      let value = get_store_value(elementProperties)?.[elementKey]?.[property];
      return value;
    };

    const loadElementPropertiesFromUser = async () => {
      const userProjectData = get_store_value(userProjectDataStore);
      if (!userProjectData) {
        // wait for data
        userProjectDataStore.subscribe(data => {
          if (!data?.elementProperties) return false
          const elementPropertiesStore = getGlobalStore("elementProperties");
          elementPropertiesStore.set(data?.elementProperties);
          return true
        });
      } else {
        // same but now
        if (!userProjectData?.elementProperties) return false
        const elementPropertiesStore = getGlobalStore("elementProperties");
        elementPropertiesStore.set(userProjectData?.elementProperties);
        return true
      }

    };

    const saveElementPropertiesToUser = async () => {
      const elementProperties = getGlobalStore("elementProperties");
      let storeData = get_store_value(elementProperties);
      console.log("saving elementProperties", storeData);
      let result;
      try {
        result = await InterkitClient.call("user.saveElementProperties", { elementProperties: storeData });
      } catch (error) {
        return false
      } finally { }
      return result
    };

    const getUiHistoryStore = () => {
      return uiHistoryStore
    };

    const setUiKey = (uiKey, value) => {
      const store = getUiKeyStore(uiKey);
      //console.log(`change ${uiKey} from ${get(uiKey)} to ${value}`)
      console.log(`change ${uiKey} to ${value}`);
      store.set(value);
    };

    const registerGlobalMethod = (key, method) => {
      //console.log("registerGlobalMethod", key)
      globalMethods[key] = method;
    };

    const callGlobalMethod = (key, options) => {
      if (globalMethods[key]) {
        //console.log("callGlobalMethod", key)
        globalMethods[key](options);
      } else {
        console.log("global method not fouund", key);
      }
    };

    projectId.subscribe(subscribeUserProjectDataStore);
    userId.subscribe(subscribeUserProjectDataStore);

    // restore elementProperties from user --> not necessary because they are also in the localstorage 
    //
    // userProjectDataStore.subscribe(data => {
    //   const elementProperties = data?.elementProperties
    //   if (elementProperties) {
    //     initElementProperties(elementProperties)
    //   }
    // })

    const InterkitClient = {
      userId,
      pushnotificationRegistrationToken,
      config,
      connected,
      projectId,
      userProjectDataStore,
      connectionIssue,
      connect,
      initApp,
      createProjectTokenUser,
      loginTokenUser,
      createProjectTokenUserAndLogin,
      createProjectUser,
      saveUserPushnotificationRegistrationToken,
      userEnableHeartbeat: enableHeartbeat,
      userHeartbeat,
      login,
      logout,
      call,
      getSub,
      getMessageSub,
      getRowSubStore,
      getOneRowSubStore,
      getMediaFileSubStore,
      getMediaFile,
      getUploadEndpoint,
      getSheet,
      getGlobalStore,
      setGlobalStore,
      setElementProperty,
      getElementProperty,
      saveElementPropertiesToUser,
      loadElementPropertiesFromUser,
      getUiKeyStore,
      takeUiSnapshot,
      restoreUiSnapshot,
      getUiHistoryStore,
      setUiKey,
      getUiKey,
      registerGlobalMethod,
      callGlobalMethod
    };

    let globalActions = [];

    const registerAction = ( {
        triggers=[], 
        method=function(){} } = {}
      ) => {
      const action = {
        triggers,
        method
      };
      //console.log("registerAction", action)
      globalActions.push(action);
    };

    const registerActions = actions => {
      for (let action of actions) {
        registerAction(action);
      }
    };

    const executeTrigger = (trigger, payload) => {
      console.log("executeTrigger", trigger, payload);
      let actionsTriggered = 0;
      for (let action of globalActions) {
        if (action.triggers && action.triggers.indexOf(trigger) > -1) {
          actionsTriggered += 1;
          console.log("action triggered", action, payload);
          action.method({
            timestamp: Date.now(),
            payload
          });
        }
      }
      if(actionsTriggered == 0) {
        console.log(`trigger "${trigger}" did not trigger any action`);
      }
    };

    var initActions = () => registerActions([
      {
        triggers: [],
        method: function (arg) {}
      }
    ]);

    /* ../../../packages/interkit/components/Styling.svelte generated by Svelte v3.35.0 */

    function create_if_block_1$3(ctx) {
    	let link0;
    	let t;
    	let link1;
    	let link1_href_value;

    	return {
    		c() {
    			link0 = element("link");
    			t = space();
    			link1 = element("link");
    			attr(link0, "rel", "preconnect");
    			attr(link0, "href", "https://fonts.gstatic.com");
    			attr(link1, "href", link1_href_value = `https://fonts.googleapis.com/css2?family=${/*googleFont*/ ctx[0]}&display=swap`);
    			attr(link1, "rel", "stylesheet");
    		},
    		m(target, anchor) {
    			insert(target, link0, anchor);
    			insert(target, t, anchor);
    			insert(target, link1, anchor);
    		},
    		p(ctx, dirty) {
    			if (dirty & /*googleFont*/ 1 && link1_href_value !== (link1_href_value = `https://fonts.googleapis.com/css2?family=${/*googleFont*/ ctx[0]}&display=swap`)) {
    				attr(link1, "href", link1_href_value);
    			}
    		},
    		d(detaching) {
    			if (detaching) detach(link0);
    			if (detaching) detach(t);
    			if (detaching) detach(link1);
    		}
    	};
    }

    // (133:2) {#if googleFont2}
    function create_if_block$6(ctx) {
    	let link0;
    	let t;
    	let link1;
    	let link1_href_value;

    	return {
    		c() {
    			link0 = element("link");
    			t = space();
    			link1 = element("link");
    			attr(link0, "rel", "preconnect");
    			attr(link0, "href", "https://fonts.gstatic.com");
    			attr(link1, "href", link1_href_value = `https://fonts.googleapis.com/css2?family=${/*googleFont2*/ ctx[1]}&display=swap`);
    			attr(link1, "rel", "stylesheet");
    		},
    		m(target, anchor) {
    			insert(target, link0, anchor);
    			insert(target, t, anchor);
    			insert(target, link1, anchor);
    		},
    		p(ctx, dirty) {
    			if (dirty & /*googleFont2*/ 2 && link1_href_value !== (link1_href_value = `https://fonts.googleapis.com/css2?family=${/*googleFont2*/ ctx[1]}&display=swap`)) {
    				attr(link1, "href", link1_href_value);
    			}
    		},
    		d(detaching) {
    			if (detaching) detach(link0);
    			if (detaching) detach(t);
    			if (detaching) detach(link1);
    		}
    	};
    }

    function create_fragment$f(ctx) {
    	let div;
    	let div_style_value;
    	let t;
    	let if_block0_anchor;
    	let if_block1_anchor;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[17].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[16], null);
    	let if_block0 = /*googleFont*/ ctx[0] && create_if_block_1$3(ctx);
    	let if_block1 = /*googleFont2*/ ctx[1] && create_if_block$6(ctx);

    	return {
    		c() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			t = space();
    			if (if_block0) if_block0.c();
    			if_block0_anchor = empty();
    			if (if_block1) if_block1.c();
    			if_block1_anchor = empty();
    			attr(div, "class", "style svelte-f4cj0i");

    			attr(div, "style", div_style_value = `

  /* from user */

  --color-text: ${/*colorText*/ ctx[2]};
  --color-text-headline: ${/*colorTextHeadline*/ ctx[3]};
  --color-text-button-primary: ${/*colorTextButtonPrimary*/ ctx[4]};
  --color-background: ${/*colorBackground*/ ctx[5]};
  --color-background-highlight: ${/*colorBackgroundHighlight*/ ctx[6]};
  --color-border: ${/*colorBorder*/ ctx[7]};
  --font-family-text: ${/*fontFamilyText*/ ctx[8]};
  --font-family-headline: ${/*fontFamilyHeadline*/ ctx[9]};
  --border-radius: ${/*borderRadius*/ ctx[10]};
  --border-radius-button: ${/*borderRadiusButton*/ ctx[11]};
  --border-width: ${/*borderWidth*/ ctx[12]};
  --box-shadow: ${/*boxShadow*/ ctx[13]};
  --distance-scale-factor: ${parseFloat(/*distanceScaleFactor*/ ctx[14]) || 1};
  --font-size-headline-1: ${/*fontSizeHeadline1*/ ctx[15]};
  --distance-base: 8px;

  /* constant */

  --distance-tiny: 2px;

  /* derived defaults */

  --border-color: var(--color-text);
  --color-background-button-primary: var(--color-text);
  --color-text-button: var(--color-text);
  --color-background-button: var(--color-background);

  --distance-xs: calc(var(--distance-base) * var(--distance-scale-factor) / 2.0);
  --distance-s: calc(var(--distance-base) * var(--distance-scale-factor) / 1);
  --distance-m: calc(var(--distance-base) * var(--distance-scale-factor) * 2);
  --distance-l: calc(var(--distance-base) * var(--distance-scale-factor) * 4);
  --distance-xl: calc(var(--distance-base) * var(--distance-scale-factor) * 6);
  --distance-xxl: calc(var(--distance-base) * var(--distance-scale-factor) * 8);
  
  --font-headline-1: 400 48px/56px var(--font-family-headline);
  --font-headline-2: 400 30px/36px var(--font-family-headline);
  --font-headline-3: 400 24px/32px var(--font-family-headline);
  --font-headline-4: 700 20px/24px var(--font-family-headline);
  --font-headline-5: 700 16px/24px var(--font-family-headline);
  --font-body-1: 400 16px/24px var(--font-family-text);
  --font-body-2: 400 14px/21px var(--font-family-text);
  --font-subtitle-1: 400 16px/24px var(--font-family-text);
  --font-subtitle-2: 500 14px/24px var(--font-family-text);
  --font-button: 600 12px/16px var(--font-family-text);
  --font-caption: 400 12px/16px var(--font-family-text);
  --font-caption-bold: 700 12px/16px var(--font-family-text);
  --font-overline: 500 10px/12px var(--font-family-text);

  --letter-spacing-headline-2: -0.5px;
  --letter-spacing-headline-3: -0.25px;
  --letter-spacing-headline-4: -0.25px;
  --letter-spacing-headline-5: -0.02em;
  --letter-spacing-body-1: -0.25px;
  --letter-spacing-subtitle-1: -0.15px;
  --letter-spacing-subtitle-2: 0.1px;
  --letter-spacing-overline: 1.5px;

  /* to inherit */

  font-family: var(--font-family-text);
  color: var(--color-text);

  `);
    		},
    		m(target, anchor) {
    			insert(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			insert(target, t, anchor);
    			if (if_block0) if_block0.m(document.head, null);
    			append(document.head, if_block0_anchor);
    			if (if_block1) if_block1.m(document.head, null);
    			append(document.head, if_block1_anchor);
    			current = true;
    		},
    		p(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 65536) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[16], dirty, null, null);
    				}
    			}

    			if (!current || dirty & /*colorText, colorTextHeadline, colorTextButtonPrimary, colorBackground, colorBackgroundHighlight, colorBorder, fontFamilyText, fontFamilyHeadline, borderRadius, borderRadiusButton, borderWidth, boxShadow, distanceScaleFactor, fontSizeHeadline1*/ 65532 && div_style_value !== (div_style_value = `

  /* from user */

  --color-text: ${/*colorText*/ ctx[2]};
  --color-text-headline: ${/*colorTextHeadline*/ ctx[3]};
  --color-text-button-primary: ${/*colorTextButtonPrimary*/ ctx[4]};
  --color-background: ${/*colorBackground*/ ctx[5]};
  --color-background-highlight: ${/*colorBackgroundHighlight*/ ctx[6]};
  --color-border: ${/*colorBorder*/ ctx[7]};
  --font-family-text: ${/*fontFamilyText*/ ctx[8]};
  --font-family-headline: ${/*fontFamilyHeadline*/ ctx[9]};
  --border-radius: ${/*borderRadius*/ ctx[10]};
  --border-radius-button: ${/*borderRadiusButton*/ ctx[11]};
  --border-width: ${/*borderWidth*/ ctx[12]};
  --box-shadow: ${/*boxShadow*/ ctx[13]};
  --distance-scale-factor: ${parseFloat(/*distanceScaleFactor*/ ctx[14]) || 1};
  --font-size-headline-1: ${/*fontSizeHeadline1*/ ctx[15]};
  --distance-base: 8px;

  /* constant */

  --distance-tiny: 2px;

  /* derived defaults */

  --border-color: var(--color-text);
  --color-background-button-primary: var(--color-text);
  --color-text-button: var(--color-text);
  --color-background-button: var(--color-background);

  --distance-xs: calc(var(--distance-base) * var(--distance-scale-factor) / 2.0);
  --distance-s: calc(var(--distance-base) * var(--distance-scale-factor) / 1);
  --distance-m: calc(var(--distance-base) * var(--distance-scale-factor) * 2);
  --distance-l: calc(var(--distance-base) * var(--distance-scale-factor) * 4);
  --distance-xl: calc(var(--distance-base) * var(--distance-scale-factor) * 6);
  --distance-xxl: calc(var(--distance-base) * var(--distance-scale-factor) * 8);
  
  --font-headline-1: 400 48px/56px var(--font-family-headline);
  --font-headline-2: 400 30px/36px var(--font-family-headline);
  --font-headline-3: 400 24px/32px var(--font-family-headline);
  --font-headline-4: 700 20px/24px var(--font-family-headline);
  --font-headline-5: 700 16px/24px var(--font-family-headline);
  --font-body-1: 400 16px/24px var(--font-family-text);
  --font-body-2: 400 14px/21px var(--font-family-text);
  --font-subtitle-1: 400 16px/24px var(--font-family-text);
  --font-subtitle-2: 500 14px/24px var(--font-family-text);
  --font-button: 600 12px/16px var(--font-family-text);
  --font-caption: 400 12px/16px var(--font-family-text);
  --font-caption-bold: 700 12px/16px var(--font-family-text);
  --font-overline: 500 10px/12px var(--font-family-text);

  --letter-spacing-headline-2: -0.5px;
  --letter-spacing-headline-3: -0.25px;
  --letter-spacing-headline-4: -0.25px;
  --letter-spacing-headline-5: -0.02em;
  --letter-spacing-body-1: -0.25px;
  --letter-spacing-subtitle-1: -0.15px;
  --letter-spacing-subtitle-2: 0.1px;
  --letter-spacing-overline: 1.5px;

  /* to inherit */

  font-family: var(--font-family-text);
  color: var(--color-text);

  `)) {
    				attr(div, "style", div_style_value);
    			}

    			if (/*googleFont*/ ctx[0]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_1$3(ctx);
    					if_block0.c();
    					if_block0.m(if_block0_anchor.parentNode, if_block0_anchor);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*googleFont2*/ ctx[1]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block$6(ctx);
    					if_block1.c();
    					if_block1.m(if_block1_anchor.parentNode, if_block1_anchor);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}
    		},
    		i(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d(detaching) {
    			if (detaching) detach(div);
    			if (default_slot) default_slot.d(detaching);
    			if (detaching) detach(t);
    			if (if_block0) if_block0.d(detaching);
    			detach(if_block0_anchor);
    			if (if_block1) if_block1.d(detaching);
    			detach(if_block1_anchor);
    		}
    	};
    }

    function instance$f($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	let { googleFont = "Inter:wght@400;500;600;700" } = $$props; // regular medium semi-bold bold
    	let { googleFont2 = "Inter:wght@400;500;600;700" } = $$props;
    	let { colorText = "#32332e" } = $$props;
    	let { colorTextHeadline = "#32332e" } = $$props;
    	let { colorTextButtonPrimary = "white" } = $$props;
    	let { colorBackground = "white" } = $$props;
    	let { colorBackgroundHighlight = "#F0F6F6" } = $$props;
    	let { colorBorder = "black" } = $$props;
    	let { fontFamilyText = "Inter, -apple-system, BlinkMacSystemFont, \"Helvetica Neue\", \"Roboto\", sans-serif" } = $$props;
    	let { fontFamilyHeadline = "Inter, -apple-system, BlinkMacSystemFont, \"Helvetica Neue\", \"Roboto\", sans-serif" } = $$props;
    	let { borderRadius = "16px" } = $$props;
    	let { borderRadiusButton = "16px" } = $$props;
    	let { borderWidth = "1px" } = $$props;
    	let { boxShadow = "none" } = $$props;
    	let { distanceScaleFactor = "1.0" } = $$props;
    	let { fontSizeHeadline1 = "30px" } = $$props;

    	onMount(async () => {
    		
    	});

    	$$self.$$set = $$props => {
    		if ("googleFont" in $$props) $$invalidate(0, googleFont = $$props.googleFont);
    		if ("googleFont2" in $$props) $$invalidate(1, googleFont2 = $$props.googleFont2);
    		if ("colorText" in $$props) $$invalidate(2, colorText = $$props.colorText);
    		if ("colorTextHeadline" in $$props) $$invalidate(3, colorTextHeadline = $$props.colorTextHeadline);
    		if ("colorTextButtonPrimary" in $$props) $$invalidate(4, colorTextButtonPrimary = $$props.colorTextButtonPrimary);
    		if ("colorBackground" in $$props) $$invalidate(5, colorBackground = $$props.colorBackground);
    		if ("colorBackgroundHighlight" in $$props) $$invalidate(6, colorBackgroundHighlight = $$props.colorBackgroundHighlight);
    		if ("colorBorder" in $$props) $$invalidate(7, colorBorder = $$props.colorBorder);
    		if ("fontFamilyText" in $$props) $$invalidate(8, fontFamilyText = $$props.fontFamilyText);
    		if ("fontFamilyHeadline" in $$props) $$invalidate(9, fontFamilyHeadline = $$props.fontFamilyHeadline);
    		if ("borderRadius" in $$props) $$invalidate(10, borderRadius = $$props.borderRadius);
    		if ("borderRadiusButton" in $$props) $$invalidate(11, borderRadiusButton = $$props.borderRadiusButton);
    		if ("borderWidth" in $$props) $$invalidate(12, borderWidth = $$props.borderWidth);
    		if ("boxShadow" in $$props) $$invalidate(13, boxShadow = $$props.boxShadow);
    		if ("distanceScaleFactor" in $$props) $$invalidate(14, distanceScaleFactor = $$props.distanceScaleFactor);
    		if ("fontSizeHeadline1" in $$props) $$invalidate(15, fontSizeHeadline1 = $$props.fontSizeHeadline1);
    		if ("$$scope" in $$props) $$invalidate(16, $$scope = $$props.$$scope);
    	};

    	return [
    		googleFont,
    		googleFont2,
    		colorText,
    		colorTextHeadline,
    		colorTextButtonPrimary,
    		colorBackground,
    		colorBackgroundHighlight,
    		colorBorder,
    		fontFamilyText,
    		fontFamilyHeadline,
    		borderRadius,
    		borderRadiusButton,
    		borderWidth,
    		boxShadow,
    		distanceScaleFactor,
    		fontSizeHeadline1,
    		$$scope,
    		slots
    	];
    }

    class Styling extends SvelteComponent {
    	constructor(options) {
    		super();

    		init(this, options, instance$f, create_fragment$f, safe_not_equal, {
    			googleFont: 0,
    			googleFont2: 1,
    			colorText: 2,
    			colorTextHeadline: 3,
    			colorTextButtonPrimary: 4,
    			colorBackground: 5,
    			colorBackgroundHighlight: 6,
    			colorBorder: 7,
    			fontFamilyText: 8,
    			fontFamilyHeadline: 9,
    			borderRadius: 10,
    			borderRadiusButton: 11,
    			borderWidth: 12,
    			boxShadow: 13,
    			distanceScaleFactor: 14,
    			fontSizeHeadline1: 15
    		});
    	}
    }

    /* ../../../packages/interkit/components/AppBase.svelte generated by Svelte v3.35.0 */

    const { document: document_1, window: window_1 } = globals;
    const get_viewport_slot_changes = dirty => ({});
    const get_viewport_slot_context = ctx => ({});
    const get_desktopFallback_slot_changes = dirty => ({});
    const get_desktopFallback_slot_context = ctx => ({});

    // (102:4) {:else}
    function create_else_block_1(ctx) {
    	let div;
    	let p;
    	let t1;
    	let if_block = /*$connectionIssue*/ ctx[3] && create_if_block_2$2(ctx);

    	return {
    		c() {
    			div = element("div");
    			p = element("p");
    			p.textContent = "laden....";
    			t1 = space();
    			if (if_block) if_block.c();
    			attr(p, "class", "static-loading-indicator");
    			attr(div, "class", "Loading");
    		},
    		m(target, anchor) {
    			insert(target, div, anchor);
    			append(div, p);
    			append(div, t1);
    			if (if_block) if_block.m(div, null);
    		},
    		p(ctx, dirty) {
    			if (/*$connectionIssue*/ ctx[3]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_2$2(ctx);
    					if_block.c();
    					if_block.m(div, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d(detaching) {
    			if (detaching) detach(div);
    			if (if_block) if_block.d();
    		}
    	};
    }

    // (95:4) {#if $projectId && initComplete}
    function create_if_block$5(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block_1$2, create_else_block$2];
    	const if_blocks = [];

    	function select_block_type_1(ctx, dirty) {
    		if (/*$$slots*/ ctx[12].desktopFallback && /*$isDesktop*/ ctx[2]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type_1(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	return {
    		c() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type_1(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach(if_block_anchor);
    		}
    	};
    }

    // (105:8) {#if $connectionIssue}
    function create_if_block_2$2(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	return {
    		c() {
    			button = element("button");
    			button.textContent = "verbinden";
    			attr(button, "class", "network-reload");
    		},
    		m(target, anchor) {
    			insert(target, button, anchor);

    			if (!mounted) {
    				dispose = listen(button, "click", /*retry*/ ctx[10]);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d(detaching) {
    			if (detaching) detach(button);
    			mounted = false;
    			dispose();
    		}
    	};
    }

    // (98:6) {:else}
    function create_else_block$2(ctx) {
    	let t;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[14].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[15], null);
    	const viewport_slot_template = /*#slots*/ ctx[14].viewport;
    	const viewport_slot = create_slot(viewport_slot_template, ctx, /*$$scope*/ ctx[15], get_viewport_slot_context);

    	return {
    		c() {
    			if (default_slot) default_slot.c();
    			t = space();
    			if (viewport_slot) viewport_slot.c();
    		},
    		m(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			insert(target, t, anchor);

    			if (viewport_slot) {
    				viewport_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 32768) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[15], dirty, null, null);
    				}
    			}

    			if (viewport_slot) {
    				if (viewport_slot.p && dirty & /*$$scope*/ 32768) {
    					update_slot(viewport_slot, viewport_slot_template, ctx, /*$$scope*/ ctx[15], dirty, get_viewport_slot_changes, get_viewport_slot_context);
    				}
    			}
    		},
    		i(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			transition_in(viewport_slot, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(default_slot, local);
    			transition_out(viewport_slot, local);
    			current = false;
    		},
    		d(detaching) {
    			if (default_slot) default_slot.d(detaching);
    			if (detaching) detach(t);
    			if (viewport_slot) viewport_slot.d(detaching);
    		}
    	};
    }

    // (96:6) {#if $$slots.desktopFallback && $isDesktop}
    function create_if_block_1$2(ctx) {
    	let current;
    	const desktopFallback_slot_template = /*#slots*/ ctx[14].desktopFallback;
    	const desktopFallback_slot = create_slot(desktopFallback_slot_template, ctx, /*$$scope*/ ctx[15], get_desktopFallback_slot_context);

    	return {
    		c() {
    			if (desktopFallback_slot) desktopFallback_slot.c();
    		},
    		m(target, anchor) {
    			if (desktopFallback_slot) {
    				desktopFallback_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p(ctx, dirty) {
    			if (desktopFallback_slot) {
    				if (desktopFallback_slot.p && dirty & /*$$scope*/ 32768) {
    					update_slot(desktopFallback_slot, desktopFallback_slot_template, ctx, /*$$scope*/ ctx[15], dirty, get_desktopFallback_slot_changes, get_desktopFallback_slot_context);
    				}
    			}
    		},
    		i(local) {
    			if (current) return;
    			transition_in(desktopFallback_slot, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(desktopFallback_slot, local);
    			current = false;
    		},
    		d(detaching) {
    			if (desktopFallback_slot) desktopFallback_slot.d(detaching);
    		}
    	};
    }

    // (94:2) <Styling>
    function create_default_slot$3(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$5, create_else_block_1];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*$projectId*/ ctx[1] && /*initComplete*/ ctx[0]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	return {
    		c() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach(if_block_anchor);
    		}
    	};
    }

    function create_fragment$e(ctx) {
    	let div;
    	let styling;
    	let t0;
    	let title_value;
    	let style;
    	let current;
    	let mounted;
    	let dispose;

    	styling = new Styling({
    			props: {
    				$$slots: { default: [create_default_slot$3] },
    				$$scope: { ctx }
    			}
    		});

    	document_1.title = title_value = /*$config*/ ctx[4]?.project_slug;

    	return {
    		c() {
    			div = element("div");
    			create_component(styling.$$.fragment);
    			t0 = space();
    			style = element("style");
    			style.textContent = "html, body, div, span, applet, object, iframe,\n    h1, h2, h3, h4, h5, h6, p, blockquote, pre,\n    a, abbr, acronym, address, big, cite, code,\n    del, dfn, em, img, ins, kbd, q, s, samp,\n    small, strike, strong, sub, sup, tt, var,\n    b, u, i, center,\n    dl, dt, dd, ol, ul, li,\n    fieldset, form, label, legend,\n    table, caption, tbody, tfoot, thead, tr, th, td,\n    article, aside, canvas, details, embed, \n    figure, figcaption, footer, header, hgroup, \n    menu, nav, output, ruby, section, summary, button,\n    time, mark, audio, video {\n      margin: 0;\n      padding: 0;\n    }\n    /* HTML5 display-role reset for older browsers */\n    article, aside, details, figcaption, figure, \n    footer, header, hgroup, menu, nav, section {\n      display: block;\n    }\n    body {\n      line-height: 1;\n    }\n    ol, ul {\n      list-style: none;\n    }\n    blockquote, q {\n      quotes: none;\n    }\n    blockquote:before, blockquote:after,\n    q:before, q:after {\n      content: '';\n      content: none;\n    }\n    table {\n      border-collapse: collapse;\n      border-spacing: 0;\n    }\n\n    /* headlines not bold */\n    h1, h2, h3, h4, h5 {\n      font-weight: normal;\n    }\n\n    /* buttons no special */\n    button {\n      background-color: transparent;\n      border-radius: 0;\n      border-style: none;\n    }\n\n    /* Make images easier to work with */\n    img {\n      max-width: 100%;\n      display: block;\n    }\n\n    /* Inherit fonts for inputs and buttons */\n    input,\n    button,\n    textarea,\n    select {\n      font: inherit;\n    }\n\n    /* Remove all animations and transitions for people that prefer not to see them */\n    @media (prefers-reduced-motion: reduce) {\n      * {\n        animation-duration: 0.01ms !important;\n        animation-iteration-count: 1 !important;\n        transition-duration: 0.01ms !important;\n        scroll-behavior: auto !important;\n      }\n    }\n\n    /* Styling for loading indikator */\n    .Loading {\n      padding: 20px;\n    }\n    .Loading button {\n      padding: 5px;\n      margin-top: 5px;\n    }\n\n    .AppBase {\n      padding: env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left);  \n      box-sizing: border-box;\n    }";
    			attr(div, "class", "AppBase Theming svelte-dce6nt");
    			attr(div, "id", "Theming");
    		},
    		m(target, anchor) {
    			insert(target, div, anchor);
    			mount_component(styling, div, null);
    			insert(target, t0, anchor);
    			append(document_1.head, style);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen(window_1, "popstate", /*popState*/ ctx[11]),
    					listen(window_1, "message", receiveMessage)
    				];

    				mounted = true;
    			}
    		},
    		p(ctx, [dirty]) {
    			const styling_changes = {};

    			if (dirty & /*$$scope, $$slots, $isDesktop, $projectId, initComplete, $connectionIssue*/ 36879) {
    				styling_changes.$$scope = { dirty, ctx };
    			}

    			styling.$set(styling_changes);

    			if ((!current || dirty & /*$config*/ 16) && title_value !== (title_value = /*$config*/ ctx[4]?.project_slug)) {
    				document_1.title = title_value;
    			}
    		},
    		i(local) {
    			if (current) return;
    			transition_in(styling.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(styling.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			if (detaching) detach(div);
    			destroy_component(styling);
    			if (detaching) detach(t0);
    			detach(style);
    			mounted = false;
    			run_all(dispose);
    		}
    	};
    }

    const desktopMQ = "(min-width: 600px)";

    function receiveMessage(event) {
    	switch (event.data) {
    		case "go_back":
    			history.back();
    			break;
    		case "go_forward":
    			history.forward();
    			break;
    		case "clear_localStorage":
    			localStorage.clear();
    			break;
    	}
    }

    function instance$e($$self, $$props, $$invalidate) {
    	let $userId;
    	let $projectId;
    	let $isDesktop;
    	let $connectionIssue;
    	let $config;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	const $$slots = compute_slots(slots);
    	let initComplete = false;
    	let userId = InterkitClient.userId;
    	component_subscribe($$self, userId, value => $$invalidate(13, $userId = value));
    	const bypassDesktopFallback = (/\bbypassDesktopFallback=1\b/).test(document.location.search + document.location.hash);
    	const isDesktop = writable(!bypassDesktopFallback && window.matchMedia?.(desktopMQ)?.matches);
    	component_subscribe($$self, isDesktop, value => $$invalidate(2, $isDesktop = value));
    	setContext("isDesktop", isDesktop);

    	onMount(async () => {
    		$$invalidate(0, initComplete = await InterkitClient.initApp());
    		executeTrigger("start");

    		// we're doing this here, maybe again, to be sure,
    		// because the async interdependencies
    		// (capacitor plugin, interkit client, meteor)
    		// are hard to get completely right
    		InterkitClient.saveUserPushnotificationRegistrationToken();
    	});

    	let config = InterkitClient.config;
    	component_subscribe($$self, config, value => $$invalidate(4, $config = value));
    	let projectId = InterkitClient.projectId;
    	component_subscribe($$self, projectId, value => $$invalidate(1, $projectId = value));
    	let connectionIssue = InterkitClient.connectionIssue;
    	component_subscribe($$self, connectionIssue, value => $$invalidate(3, $connectionIssue = value));
    	const { SplashScreen } = Plugins;

    	(async () => {
    		console.log("pushNotifications...");
    		startHeartbeat();

    		await registerNotifications().then(async () => {
    			console.log("pushNotifications addListeners...");
    			await addListeners();
    			await getDeliveredNotifications();
    		}).catch(e => {
    			console.error("pushNotifications", e);
    			InterkitClient.pushnotificationRegistrationToken.set("(web)");
    		});
    	})();

    	const retry = () => {
    		window.location.reload(true);
    	};

    	function popState(event) {
    		if (event && event.state && event.state.id) {
    			const result = InterkitClient.restoreUiSnapshot(event.state.id);

    			if (result === false) {
    				history.back();
    			}
    		} else {
    			history.back();
    		}
    	}

    	$$self.$$set = $$props => {
    		if ("$$scope" in $$props) $$invalidate(15, $$scope = $$props.$$scope);
    	};

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$userId*/ 8192) {
    			// tell frame parent (=admin) the userId
    			// TODO check if we're not leaking a secret, if so, take special precautions
    			// like adding an extra (querystring) param to signal that app is running within iframe
    			// esp. the '*' targetOrigin is not very safe (would replacing the port be OK?)
    			window.parent.postMessage({ userId: $userId }, "*");
    		}

    		if ($$self.$$.dirty & /*initComplete*/ 1) {
    			{
    				if (initComplete) {
    					SplashScreen.hide();
    				}
    			}
    		}
    	};

    	return [
    		initComplete,
    		$projectId,
    		$isDesktop,
    		$connectionIssue,
    		$config,
    		userId,
    		isDesktop,
    		config,
    		projectId,
    		connectionIssue,
    		retry,
    		popState,
    		$$slots,
    		$userId,
    		slots,
    		$$scope
    	];
    }

    class AppBase extends SvelteComponent {
    	constructor(options) {
    		super();
    		init(this, options, instance$e, create_fragment$e, safe_not_equal, {});
    	}
    }

    /* ../../../packages/interkit/components/AspectRatio.svelte generated by Svelte v3.35.0 */

    function create_fragment$d(ctx) {
    	let div1;
    	let div0;
    	let div1_style_value;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[4].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[3], null);

    	return {
    		c() {
    			div1 = element("div");
    			div0 = element("div");
    			if (default_slot) default_slot.c();
    			attr(div0, "class", "inner-container svelte-kto3s9");
    			attr(div1, "class", "AspectRatio container svelte-kto3s9");
    			attr(div1, "style", div1_style_value = `--aspect-ratio: ${/*aspectRatio*/ ctx[0] * 100}%`);
    			toggle_class(div1, "standalone", /*standalone*/ ctx[1]);
    		},
    		m(target, anchor) {
    			insert(target, div1, anchor);
    			append(div1, div0);

    			if (default_slot) {
    				default_slot.m(div0, null);
    			}

    			current = true;
    		},
    		p(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 8) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[3], dirty, null, null);
    				}
    			}

    			if (!current || dirty & /*aspectRatio*/ 1 && div1_style_value !== (div1_style_value = `--aspect-ratio: ${/*aspectRatio*/ ctx[0] * 100}%`)) {
    				attr(div1, "style", div1_style_value);
    			}

    			if (dirty & /*standalone*/ 2) {
    				toggle_class(div1, "standalone", /*standalone*/ ctx[1]);
    			}
    		},
    		i(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d(detaching) {
    			if (detaching) detach(div1);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};
    }

    function instance$d($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	let { aspectRatioType = "element" } = $$props; // choose from predefined interkit types
    	let { aspectRatio = null } = $$props; // manual setting
    	let { standalone = false } = $$props; // add border
    	if (typeof standalone == "string") standalone = standalone === "TRUE"; // blockly conversion

    	const aspectRatioTypes = {
    		small_overlay: 0.46,
    		element: 0.55,
    		large_overlay: 0.74,
    		square: 1
    	};

    	aspectRatio = aspectRatio || aspectRatioTypes[aspectRatioType];

    	$$self.$$set = $$props => {
    		if ("aspectRatioType" in $$props) $$invalidate(2, aspectRatioType = $$props.aspectRatioType);
    		if ("aspectRatio" in $$props) $$invalidate(0, aspectRatio = $$props.aspectRatio);
    		if ("standalone" in $$props) $$invalidate(1, standalone = $$props.standalone);
    		if ("$$scope" in $$props) $$invalidate(3, $$scope = $$props.$$scope);
    	};

    	return [aspectRatio, standalone, aspectRatioType, $$scope, slots];
    }

    class AspectRatio extends SvelteComponent {
    	constructor(options) {
    		super();

    		init(this, options, instance$d, create_fragment$d, safe_not_equal, {
    			aspectRatioType: 2,
    			aspectRatio: 0,
    			standalone: 1
    		});
    	}
    }

    /* ../../../packages/interkit/components/MediaFileImage.svelte generated by Svelte v3.35.0 */

    function create_if_block$4(ctx) {
    	let img;
    	let img_class_value;
    	let img_src_value;

    	return {
    		c() {
    			img = element("img");
    			attr(img, "class", img_class_value = "" + (null_to_empty(`fitDimension-${/*fitDimension*/ ctx[0]} objectFit-${/*objectFit*/ ctx[1]}`) + " svelte-1ixxn05"));
    			attr(img, "alt", "mediafile");
    			if (img.src !== (img_src_value = encodeURI(/*mediafile*/ ctx[3].link))) attr(img, "src", img_src_value);
    		},
    		m(target, anchor) {
    			insert(target, img, anchor);
    		},
    		p(ctx, dirty) {
    			if (dirty & /*fitDimension, objectFit*/ 3 && img_class_value !== (img_class_value = "" + (null_to_empty(`fitDimension-${/*fitDimension*/ ctx[0]} objectFit-${/*objectFit*/ ctx[1]}`) + " svelte-1ixxn05"))) {
    				attr(img, "class", img_class_value);
    			}

    			if (dirty & /*mediafile*/ 8 && img.src !== (img_src_value = encodeURI(/*mediafile*/ ctx[3].link))) {
    				attr(img, "src", img_src_value);
    			}
    		},
    		d(detaching) {
    			if (detaching) detach(img);
    		}
    	};
    }

    function create_fragment$c(ctx) {
    	let if_block_anchor;
    	let if_block = /*mediafile*/ ctx[3] && create_if_block$4(ctx);

    	return {
    		c() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert(target, if_block_anchor, anchor);
    		},
    		p(ctx, [dirty]) {
    			if (/*mediafile*/ ctx[3]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$4(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach(if_block_anchor);
    		}
    	};
    }

    function instance$c($$self, $$props, $$invalidate) {
    	let $mediaFileStore,
    		$$unsubscribe_mediaFileStore = noop,
    		$$subscribe_mediaFileStore = () => ($$unsubscribe_mediaFileStore(), $$unsubscribe_mediaFileStore = subscribe(mediaFileStore, $$value => $$invalidate(5, $mediaFileStore = $$value)), mediaFileStore);

    	$$self.$$.on_destroy.push(() => $$unsubscribe_mediaFileStore());
    	let { fitDimension = "width" } = $$props; // width or height is 100%
    	let { objectFit = "cover" } = $$props; // contain or cover
    	let { mediafileRef } = $$props; // {type: "mediafile", value: id}

    	//onMount(()=>{ console.log("mount", mediafileRef) })
    	let mediaFileStore;

    	let mediafile;

    	const lookupMediafile = async (ref, data) => {
    		//console.log("lookupMediafile", ref)
    		let key = ref?.value;

    		if (key) {
    			$$invalidate(3, mediafile = await InterkitClient.getMediaFile(key));
    		} else {
    			$$invalidate(3, mediafile = null);
    		}
    	};

    	onMount(async () => {
    		$$subscribe_mediaFileStore($$invalidate(2, mediaFileStore = await InterkitClient.getMediaFileSubStore()));
    	});

    	$$self.$$set = $$props => {
    		if ("fitDimension" in $$props) $$invalidate(0, fitDimension = $$props.fitDimension);
    		if ("objectFit" in $$props) $$invalidate(1, objectFit = $$props.objectFit);
    		if ("mediafileRef" in $$props) $$invalidate(4, mediafileRef = $$props.mediafileRef);
    	};

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*mediaFileStore, mediafileRef, $mediaFileStore*/ 52) {
    			{
    				if (mediaFileStore) lookupMediafile(mediafileRef);
    			}
    		}
    	};

    	return [
    		fitDimension,
    		objectFit,
    		mediaFileStore,
    		mediafile,
    		mediafileRef,
    		$mediaFileStore
    	];
    }

    class MediaFileImage extends SvelteComponent {
    	constructor(options) {
    		super();

    		init(this, options, instance$c, create_fragment$c, safe_not_equal, {
    			fitDimension: 0,
    			objectFit: 1,
    			mediafileRef: 4
    		});
    	}
    }

    /* ../../../packages/interkit/components/Button.svelte generated by Svelte v3.35.0 */

    function create_else_block$1(ctx) {
    	let a;
    	let t0;
    	let t1_value = (/*text*/ ctx[4] || "") + "";
    	let t1;
    	let a_target_value;
    	let a_class_value;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[13].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[12], null);

    	return {
    		c() {
    			a = element("a");
    			if (default_slot) default_slot.c();
    			t0 = space();
    			t1 = text(t1_value);
    			attr(a, "href", /*clickTrigger*/ ctx[7]);

    			attr(a, "target", a_target_value = /*clickType*/ ctx[6] === "linkTargetBlank"
    			? "_blank"
    			: "_self");

    			attr(a, "class", a_class_value = "" + (null_to_empty(`Button Button--${/*type*/ ctx[1]} Button--${/*size*/ ctx[2]} button ${/*type*/ ctx[1]} ${/*size*/ ctx[2]} ${/*flex*/ ctx[3]}`) + " svelte-1gg7lmm"));
    			toggle_class(a, "primary", /*type*/ ctx[1] === "primary");
    			toggle_class(a, "selected", /*selected*/ ctx[5]);
    			toggle_class(a, "Button--selected", /*selected*/ ctx[5]);
    			toggle_class(a, "nopadding", /*nopadding*/ ctx[0]);
    		},
    		m(target, anchor) {
    			insert(target, a, anchor);

    			if (default_slot) {
    				default_slot.m(a, null);
    			}

    			append(a, t0);
    			append(a, t1);
    			current = true;
    		},
    		p(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 4096) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[12], dirty, null, null);
    				}
    			}

    			if ((!current || dirty & /*text*/ 16) && t1_value !== (t1_value = (/*text*/ ctx[4] || "") + "")) set_data(t1, t1_value);

    			if (!current || dirty & /*clickTrigger*/ 128) {
    				attr(a, "href", /*clickTrigger*/ ctx[7]);
    			}

    			if (!current || dirty & /*clickType*/ 64 && a_target_value !== (a_target_value = /*clickType*/ ctx[6] === "linkTargetBlank"
    			? "_blank"
    			: "_self")) {
    				attr(a, "target", a_target_value);
    			}

    			if (!current || dirty & /*type, size, flex*/ 14 && a_class_value !== (a_class_value = "" + (null_to_empty(`Button Button--${/*type*/ ctx[1]} Button--${/*size*/ ctx[2]} button ${/*type*/ ctx[1]} ${/*size*/ ctx[2]} ${/*flex*/ ctx[3]}`) + " svelte-1gg7lmm"))) {
    				attr(a, "class", a_class_value);
    			}

    			if (dirty & /*type, size, flex, type*/ 14) {
    				toggle_class(a, "primary", /*type*/ ctx[1] === "primary");
    			}

    			if (dirty & /*type, size, flex, selected*/ 46) {
    				toggle_class(a, "selected", /*selected*/ ctx[5]);
    			}

    			if (dirty & /*type, size, flex, selected*/ 46) {
    				toggle_class(a, "Button--selected", /*selected*/ ctx[5]);
    			}

    			if (dirty & /*type, size, flex, nopadding*/ 15) {
    				toggle_class(a, "nopadding", /*nopadding*/ ctx[0]);
    			}
    		},
    		i(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d(detaching) {
    			if (detaching) detach(a);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};
    }

    // (37:0) {#if clickType === 'payloadTrigger'}
    function create_if_block$3(ctx) {
    	let span;
    	let t0;
    	let t1_value = (/*text*/ ctx[4] || "") + "";
    	let t1;
    	let span_class_value;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[13].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[12], null);

    	return {
    		c() {
    			span = element("span");
    			if (default_slot) default_slot.c();
    			t0 = space();
    			t1 = text(t1_value);
    			attr(span, "class", span_class_value = "" + (null_to_empty(`Button Button--${/*type*/ ctx[1]} Button--${/*size*/ ctx[2]} button ${/*type*/ ctx[1]} ${/*size*/ ctx[2]} ${/*flex*/ ctx[3]}`) + " svelte-1gg7lmm"));
    			toggle_class(span, "primary", /*type*/ ctx[1] === "primary");
    			toggle_class(span, "selected", /*selected*/ ctx[5]);
    			toggle_class(span, "Button--selected", /*selected*/ ctx[5]);
    			toggle_class(span, "nopadding", /*nopadding*/ ctx[0]);
    		},
    		m(target, anchor) {
    			insert(target, span, anchor);

    			if (default_slot) {
    				default_slot.m(span, null);
    			}

    			append(span, t0);
    			append(span, t1);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen(span, "click", /*click_handler*/ ctx[14]),
    					listen(span, "click", /*handleClick*/ ctx[9])
    				];

    				mounted = true;
    			}
    		},
    		p(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 4096) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[12], dirty, null, null);
    				}
    			}

    			if ((!current || dirty & /*text*/ 16) && t1_value !== (t1_value = (/*text*/ ctx[4] || "") + "")) set_data(t1, t1_value);

    			if (!current || dirty & /*type, size, flex*/ 14 && span_class_value !== (span_class_value = "" + (null_to_empty(`Button Button--${/*type*/ ctx[1]} Button--${/*size*/ ctx[2]} button ${/*type*/ ctx[1]} ${/*size*/ ctx[2]} ${/*flex*/ ctx[3]}`) + " svelte-1gg7lmm"))) {
    				attr(span, "class", span_class_value);
    			}

    			if (dirty & /*type, size, flex, type*/ 14) {
    				toggle_class(span, "primary", /*type*/ ctx[1] === "primary");
    			}

    			if (dirty & /*type, size, flex, selected*/ 46) {
    				toggle_class(span, "selected", /*selected*/ ctx[5]);
    			}

    			if (dirty & /*type, size, flex, selected*/ 46) {
    				toggle_class(span, "Button--selected", /*selected*/ ctx[5]);
    			}

    			if (dirty & /*type, size, flex, nopadding*/ 15) {
    				toggle_class(span, "nopadding", /*nopadding*/ ctx[0]);
    			}
    		},
    		i(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d(detaching) {
    			if (detaching) detach(span);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};
    }

    function create_fragment$b(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$3, create_else_block$1];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*clickType*/ ctx[6] === "payloadTrigger") return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	return {
    		c() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach(if_block_anchor);
    		}
    	};
    }

    function instance$b($$self, $$props, $$invalidate) {
    	let $buttonPayload;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	let { nopadding = false } = $$props;
    	let { color = null } = $$props;
    	let { type = "secondary" } = $$props; // primary | secondary | ghost | link
    	let { size = "medium" } = $$props; // small | medium | large // TODO inherit from ButtonBar?
    	let { flex = "normal" } = $$props; // normal | fill
    	let { text = undefined } = $$props;
    	let { selected = false } = $$props;
    	let { clickType = "payloadTrigger" } = $$props; // link | linkTargetBlank
    	let { clickTrigger = null } = $$props; // set this to execute a trigger on button click
    	let { onClick = null } = $$props; // function to call on click if we are not using this with triggers

    	// get context from parent element, for example ContentElement and pass the payload to the action
    	const c = getContext("buttonBar");

    	const buttonPayload = c?.buttonPayload; // this is a store
    	component_subscribe($$self, buttonPayload, value => $$invalidate(15, $buttonPayload = value));

    	const handleClick = () => {
    		if (clickTrigger) executeTrigger(clickTrigger, buttonPayload ? $buttonPayload : undefined);
    		if (onClick) onClick();
    	};

    	function click_handler(event) {
    		bubble($$self, event);
    	}

    	$$self.$$set = $$props => {
    		if ("nopadding" in $$props) $$invalidate(0, nopadding = $$props.nopadding);
    		if ("color" in $$props) $$invalidate(10, color = $$props.color);
    		if ("type" in $$props) $$invalidate(1, type = $$props.type);
    		if ("size" in $$props) $$invalidate(2, size = $$props.size);
    		if ("flex" in $$props) $$invalidate(3, flex = $$props.flex);
    		if ("text" in $$props) $$invalidate(4, text = $$props.text);
    		if ("selected" in $$props) $$invalidate(5, selected = $$props.selected);
    		if ("clickType" in $$props) $$invalidate(6, clickType = $$props.clickType);
    		if ("clickTrigger" in $$props) $$invalidate(7, clickTrigger = $$props.clickTrigger);
    		if ("onClick" in $$props) $$invalidate(11, onClick = $$props.onClick);
    		if ("$$scope" in $$props) $$invalidate(12, $$scope = $$props.$$scope);
    	};

    	return [
    		nopadding,
    		type,
    		size,
    		flex,
    		text,
    		selected,
    		clickType,
    		clickTrigger,
    		buttonPayload,
    		handleClick,
    		color,
    		onClick,
    		$$scope,
    		slots,
    		click_handler
    	];
    }

    class Button extends SvelteComponent {
    	constructor(options) {
    		super();

    		init(this, options, instance$b, create_fragment$b, safe_not_equal, {
    			nopadding: 0,
    			color: 10,
    			type: 1,
    			size: 2,
    			flex: 3,
    			text: 4,
    			selected: 5,
    			clickType: 6,
    			clickTrigger: 7,
    			onClick: 11
    		});
    	}
    }

    /* ../../../packages/interkit/components/Icon.svelte generated by Svelte v3.35.0 */

    function create_fragment$a(ctx) {
    	let span;
    	let span_class_value;
    	let span_style_value;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[4].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[3], null);

    	return {
    		c() {
    			span = element("span");
    			if (default_slot) default_slot.c();
    			attr(span, "class", span_class_value = "" + (null_to_empty(`icon icon-${/*type*/ ctx[1]}`) + " svelte-1l7eikj"));
    			attr(span, "style", span_style_value = `--height: ${/*height*/ ctx[2]}`);
    			toggle_class(span, "inverse", /*inverse*/ ctx[0]);
    		},
    		m(target, anchor) {
    			insert(target, span, anchor);

    			if (default_slot) {
    				default_slot.m(span, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen(span, "click", /*click_handler*/ ctx[5]);
    				mounted = true;
    			}
    		},
    		p(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 8) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[3], dirty, null, null);
    				}
    			}

    			if (!current || dirty & /*type*/ 2 && span_class_value !== (span_class_value = "" + (null_to_empty(`icon icon-${/*type*/ ctx[1]}`) + " svelte-1l7eikj"))) {
    				attr(span, "class", span_class_value);
    			}

    			if (!current || dirty & /*height*/ 4 && span_style_value !== (span_style_value = `--height: ${/*height*/ ctx[2]}`)) {
    				attr(span, "style", span_style_value);
    			}

    			if (dirty & /*type, inverse*/ 3) {
    				toggle_class(span, "inverse", /*inverse*/ ctx[0]);
    			}
    		},
    		i(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d(detaching) {
    			if (detaching) detach(span);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			dispose();
    		}
    	};
    }

    function instance$a($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	let { type } = $$props;
    	let { height = "25px" } = $$props;
    	let { inverse = false } = $$props;
    	if (typeof inverse == "string") inverse = inverse === "TRUE"; // blockly conversion

    	function click_handler(event) {
    		bubble($$self, event);
    	}

    	$$self.$$set = $$props => {
    		if ("type" in $$props) $$invalidate(1, type = $$props.type);
    		if ("height" in $$props) $$invalidate(2, height = $$props.height);
    		if ("inverse" in $$props) $$invalidate(0, inverse = $$props.inverse);
    		if ("$$scope" in $$props) $$invalidate(3, $$scope = $$props.$$scope);
    	};

    	return [inverse, type, height, $$scope, slots, click_handler];
    }

    class Icon extends SvelteComponent {
    	constructor(options) {
    		super();
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, { type: 1, height: 2, inverse: 0 });
    	}
    }

    /* ../../../packages/interkit/components/ButtonBar.svelte generated by Svelte v3.35.0 */

    function create_fragment$9(ctx) {
    	let div1;
    	let div0;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[5].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[4], null);

    	return {
    		c() {
    			div1 = element("div");
    			div0 = element("div");
    			if (default_slot) default_slot.c();
    			attr(div0, "class", "wrap svelte-ch0tbc");
    			attr(div1, "class", "ButtonBar container svelte-ch0tbc");
    			toggle_class(div1, "left", /*isLeft*/ ctx[1]);
    			toggle_class(div1, "right", /*isRight*/ ctx[2]);
    		},
    		m(target, anchor) {
    			insert(target, div1, anchor);
    			append(div1, div0);

    			if (default_slot) {
    				default_slot.m(div0, null);
    			}

    			/*div1_binding*/ ctx[6](div1);
    			current = true;

    			if (!mounted) {
    				dispose = listen(div1, "scroll", /*scrolled*/ ctx[3], { passive: true });
    				mounted = true;
    			}
    		},
    		p(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 16) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[4], dirty, null, null);
    				}
    			}

    			if (dirty & /*isLeft*/ 2) {
    				toggle_class(div1, "left", /*isLeft*/ ctx[1]);
    			}

    			if (dirty & /*isRight*/ 4) {
    				toggle_class(div1, "right", /*isRight*/ ctx[2]);
    			}
    		},
    		i(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d(detaching) {
    			if (detaching) detach(div1);
    			if (default_slot) default_slot.d(detaching);
    			/*div1_binding*/ ctx[6](null);
    			mounted = false;
    			dispose();
    		}
    	};
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	let container;
    	let isLeft = true;
    	let isRight = true;

    	const scrolled = function (e) {
    		$$invalidate(1, isLeft = container.scrollLeft === 0);
    		$$invalidate(2, isRight = Math.abs(container.clientWidth + container.scrollLeft - container.scrollWidth) <= 1);
    		console.log(container.clientWidth + container.scrollLeft - container.scrollWidth);
    	};

    	onMount(() => {
    		scrolled();
    		window.setTimeout(scrolled, 100);
    	});

    	function div1_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			container = $$value;
    			$$invalidate(0, container);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ("$$scope" in $$props) $$invalidate(4, $$scope = $$props.$$scope);
    	};

    	return [container, isLeft, isRight, scrolled, $$scope, slots, div1_binding];
    }

    class ButtonBar extends SvelteComponent {
    	constructor(options) {
    		super();
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, {});
    	}
    }

    /**
     * marked - a markdown parser
     * Copyright (c) 2011-2021, Christopher Jeffrey. (MIT Licensed)
     * https://github.com/markedjs/marked
     */

    var marked = createCommonjsModule(function (module, exports) {
    /**
     * DO NOT EDIT THIS FILE
     * The code in this file is generated from files in ./src/
     */

    (function (global, factory) {
      module.exports = factory() ;
    }(commonjsGlobal, (function () {
      function _defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
          var descriptor = props[i];
          descriptor.enumerable = descriptor.enumerable || false;
          descriptor.configurable = true;
          if ("value" in descriptor) descriptor.writable = true;
          Object.defineProperty(target, descriptor.key, descriptor);
        }
      }

      function _createClass(Constructor, protoProps, staticProps) {
        if (protoProps) _defineProperties(Constructor.prototype, protoProps);
        if (staticProps) _defineProperties(Constructor, staticProps);
        return Constructor;
      }

      function _unsupportedIterableToArray(o, minLen) {
        if (!o) return;
        if (typeof o === "string") return _arrayLikeToArray(o, minLen);
        var n = Object.prototype.toString.call(o).slice(8, -1);
        if (n === "Object" && o.constructor) n = o.constructor.name;
        if (n === "Map" || n === "Set") return Array.from(o);
        if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
      }

      function _arrayLikeToArray(arr, len) {
        if (len == null || len > arr.length) len = arr.length;

        for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

        return arr2;
      }

      function _createForOfIteratorHelperLoose(o, allowArrayLike) {
        var it;

        if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) {
          if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
            if (it) o = it;
            var i = 0;
            return function () {
              if (i >= o.length) return {
                done: true
              };
              return {
                done: false,
                value: o[i++]
              };
            };
          }

          throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
        }

        it = o[Symbol.iterator]();
        return it.next.bind(it);
      }

      function createCommonjsModule(fn) {
        var module = { exports: {} };
      	return fn(module, module.exports), module.exports;
      }

      var defaults$5 = createCommonjsModule(function (module) {
        function getDefaults() {
          return {
            baseUrl: null,
            breaks: false,
            gfm: true,
            headerIds: true,
            headerPrefix: '',
            highlight: null,
            langPrefix: 'language-',
            mangle: true,
            pedantic: false,
            renderer: null,
            sanitize: false,
            sanitizer: null,
            silent: false,
            smartLists: false,
            smartypants: false,
            tokenizer: null,
            walkTokens: null,
            xhtml: false
          };
        }

        function changeDefaults(newDefaults) {
          module.exports.defaults = newDefaults;
        }

        module.exports = {
          defaults: getDefaults(),
          getDefaults: getDefaults,
          changeDefaults: changeDefaults
        };
      });

      /**
       * Helpers
       */
      var escapeTest = /[&<>"']/;
      var escapeReplace = /[&<>"']/g;
      var escapeTestNoEncode = /[<>"']|&(?!#?\w+;)/;
      var escapeReplaceNoEncode = /[<>"']|&(?!#?\w+;)/g;
      var escapeReplacements = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
      };

      var getEscapeReplacement = function getEscapeReplacement(ch) {
        return escapeReplacements[ch];
      };

      function escape$2(html, encode) {
        if (encode) {
          if (escapeTest.test(html)) {
            return html.replace(escapeReplace, getEscapeReplacement);
          }
        } else {
          if (escapeTestNoEncode.test(html)) {
            return html.replace(escapeReplaceNoEncode, getEscapeReplacement);
          }
        }

        return html;
      }

      var unescapeTest = /&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/ig;

      function unescape$1(html) {
        // explicitly match decimal, hex, and named HTML entities
        return html.replace(unescapeTest, function (_, n) {
          n = n.toLowerCase();
          if (n === 'colon') return ':';

          if (n.charAt(0) === '#') {
            return n.charAt(1) === 'x' ? String.fromCharCode(parseInt(n.substring(2), 16)) : String.fromCharCode(+n.substring(1));
          }

          return '';
        });
      }

      var caret = /(^|[^\[])\^/g;

      function edit$1(regex, opt) {
        regex = regex.source || regex;
        opt = opt || '';
        var obj = {
          replace: function replace(name, val) {
            val = val.source || val;
            val = val.replace(caret, '$1');
            regex = regex.replace(name, val);
            return obj;
          },
          getRegex: function getRegex() {
            return new RegExp(regex, opt);
          }
        };
        return obj;
      }

      var nonWordAndColonTest = /[^\w:]/g;
      var originIndependentUrl = /^$|^[a-z][a-z0-9+.-]*:|^[?#]/i;

      function cleanUrl$1(sanitize, base, href) {
        if (sanitize) {
          var prot;

          try {
            prot = decodeURIComponent(unescape$1(href)).replace(nonWordAndColonTest, '').toLowerCase();
          } catch (e) {
            return null;
          }

          if (prot.indexOf('javascript:') === 0 || prot.indexOf('vbscript:') === 0 || prot.indexOf('data:') === 0) {
            return null;
          }
        }

        if (base && !originIndependentUrl.test(href)) {
          href = resolveUrl(base, href);
        }

        try {
          href = encodeURI(href).replace(/%25/g, '%');
        } catch (e) {
          return null;
        }

        return href;
      }

      var baseUrls = {};
      var justDomain = /^[^:]+:\/*[^/]*$/;
      var protocol = /^([^:]+:)[\s\S]*$/;
      var domain = /^([^:]+:\/*[^/]*)[\s\S]*$/;

      function resolveUrl(base, href) {
        if (!baseUrls[' ' + base]) {
          // we can ignore everything in base after the last slash of its path component,
          // but we might need to add _that_
          // https://tools.ietf.org/html/rfc3986#section-3
          if (justDomain.test(base)) {
            baseUrls[' ' + base] = base + '/';
          } else {
            baseUrls[' ' + base] = rtrim$1(base, '/', true);
          }
        }

        base = baseUrls[' ' + base];
        var relativeBase = base.indexOf(':') === -1;

        if (href.substring(0, 2) === '//') {
          if (relativeBase) {
            return href;
          }

          return base.replace(protocol, '$1') + href;
        } else if (href.charAt(0) === '/') {
          if (relativeBase) {
            return href;
          }

          return base.replace(domain, '$1') + href;
        } else {
          return base + href;
        }
      }

      var noopTest$1 = {
        exec: function noopTest() {}
      };

      function merge$2(obj) {
        var i = 1,
            target,
            key;

        for (; i < arguments.length; i++) {
          target = arguments[i];

          for (key in target) {
            if (Object.prototype.hasOwnProperty.call(target, key)) {
              obj[key] = target[key];
            }
          }
        }

        return obj;
      }

      function splitCells$1(tableRow, count) {
        // ensure that every cell-delimiting pipe has a space
        // before it to distinguish it from an escaped pipe
        var row = tableRow.replace(/\|/g, function (match, offset, str) {
          var escaped = false,
              curr = offset;

          while (--curr >= 0 && str[curr] === '\\') {
            escaped = !escaped;
          }

          if (escaped) {
            // odd number of slashes means | is escaped
            // so we leave it alone
            return '|';
          } else {
            // add space before unescaped |
            return ' |';
          }
        }),
            cells = row.split(/ \|/);
        var i = 0;

        if (cells.length > count) {
          cells.splice(count);
        } else {
          while (cells.length < count) {
            cells.push('');
          }
        }

        for (; i < cells.length; i++) {
          // leading or trailing whitespace is ignored per the gfm spec
          cells[i] = cells[i].trim().replace(/\\\|/g, '|');
        }

        return cells;
      } // Remove trailing 'c's. Equivalent to str.replace(/c*$/, '').
      // /c*$/ is vulnerable to REDOS.
      // invert: Remove suffix of non-c chars instead. Default falsey.


      function rtrim$1(str, c, invert) {
        var l = str.length;

        if (l === 0) {
          return '';
        } // Length of suffix matching the invert condition.


        var suffLen = 0; // Step left until we fail to match the invert condition.

        while (suffLen < l) {
          var currChar = str.charAt(l - suffLen - 1);

          if (currChar === c && !invert) {
            suffLen++;
          } else if (currChar !== c && invert) {
            suffLen++;
          } else {
            break;
          }
        }

        return str.substr(0, l - suffLen);
      }

      function findClosingBracket$1(str, b) {
        if (str.indexOf(b[1]) === -1) {
          return -1;
        }

        var l = str.length;
        var level = 0,
            i = 0;

        for (; i < l; i++) {
          if (str[i] === '\\') {
            i++;
          } else if (str[i] === b[0]) {
            level++;
          } else if (str[i] === b[1]) {
            level--;

            if (level < 0) {
              return i;
            }
          }
        }

        return -1;
      }

      function checkSanitizeDeprecation$1(opt) {
        if (opt && opt.sanitize && !opt.silent) {
          console.warn('marked(): sanitize and sanitizer parameters are deprecated since version 0.7.0, should not be used and will be removed in the future. Read more here: https://marked.js.org/#/USING_ADVANCED.md#options');
        }
      } // copied from https://stackoverflow.com/a/5450113/806777


      function repeatString$1(pattern, count) {
        if (count < 1) {
          return '';
        }

        var result = '';

        while (count > 1) {
          if (count & 1) {
            result += pattern;
          }

          count >>= 1;
          pattern += pattern;
        }

        return result + pattern;
      }

      var helpers = {
        escape: escape$2,
        unescape: unescape$1,
        edit: edit$1,
        cleanUrl: cleanUrl$1,
        resolveUrl: resolveUrl,
        noopTest: noopTest$1,
        merge: merge$2,
        splitCells: splitCells$1,
        rtrim: rtrim$1,
        findClosingBracket: findClosingBracket$1,
        checkSanitizeDeprecation: checkSanitizeDeprecation$1,
        repeatString: repeatString$1
      };

      var defaults$4 = defaults$5.defaults;
      var rtrim = helpers.rtrim,
          splitCells = helpers.splitCells,
          _escape = helpers.escape,
          findClosingBracket = helpers.findClosingBracket;

      function outputLink(cap, link, raw) {
        var href = link.href;
        var title = link.title ? _escape(link.title) : null;
        var text = cap[1].replace(/\\([\[\]])/g, '$1');

        if (cap[0].charAt(0) !== '!') {
          return {
            type: 'link',
            raw: raw,
            href: href,
            title: title,
            text: text
          };
        } else {
          return {
            type: 'image',
            raw: raw,
            href: href,
            title: title,
            text: _escape(text)
          };
        }
      }

      function indentCodeCompensation(raw, text) {
        var matchIndentToCode = raw.match(/^(\s+)(?:```)/);

        if (matchIndentToCode === null) {
          return text;
        }

        var indentToCode = matchIndentToCode[1];
        return text.split('\n').map(function (node) {
          var matchIndentInNode = node.match(/^\s+/);

          if (matchIndentInNode === null) {
            return node;
          }

          var indentInNode = matchIndentInNode[0];

          if (indentInNode.length >= indentToCode.length) {
            return node.slice(indentToCode.length);
          }

          return node;
        }).join('\n');
      }
      /**
       * Tokenizer
       */


      var Tokenizer_1 = /*#__PURE__*/function () {
        function Tokenizer(options) {
          this.options = options || defaults$4;
        }

        var _proto = Tokenizer.prototype;

        _proto.space = function space(src) {
          var cap = this.rules.block.newline.exec(src);

          if (cap) {
            if (cap[0].length > 1) {
              return {
                type: 'space',
                raw: cap[0]
              };
            }

            return {
              raw: '\n'
            };
          }
        };

        _proto.code = function code(src) {
          var cap = this.rules.block.code.exec(src);

          if (cap) {
            var text = cap[0].replace(/^ {1,4}/gm, '');
            return {
              type: 'code',
              raw: cap[0],
              codeBlockStyle: 'indented',
              text: !this.options.pedantic ? rtrim(text, '\n') : text
            };
          }
        };

        _proto.fences = function fences(src) {
          var cap = this.rules.block.fences.exec(src);

          if (cap) {
            var raw = cap[0];
            var text = indentCodeCompensation(raw, cap[3] || '');
            return {
              type: 'code',
              raw: raw,
              lang: cap[2] ? cap[2].trim() : cap[2],
              text: text
            };
          }
        };

        _proto.heading = function heading(src) {
          var cap = this.rules.block.heading.exec(src);

          if (cap) {
            var text = cap[2].trim(); // remove trailing #s

            if (/#$/.test(text)) {
              var trimmed = rtrim(text, '#');

              if (this.options.pedantic) {
                text = trimmed.trim();
              } else if (!trimmed || / $/.test(trimmed)) {
                // CommonMark requires space before trailing #s
                text = trimmed.trim();
              }
            }

            return {
              type: 'heading',
              raw: cap[0],
              depth: cap[1].length,
              text: text
            };
          }
        };

        _proto.nptable = function nptable(src) {
          var cap = this.rules.block.nptable.exec(src);

          if (cap) {
            var item = {
              type: 'table',
              header: splitCells(cap[1].replace(/^ *| *\| *$/g, '')),
              align: cap[2].replace(/^ *|\| *$/g, '').split(/ *\| */),
              cells: cap[3] ? cap[3].replace(/\n$/, '').split('\n') : [],
              raw: cap[0]
            };

            if (item.header.length === item.align.length) {
              var l = item.align.length;
              var i;

              for (i = 0; i < l; i++) {
                if (/^ *-+: *$/.test(item.align[i])) {
                  item.align[i] = 'right';
                } else if (/^ *:-+: *$/.test(item.align[i])) {
                  item.align[i] = 'center';
                } else if (/^ *:-+ *$/.test(item.align[i])) {
                  item.align[i] = 'left';
                } else {
                  item.align[i] = null;
                }
              }

              l = item.cells.length;

              for (i = 0; i < l; i++) {
                item.cells[i] = splitCells(item.cells[i], item.header.length);
              }

              return item;
            }
          }
        };

        _proto.hr = function hr(src) {
          var cap = this.rules.block.hr.exec(src);

          if (cap) {
            return {
              type: 'hr',
              raw: cap[0]
            };
          }
        };

        _proto.blockquote = function blockquote(src) {
          var cap = this.rules.block.blockquote.exec(src);

          if (cap) {
            var text = cap[0].replace(/^ *> ?/gm, '');
            return {
              type: 'blockquote',
              raw: cap[0],
              text: text
            };
          }
        };

        _proto.list = function list(src) {
          var cap = this.rules.block.list.exec(src);

          if (cap) {
            var raw = cap[0];
            var bull = cap[2];
            var isordered = bull.length > 1;
            var list = {
              type: 'list',
              raw: raw,
              ordered: isordered,
              start: isordered ? +bull.slice(0, -1) : '',
              loose: false,
              items: []
            }; // Get each top-level item.

            var itemMatch = cap[0].match(this.rules.block.item);
            var next = false,
                item,
                space,
                bcurr,
                bnext,
                addBack,
                loose,
                istask,
                ischecked,
                endMatch;
            var l = itemMatch.length;
            bcurr = this.rules.block.listItemStart.exec(itemMatch[0]);

            for (var i = 0; i < l; i++) {
              item = itemMatch[i];
              raw = item;

              if (!this.options.pedantic) {
                // Determine if current item contains the end of the list
                endMatch = item.match(new RegExp('\\n\\s*\\n {0,' + (bcurr[0].length - 1) + '}\\S'));

                if (endMatch) {
                  addBack = item.length - endMatch.index + itemMatch.slice(i + 1).join('\n').length;
                  list.raw = list.raw.substring(0, list.raw.length - addBack);
                  item = item.substring(0, endMatch.index);
                  raw = item;
                  l = i + 1;
                }
              } // Determine whether the next list item belongs here.
              // Backpedal if it does not belong in this list.


              if (i !== l - 1) {
                bnext = this.rules.block.listItemStart.exec(itemMatch[i + 1]);

                if (!this.options.pedantic ? bnext[1].length >= bcurr[0].length || bnext[1].length > 3 : bnext[1].length > bcurr[1].length) {
                  // nested list or continuation
                  itemMatch.splice(i, 2, itemMatch[i] + (!this.options.pedantic && bnext[1].length < bcurr[0].length && !itemMatch[i].match(/\n$/) ? '' : '\n') + itemMatch[i + 1]);
                  i--;
                  l--;
                  continue;
                } else if ( // different bullet style
                !this.options.pedantic || this.options.smartLists ? bnext[2][bnext[2].length - 1] !== bull[bull.length - 1] : isordered === (bnext[2].length === 1)) {
                  addBack = itemMatch.slice(i + 1).join('\n').length;
                  list.raw = list.raw.substring(0, list.raw.length - addBack);
                  i = l - 1;
                }

                bcurr = bnext;
              } // Remove the list item's bullet
              // so it is seen as the next token.


              space = item.length;
              item = item.replace(/^ *([*+-]|\d+[.)]) ?/, ''); // Outdent whatever the
              // list item contains. Hacky.

              if (~item.indexOf('\n ')) {
                space -= item.length;
                item = !this.options.pedantic ? item.replace(new RegExp('^ {1,' + space + '}', 'gm'), '') : item.replace(/^ {1,4}/gm, '');
              } // trim item newlines at end


              item = rtrim(item, '\n');

              if (i !== l - 1) {
                raw = raw + '\n';
              } // Determine whether item is loose or not.
              // Use: /(^|\n)(?! )[^\n]+\n\n(?!\s*$)/
              // for discount behavior.


              loose = next || /\n\n(?!\s*$)/.test(raw);

              if (i !== l - 1) {
                next = raw.slice(-2) === '\n\n';
                if (!loose) loose = next;
              }

              if (loose) {
                list.loose = true;
              } // Check for task list items


              if (this.options.gfm) {
                istask = /^\[[ xX]\] /.test(item);
                ischecked = undefined;

                if (istask) {
                  ischecked = item[1] !== ' ';
                  item = item.replace(/^\[[ xX]\] +/, '');
                }
              }

              list.items.push({
                type: 'list_item',
                raw: raw,
                task: istask,
                checked: ischecked,
                loose: loose,
                text: item
              });
            }

            return list;
          }
        };

        _proto.html = function html(src) {
          var cap = this.rules.block.html.exec(src);

          if (cap) {
            return {
              type: this.options.sanitize ? 'paragraph' : 'html',
              raw: cap[0],
              pre: !this.options.sanitizer && (cap[1] === 'pre' || cap[1] === 'script' || cap[1] === 'style'),
              text: this.options.sanitize ? this.options.sanitizer ? this.options.sanitizer(cap[0]) : _escape(cap[0]) : cap[0]
            };
          }
        };

        _proto.def = function def(src) {
          var cap = this.rules.block.def.exec(src);

          if (cap) {
            if (cap[3]) cap[3] = cap[3].substring(1, cap[3].length - 1);
            var tag = cap[1].toLowerCase().replace(/\s+/g, ' ');
            return {
              type: 'def',
              tag: tag,
              raw: cap[0],
              href: cap[2],
              title: cap[3]
            };
          }
        };

        _proto.table = function table(src) {
          var cap = this.rules.block.table.exec(src);

          if (cap) {
            var item = {
              type: 'table',
              header: splitCells(cap[1].replace(/^ *| *\| *$/g, '')),
              align: cap[2].replace(/^ *|\| *$/g, '').split(/ *\| */),
              cells: cap[3] ? cap[3].replace(/\n$/, '').split('\n') : []
            };

            if (item.header.length === item.align.length) {
              item.raw = cap[0];
              var l = item.align.length;
              var i;

              for (i = 0; i < l; i++) {
                if (/^ *-+: *$/.test(item.align[i])) {
                  item.align[i] = 'right';
                } else if (/^ *:-+: *$/.test(item.align[i])) {
                  item.align[i] = 'center';
                } else if (/^ *:-+ *$/.test(item.align[i])) {
                  item.align[i] = 'left';
                } else {
                  item.align[i] = null;
                }
              }

              l = item.cells.length;

              for (i = 0; i < l; i++) {
                item.cells[i] = splitCells(item.cells[i].replace(/^ *\| *| *\| *$/g, ''), item.header.length);
              }

              return item;
            }
          }
        };

        _proto.lheading = function lheading(src) {
          var cap = this.rules.block.lheading.exec(src);

          if (cap) {
            return {
              type: 'heading',
              raw: cap[0],
              depth: cap[2].charAt(0) === '=' ? 1 : 2,
              text: cap[1]
            };
          }
        };

        _proto.paragraph = function paragraph(src) {
          var cap = this.rules.block.paragraph.exec(src);

          if (cap) {
            return {
              type: 'paragraph',
              raw: cap[0],
              text: cap[1].charAt(cap[1].length - 1) === '\n' ? cap[1].slice(0, -1) : cap[1]
            };
          }
        };

        _proto.text = function text(src) {
          var cap = this.rules.block.text.exec(src);

          if (cap) {
            return {
              type: 'text',
              raw: cap[0],
              text: cap[0]
            };
          }
        };

        _proto.escape = function escape(src) {
          var cap = this.rules.inline.escape.exec(src);

          if (cap) {
            return {
              type: 'escape',
              raw: cap[0],
              text: _escape(cap[1])
            };
          }
        };

        _proto.tag = function tag(src, inLink, inRawBlock) {
          var cap = this.rules.inline.tag.exec(src);

          if (cap) {
            if (!inLink && /^<a /i.test(cap[0])) {
              inLink = true;
            } else if (inLink && /^<\/a>/i.test(cap[0])) {
              inLink = false;
            }

            if (!inRawBlock && /^<(pre|code|kbd|script)(\s|>)/i.test(cap[0])) {
              inRawBlock = true;
            } else if (inRawBlock && /^<\/(pre|code|kbd|script)(\s|>)/i.test(cap[0])) {
              inRawBlock = false;
            }

            return {
              type: this.options.sanitize ? 'text' : 'html',
              raw: cap[0],
              inLink: inLink,
              inRawBlock: inRawBlock,
              text: this.options.sanitize ? this.options.sanitizer ? this.options.sanitizer(cap[0]) : _escape(cap[0]) : cap[0]
            };
          }
        };

        _proto.link = function link(src) {
          var cap = this.rules.inline.link.exec(src);

          if (cap) {
            var trimmedUrl = cap[2].trim();

            if (!this.options.pedantic && /^</.test(trimmedUrl)) {
              // commonmark requires matching angle brackets
              if (!/>$/.test(trimmedUrl)) {
                return;
              } // ending angle bracket cannot be escaped


              var rtrimSlash = rtrim(trimmedUrl.slice(0, -1), '\\');

              if ((trimmedUrl.length - rtrimSlash.length) % 2 === 0) {
                return;
              }
            } else {
              // find closing parenthesis
              var lastParenIndex = findClosingBracket(cap[2], '()');

              if (lastParenIndex > -1) {
                var start = cap[0].indexOf('!') === 0 ? 5 : 4;
                var linkLen = start + cap[1].length + lastParenIndex;
                cap[2] = cap[2].substring(0, lastParenIndex);
                cap[0] = cap[0].substring(0, linkLen).trim();
                cap[3] = '';
              }
            }

            var href = cap[2];
            var title = '';

            if (this.options.pedantic) {
              // split pedantic href and title
              var link = /^([^'"]*[^\s])\s+(['"])(.*)\2/.exec(href);

              if (link) {
                href = link[1];
                title = link[3];
              }
            } else {
              title = cap[3] ? cap[3].slice(1, -1) : '';
            }

            href = href.trim();

            if (/^</.test(href)) {
              if (this.options.pedantic && !/>$/.test(trimmedUrl)) {
                // pedantic allows starting angle bracket without ending angle bracket
                href = href.slice(1);
              } else {
                href = href.slice(1, -1);
              }
            }

            return outputLink(cap, {
              href: href ? href.replace(this.rules.inline._escapes, '$1') : href,
              title: title ? title.replace(this.rules.inline._escapes, '$1') : title
            }, cap[0]);
          }
        };

        _proto.reflink = function reflink(src, links) {
          var cap;

          if ((cap = this.rules.inline.reflink.exec(src)) || (cap = this.rules.inline.nolink.exec(src))) {
            var link = (cap[2] || cap[1]).replace(/\s+/g, ' ');
            link = links[link.toLowerCase()];

            if (!link || !link.href) {
              var text = cap[0].charAt(0);
              return {
                type: 'text',
                raw: text,
                text: text
              };
            }

            return outputLink(cap, link, cap[0]);
          }
        };

        _proto.emStrong = function emStrong(src, maskedSrc, prevChar) {
          if (prevChar === void 0) {
            prevChar = '';
          }

          var match = this.rules.inline.emStrong.lDelim.exec(src);
          if (!match) return;
          if (match[3] && prevChar.match(/(?:[0-9A-Za-z\xAA\xB2\xB3\xB5\xB9\xBA\xBC-\xBE\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0560-\u0588\u05D0-\u05EA\u05EF-\u05F2\u0620-\u064A\u0660-\u0669\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07C0-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u0860-\u086A\u08A0-\u08B4\u08B6-\u08C7\u0904-\u0939\u093D\u0950\u0958-\u0961\u0966-\u096F\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09E6-\u09F1\u09F4-\u09F9\u09FC\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A66-\u0A6F\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0AE6-\u0AEF\u0AF9\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B66-\u0B6F\u0B71-\u0B77\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0BE6-\u0BF2\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58-\u0C5A\u0C60\u0C61\u0C66-\u0C6F\u0C78-\u0C7E\u0C80\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CE6-\u0CEF\u0CF1\u0CF2\u0D04-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D54-\u0D56\u0D58-\u0D61\u0D66-\u0D78\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0DE6-\u0DEF\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E50-\u0E59\u0E81\u0E82\u0E84\u0E86-\u0E8A\u0E8C-\u0EA3\u0EA5\u0EA7-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0ED0-\u0ED9\u0EDC-\u0EDF\u0F00\u0F20-\u0F33\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F-\u1049\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u1090-\u1099\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1369-\u137C\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u17E0-\u17E9\u17F0-\u17F9\u1810-\u1819\u1820-\u1878\u1880-\u1884\u1887-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1946-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u19D0-\u19DA\u1A00-\u1A16\u1A20-\u1A54\u1A80-\u1A89\u1A90-\u1A99\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B50-\u1B59\u1B83-\u1BA0\u1BAE-\u1BE5\u1C00-\u1C23\u1C40-\u1C49\u1C4D-\u1C7D\u1C80-\u1C88\u1C90-\u1CBA\u1CBD-\u1CBF\u1CE9-\u1CEC\u1CEE-\u1CF3\u1CF5\u1CF6\u1CFA\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2070\u2071\u2074-\u2079\u207F-\u2089\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2150-\u2189\u2460-\u249B\u24EA-\u24FF\u2776-\u2793\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2CFD\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312F\u3131-\u318E\u3192-\u3195\u31A0-\u31BF\u31F0-\u31FF\u3220-\u3229\u3248-\u324F\u3251-\u325F\u3280-\u3289\u32B1-\u32BF\u3400-\u4DBF\u4E00-\u9FFC\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6EF\uA717-\uA71F\uA722-\uA788\uA78B-\uA7BF\uA7C2-\uA7CA\uA7F5-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA830-\uA835\uA840-\uA873\uA882-\uA8B3\uA8D0-\uA8D9\uA8F2-\uA8F7\uA8FB\uA8FD\uA8FE\uA900-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF-\uA9D9\uA9E0-\uA9E4\uA9E6-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA50-\uAA59\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB69\uAB70-\uABE2\uABF0-\uABF9\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF10-\uFF19\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDD07-\uDD33\uDD40-\uDD78\uDD8A\uDD8B\uDE80-\uDE9C\uDEA0-\uDED0\uDEE1-\uDEFB\uDF00-\uDF23\uDF2D-\uDF4A\uDF50-\uDF75\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF\uDFD1-\uDFD5]|\uD801[\uDC00-\uDC9D\uDCA0-\uDCA9\uDCB0-\uDCD3\uDCD8-\uDCFB\uDD00-\uDD27\uDD30-\uDD63\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC58-\uDC76\uDC79-\uDC9E\uDCA7-\uDCAF\uDCE0-\uDCF2\uDCF4\uDCF5\uDCFB-\uDD1B\uDD20-\uDD39\uDD80-\uDDB7\uDDBC-\uDDCF\uDDD2-\uDE00\uDE10-\uDE13\uDE15-\uDE17\uDE19-\uDE35\uDE40-\uDE48\uDE60-\uDE7E\uDE80-\uDE9F\uDEC0-\uDEC7\uDEC9-\uDEE4\uDEEB-\uDEEF\uDF00-\uDF35\uDF40-\uDF55\uDF58-\uDF72\uDF78-\uDF91\uDFA9-\uDFAF]|\uD803[\uDC00-\uDC48\uDC80-\uDCB2\uDCC0-\uDCF2\uDCFA-\uDD23\uDD30-\uDD39\uDE60-\uDE7E\uDE80-\uDEA9\uDEB0\uDEB1\uDF00-\uDF27\uDF30-\uDF45\uDF51-\uDF54\uDFB0-\uDFCB\uDFE0-\uDFF6]|\uD804[\uDC03-\uDC37\uDC52-\uDC6F\uDC83-\uDCAF\uDCD0-\uDCE8\uDCF0-\uDCF9\uDD03-\uDD26\uDD36-\uDD3F\uDD44\uDD47\uDD50-\uDD72\uDD76\uDD83-\uDDB2\uDDC1-\uDDC4\uDDD0-\uDDDA\uDDDC\uDDE1-\uDDF4\uDE00-\uDE11\uDE13-\uDE2B\uDE80-\uDE86\uDE88\uDE8A-\uDE8D\uDE8F-\uDE9D\uDE9F-\uDEA8\uDEB0-\uDEDE\uDEF0-\uDEF9\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3D\uDF50\uDF5D-\uDF61]|\uD805[\uDC00-\uDC34\uDC47-\uDC4A\uDC50-\uDC59\uDC5F-\uDC61\uDC80-\uDCAF\uDCC4\uDCC5\uDCC7\uDCD0-\uDCD9\uDD80-\uDDAE\uDDD8-\uDDDB\uDE00-\uDE2F\uDE44\uDE50-\uDE59\uDE80-\uDEAA\uDEB8\uDEC0-\uDEC9\uDF00-\uDF1A\uDF30-\uDF3B]|\uD806[\uDC00-\uDC2B\uDCA0-\uDCF2\uDCFF-\uDD06\uDD09\uDD0C-\uDD13\uDD15\uDD16\uDD18-\uDD2F\uDD3F\uDD41\uDD50-\uDD59\uDDA0-\uDDA7\uDDAA-\uDDD0\uDDE1\uDDE3\uDE00\uDE0B-\uDE32\uDE3A\uDE50\uDE5C-\uDE89\uDE9D\uDEC0-\uDEF8]|\uD807[\uDC00-\uDC08\uDC0A-\uDC2E\uDC40\uDC50-\uDC6C\uDC72-\uDC8F\uDD00-\uDD06\uDD08\uDD09\uDD0B-\uDD30\uDD46\uDD50-\uDD59\uDD60-\uDD65\uDD67\uDD68\uDD6A-\uDD89\uDD98\uDDA0-\uDDA9\uDEE0-\uDEF2\uDFB0\uDFC0-\uDFD4]|\uD808[\uDC00-\uDF99]|\uD809[\uDC00-\uDC6E\uDC80-\uDD43]|[\uD80C\uD81C-\uD820\uD822\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872\uD874-\uD879\uD880-\uD883][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2E]|\uD811[\uDC00-\uDE46]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDE60-\uDE69\uDED0-\uDEED\uDF00-\uDF2F\uDF40-\uDF43\uDF50-\uDF59\uDF5B-\uDF61\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDE40-\uDE96\uDF00-\uDF4A\uDF50\uDF93-\uDF9F\uDFE0\uDFE1\uDFE3]|\uD821[\uDC00-\uDFF7]|\uD823[\uDC00-\uDCD5\uDD00-\uDD08]|\uD82C[\uDC00-\uDD1E\uDD50-\uDD52\uDD64-\uDD67\uDD70-\uDEFB]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99]|\uD834[\uDEE0-\uDEF3\uDF60-\uDF78]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB\uDFCE-\uDFFF]|\uD838[\uDD00-\uDD2C\uDD37-\uDD3D\uDD40-\uDD49\uDD4E\uDEC0-\uDEEB\uDEF0-\uDEF9]|\uD83A[\uDC00-\uDCC4\uDCC7-\uDCCF\uDD00-\uDD43\uDD4B\uDD50-\uDD59]|\uD83B[\uDC71-\uDCAB\uDCAD-\uDCAF\uDCB1-\uDCB4\uDD01-\uDD2D\uDD2F-\uDD3D\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD83C[\uDD00-\uDD0C]|\uD83E[\uDFF0-\uDFF9]|\uD869[\uDC00-\uDEDD\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1\uDEB0-\uDFFF]|\uD87A[\uDC00-\uDFE0]|\uD87E[\uDC00-\uDE1D]|\uD884[\uDC00-\uDF4A])/)) return; // _ can't be between two alphanumerics. \p{L}\p{N} includes non-english alphabet/numbers as well

          var nextChar = match[1] || match[2] || '';

          if (!nextChar || nextChar && (prevChar === '' || this.rules.inline.punctuation.exec(prevChar))) {
            var lLength = match[0].length - 1;
            var rDelim,
                rLength,
                delimTotal = lLength,
                midDelimTotal = 0;
            var endReg = match[0][0] === '*' ? this.rules.inline.emStrong.rDelimAst : this.rules.inline.emStrong.rDelimUnd;
            endReg.lastIndex = 0;
            maskedSrc = maskedSrc.slice(-1 * src.length + lLength); // Bump maskedSrc to same section of string as src (move to lexer?)

            while ((match = endReg.exec(maskedSrc)) != null) {
              rDelim = match[1] || match[2] || match[3] || match[4] || match[5] || match[6];
              if (!rDelim) continue; // matched the first alternative in rules.js (skip the * in __abc*abc__)

              rLength = rDelim.length;

              if (match[3] || match[4]) {
                // found another Left Delim
                delimTotal += rLength;
                continue;
              } else if (match[5] || match[6]) {
                // either Left or Right Delim
                if (lLength % 3 && !((lLength + rLength) % 3)) {
                  midDelimTotal += rLength;
                  continue; // CommonMark Emphasis Rules 9-10
                }
              }

              delimTotal -= rLength;
              if (delimTotal > 0) continue; // Haven't found enough closing delimiters
              // If this is the last rDelimiter, remove extra characters. *a*** -> *a*

              if (delimTotal + midDelimTotal - rLength <= 0 && !maskedSrc.slice(endReg.lastIndex).match(endReg)) {
                rLength = Math.min(rLength, rLength + delimTotal + midDelimTotal);
              }

              if (Math.min(lLength, rLength) % 2) {
                return {
                  type: 'em',
                  raw: src.slice(0, lLength + match.index + rLength + 1),
                  text: src.slice(1, lLength + match.index + rLength)
                };
              }

              if (Math.min(lLength, rLength) % 2 === 0) {
                return {
                  type: 'strong',
                  raw: src.slice(0, lLength + match.index + rLength + 1),
                  text: src.slice(2, lLength + match.index + rLength - 1)
                };
              }
            }
          }
        };

        _proto.codespan = function codespan(src) {
          var cap = this.rules.inline.code.exec(src);

          if (cap) {
            var text = cap[2].replace(/\n/g, ' ');
            var hasNonSpaceChars = /[^ ]/.test(text);
            var hasSpaceCharsOnBothEnds = /^ /.test(text) && / $/.test(text);

            if (hasNonSpaceChars && hasSpaceCharsOnBothEnds) {
              text = text.substring(1, text.length - 1);
            }

            text = _escape(text, true);
            return {
              type: 'codespan',
              raw: cap[0],
              text: text
            };
          }
        };

        _proto.br = function br(src) {
          var cap = this.rules.inline.br.exec(src);

          if (cap) {
            return {
              type: 'br',
              raw: cap[0]
            };
          }
        };

        _proto.del = function del(src) {
          var cap = this.rules.inline.del.exec(src);

          if (cap) {
            return {
              type: 'del',
              raw: cap[0],
              text: cap[2]
            };
          }
        };

        _proto.autolink = function autolink(src, mangle) {
          var cap = this.rules.inline.autolink.exec(src);

          if (cap) {
            var text, href;

            if (cap[2] === '@') {
              text = _escape(this.options.mangle ? mangle(cap[1]) : cap[1]);
              href = 'mailto:' + text;
            } else {
              text = _escape(cap[1]);
              href = text;
            }

            return {
              type: 'link',
              raw: cap[0],
              text: text,
              href: href,
              tokens: [{
                type: 'text',
                raw: text,
                text: text
              }]
            };
          }
        };

        _proto.url = function url(src, mangle) {
          var cap;

          if (cap = this.rules.inline.url.exec(src)) {
            var text, href;

            if (cap[2] === '@') {
              text = _escape(this.options.mangle ? mangle(cap[0]) : cap[0]);
              href = 'mailto:' + text;
            } else {
              // do extended autolink path validation
              var prevCapZero;

              do {
                prevCapZero = cap[0];
                cap[0] = this.rules.inline._backpedal.exec(cap[0])[0];
              } while (prevCapZero !== cap[0]);

              text = _escape(cap[0]);

              if (cap[1] === 'www.') {
                href = 'http://' + text;
              } else {
                href = text;
              }
            }

            return {
              type: 'link',
              raw: cap[0],
              text: text,
              href: href,
              tokens: [{
                type: 'text',
                raw: text,
                text: text
              }]
            };
          }
        };

        _proto.inlineText = function inlineText(src, inRawBlock, smartypants) {
          var cap = this.rules.inline.text.exec(src);

          if (cap) {
            var text;

            if (inRawBlock) {
              text = this.options.sanitize ? this.options.sanitizer ? this.options.sanitizer(cap[0]) : _escape(cap[0]) : cap[0];
            } else {
              text = _escape(this.options.smartypants ? smartypants(cap[0]) : cap[0]);
            }

            return {
              type: 'text',
              raw: cap[0],
              text: text
            };
          }
        };

        return Tokenizer;
      }();

      var noopTest = helpers.noopTest,
          edit = helpers.edit,
          merge$1 = helpers.merge;
      /**
       * Block-Level Grammar
       */

      var block$1 = {
        newline: /^(?: *(?:\n|$))+/,
        code: /^( {4}[^\n]+(?:\n(?: *(?:\n|$))*)?)+/,
        fences: /^ {0,3}(`{3,}(?=[^`\n]*\n)|~{3,})([^\n]*)\n(?:|([\s\S]*?)\n)(?: {0,3}\1[~`]* *(?:\n+|$)|$)/,
        hr: /^ {0,3}((?:- *){3,}|(?:_ *){3,}|(?:\* *){3,})(?:\n+|$)/,
        heading: /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/,
        blockquote: /^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/,
        list: /^( {0,3})(bull) [\s\S]+?(?:hr|def|\n{2,}(?! )(?! {0,3}bull )\n*|\s*$)/,
        html: '^ {0,3}(?:' // optional indentation
        + '<(script|pre|style)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)' // (1)
        + '|comment[^\\n]*(\\n+|$)' // (2)
        + '|<\\?[\\s\\S]*?(?:\\?>\\n*|$)' // (3)
        + '|<![A-Z][\\s\\S]*?(?:>\\n*|$)' // (4)
        + '|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)' // (5)
        + '|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:\\n{2,}|$)' // (6)
        + '|<(?!script|pre|style)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:\\n{2,}|$)' // (7) open tag
        + '|</(?!script|pre|style)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:\\n{2,}|$)' // (7) closing tag
        + ')',
        def: /^ {0,3}\[(label)\]: *\n? *<?([^\s>]+)>?(?:(?: +\n? *| *\n *)(title))? *(?:\n+|$)/,
        nptable: noopTest,
        table: noopTest,
        lheading: /^([^\n]+)\n {0,3}(=+|-+) *(?:\n+|$)/,
        // regex template, placeholders will be replaced according to different paragraph
        // interruption rules of commonmark and the original markdown spec:
        _paragraph: /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html| +\n)[^\n]+)*)/,
        text: /^[^\n]+/
      };
      block$1._label = /(?!\s*\])(?:\\[\[\]]|[^\[\]])+/;
      block$1._title = /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/;
      block$1.def = edit(block$1.def).replace('label', block$1._label).replace('title', block$1._title).getRegex();
      block$1.bullet = /(?:[*+-]|\d{1,9}[.)])/;
      block$1.item = /^( *)(bull) ?[^\n]*(?:\n(?! *bull ?)[^\n]*)*/;
      block$1.item = edit(block$1.item, 'gm').replace(/bull/g, block$1.bullet).getRegex();
      block$1.listItemStart = edit(/^( *)(bull) */).replace('bull', block$1.bullet).getRegex();
      block$1.list = edit(block$1.list).replace(/bull/g, block$1.bullet).replace('hr', '\\n+(?=\\1?(?:(?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$))').replace('def', '\\n+(?=' + block$1.def.source + ')').getRegex();
      block$1._tag = 'address|article|aside|base|basefont|blockquote|body|caption' + '|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption' + '|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe' + '|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option' + '|p|param|section|source|summary|table|tbody|td|tfoot|th|thead|title|tr' + '|track|ul';
      block$1._comment = /<!--(?!-?>)[\s\S]*?(?:-->|$)/;
      block$1.html = edit(block$1.html, 'i').replace('comment', block$1._comment).replace('tag', block$1._tag).replace('attribute', / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex();
      block$1.paragraph = edit(block$1._paragraph).replace('hr', block$1.hr).replace('heading', ' {0,3}#{1,6} ').replace('|lheading', '') // setex headings don't interrupt commonmark paragraphs
      .replace('blockquote', ' {0,3}>').replace('fences', ' {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n').replace('list', ' {0,3}(?:[*+-]|1[.)]) ') // only lists starting from 1 can interrupt
      .replace('html', '</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|!--)').replace('tag', block$1._tag) // pars can be interrupted by type (6) html blocks
      .getRegex();
      block$1.blockquote = edit(block$1.blockquote).replace('paragraph', block$1.paragraph).getRegex();
      /**
       * Normal Block Grammar
       */

      block$1.normal = merge$1({}, block$1);
      /**
       * GFM Block Grammar
       */

      block$1.gfm = merge$1({}, block$1.normal, {
        nptable: '^ *([^|\\n ].*\\|.*)\\n' // Header
        + ' {0,3}([-:]+ *\\|[-| :]*)' // Align
        + '(?:\\n((?:(?!\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)',
        // Cells
        table: '^ *\\|(.+)\\n' // Header
        + ' {0,3}\\|?( *[-:]+[-| :]*)' // Align
        + '(?:\\n *((?:(?!\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)' // Cells

      });
      block$1.gfm.nptable = edit(block$1.gfm.nptable).replace('hr', block$1.hr).replace('heading', ' {0,3}#{1,6} ').replace('blockquote', ' {0,3}>').replace('code', ' {4}[^\\n]').replace('fences', ' {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n').replace('list', ' {0,3}(?:[*+-]|1[.)]) ') // only lists starting from 1 can interrupt
      .replace('html', '</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|!--)').replace('tag', block$1._tag) // tables can be interrupted by type (6) html blocks
      .getRegex();
      block$1.gfm.table = edit(block$1.gfm.table).replace('hr', block$1.hr).replace('heading', ' {0,3}#{1,6} ').replace('blockquote', ' {0,3}>').replace('code', ' {4}[^\\n]').replace('fences', ' {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n').replace('list', ' {0,3}(?:[*+-]|1[.)]) ') // only lists starting from 1 can interrupt
      .replace('html', '</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|!--)').replace('tag', block$1._tag) // tables can be interrupted by type (6) html blocks
      .getRegex();
      /**
       * Pedantic grammar (original John Gruber's loose markdown specification)
       */

      block$1.pedantic = merge$1({}, block$1.normal, {
        html: edit('^ *(?:comment *(?:\\n|\\s*$)' + '|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)' // closed tag
        + '|<tag(?:"[^"]*"|\'[^\']*\'|\\s[^\'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))').replace('comment', block$1._comment).replace(/tag/g, '(?!(?:' + 'a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub' + '|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)' + '\\b)\\w+(?!:|[^\\w\\s@]*@)\\b').getRegex(),
        def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,
        heading: /^(#{1,6})(.*)(?:\n+|$)/,
        fences: noopTest,
        // fences not supported
        paragraph: edit(block$1.normal._paragraph).replace('hr', block$1.hr).replace('heading', ' *#{1,6} *[^\n]').replace('lheading', block$1.lheading).replace('blockquote', ' {0,3}>').replace('|fences', '').replace('|list', '').replace('|html', '').getRegex()
      });
      /**
       * Inline-Level Grammar
       */

      var inline$1 = {
        escape: /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/,
        autolink: /^<(scheme:[^\s\x00-\x1f<>]*|email)>/,
        url: noopTest,
        tag: '^comment' + '|^</[a-zA-Z][\\w:-]*\\s*>' // self-closing tag
        + '|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>' // open tag
        + '|^<\\?[\\s\\S]*?\\?>' // processing instruction, e.g. <?php ?>
        + '|^<![a-zA-Z]+\\s[\\s\\S]*?>' // declaration, e.g. <!DOCTYPE html>
        + '|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>',
        // CDATA section
        link: /^!?\[(label)\]\(\s*(href)(?:\s+(title))?\s*\)/,
        reflink: /^!?\[(label)\]\[(?!\s*\])((?:\\[\[\]]?|[^\[\]\\])+)\]/,
        nolink: /^!?\[(?!\s*\])((?:\[[^\[\]]*\]|\\[\[\]]|[^\[\]])*)\](?:\[\])?/,
        reflinkSearch: 'reflink|nolink(?!\\()',
        emStrong: {
          lDelim: /^(?:\*+(?:([punct_])|[^\s*]))|^_+(?:([punct*])|([^\s_]))/,
          //        (1) and (2) can only be a Right Delimiter. (3) and (4) can only be Left.  (5) and (6) can be either Left or Right.
          //        () Skip other delimiter (1) #***                (2) a***#, a***                   (3) #***a, ***a                 (4) ***#              (5) #***#                 (6) a***a
          rDelimAst: /\_\_[^_]*?\*[^_]*?\_\_|[punct_](\*+)(?=[\s]|$)|[^punct*_\s](\*+)(?=[punct_\s]|$)|[punct_\s](\*+)(?=[^punct*_\s])|[\s](\*+)(?=[punct_])|[punct_](\*+)(?=[punct_])|[^punct*_\s](\*+)(?=[^punct*_\s])/,
          rDelimUnd: /\*\*[^*]*?\_[^*]*?\*\*|[punct*](\_+)(?=[\s]|$)|[^punct*_\s](\_+)(?=[punct*\s]|$)|[punct*\s](\_+)(?=[^punct*_\s])|[\s](\_+)(?=[punct*])|[punct*](\_+)(?=[punct*])/ // ^- Not allowed for _

        },
        code: /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/,
        br: /^( {2,}|\\)\n(?!\s*$)/,
        del: noopTest,
        text: /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/,
        punctuation: /^([\spunctuation])/
      }; // list of punctuation marks from CommonMark spec
      // without * and _ to handle the different emphasis markers * and _

      inline$1._punctuation = '!"#$%&\'()+\\-.,/:;<=>?@\\[\\]`^{|}~';
      inline$1.punctuation = edit(inline$1.punctuation).replace(/punctuation/g, inline$1._punctuation).getRegex(); // sequences em should skip over [title](link), `code`, <html>

      inline$1.blockSkip = /\[[^\]]*?\]\([^\)]*?\)|`[^`]*?`|<[^>]*?>/g;
      inline$1.escapedEmSt = /\\\*|\\_/g;
      inline$1._comment = edit(block$1._comment).replace('(?:-->|$)', '-->').getRegex();
      inline$1.emStrong.lDelim = edit(inline$1.emStrong.lDelim).replace(/punct/g, inline$1._punctuation).getRegex();
      inline$1.emStrong.rDelimAst = edit(inline$1.emStrong.rDelimAst, 'g').replace(/punct/g, inline$1._punctuation).getRegex();
      inline$1.emStrong.rDelimUnd = edit(inline$1.emStrong.rDelimUnd, 'g').replace(/punct/g, inline$1._punctuation).getRegex();
      inline$1._escapes = /\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/g;
      inline$1._scheme = /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/;
      inline$1._email = /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/;
      inline$1.autolink = edit(inline$1.autolink).replace('scheme', inline$1._scheme).replace('email', inline$1._email).getRegex();
      inline$1._attribute = /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/;
      inline$1.tag = edit(inline$1.tag).replace('comment', inline$1._comment).replace('attribute', inline$1._attribute).getRegex();
      inline$1._label = /(?:\[(?:\\.|[^\[\]\\])*\]|\\.|`[^`]*`|[^\[\]\\`])*?/;
      inline$1._href = /<(?:\\.|[^\n<>\\])+>|[^\s\x00-\x1f]*/;
      inline$1._title = /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/;
      inline$1.link = edit(inline$1.link).replace('label', inline$1._label).replace('href', inline$1._href).replace('title', inline$1._title).getRegex();
      inline$1.reflink = edit(inline$1.reflink).replace('label', inline$1._label).getRegex();
      inline$1.reflinkSearch = edit(inline$1.reflinkSearch, 'g').replace('reflink', inline$1.reflink).replace('nolink', inline$1.nolink).getRegex();
      /**
       * Normal Inline Grammar
       */

      inline$1.normal = merge$1({}, inline$1);
      /**
       * Pedantic Inline Grammar
       */

      inline$1.pedantic = merge$1({}, inline$1.normal, {
        strong: {
          start: /^__|\*\*/,
          middle: /^__(?=\S)([\s\S]*?\S)__(?!_)|^\*\*(?=\S)([\s\S]*?\S)\*\*(?!\*)/,
          endAst: /\*\*(?!\*)/g,
          endUnd: /__(?!_)/g
        },
        em: {
          start: /^_|\*/,
          middle: /^()\*(?=\S)([\s\S]*?\S)\*(?!\*)|^_(?=\S)([\s\S]*?\S)_(?!_)/,
          endAst: /\*(?!\*)/g,
          endUnd: /_(?!_)/g
        },
        link: edit(/^!?\[(label)\]\((.*?)\)/).replace('label', inline$1._label).getRegex(),
        reflink: edit(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace('label', inline$1._label).getRegex()
      });
      /**
       * GFM Inline Grammar
       */

      inline$1.gfm = merge$1({}, inline$1.normal, {
        escape: edit(inline$1.escape).replace('])', '~|])').getRegex(),
        _extended_email: /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/,
        url: /^((?:ftp|https?):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/,
        _backpedal: /(?:[^?!.,:;*_~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_~)]+(?!$))+/,
        del: /^(~~?)(?=[^\s~])([\s\S]*?[^\s~])\1(?=[^~]|$)/,
        text: /^([`~]+|[^`~])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|https?:\/\/|ftp:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@))|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@))/
      });
      inline$1.gfm.url = edit(inline$1.gfm.url, 'i').replace('email', inline$1.gfm._extended_email).getRegex();
      /**
       * GFM + Line Breaks Inline Grammar
       */

      inline$1.breaks = merge$1({}, inline$1.gfm, {
        br: edit(inline$1.br).replace('{2,}', '*').getRegex(),
        text: edit(inline$1.gfm.text).replace('\\b_', '\\b_| {2,}\\n').replace(/\{2,\}/g, '*').getRegex()
      });
      var rules = {
        block: block$1,
        inline: inline$1
      };

      var defaults$3 = defaults$5.defaults;
      var block = rules.block,
          inline = rules.inline;
      var repeatString = helpers.repeatString;
      /**
       * smartypants text replacement
       */

      function smartypants(text) {
        return text // em-dashes
        .replace(/---/g, "\u2014") // en-dashes
        .replace(/--/g, "\u2013") // opening singles
        .replace(/(^|[-\u2014/(\[{"\s])'/g, "$1\u2018") // closing singles & apostrophes
        .replace(/'/g, "\u2019") // opening doubles
        .replace(/(^|[-\u2014/(\[{\u2018\s])"/g, "$1\u201C") // closing doubles
        .replace(/"/g, "\u201D") // ellipses
        .replace(/\.{3}/g, "\u2026");
      }
      /**
       * mangle email addresses
       */


      function mangle(text) {
        var out = '',
            i,
            ch;
        var l = text.length;

        for (i = 0; i < l; i++) {
          ch = text.charCodeAt(i);

          if (Math.random() > 0.5) {
            ch = 'x' + ch.toString(16);
          }

          out += '&#' + ch + ';';
        }

        return out;
      }
      /**
       * Block Lexer
       */


      var Lexer_1 = /*#__PURE__*/function () {
        function Lexer(options) {
          this.tokens = [];
          this.tokens.links = Object.create(null);
          this.options = options || defaults$3;
          this.options.tokenizer = this.options.tokenizer || new Tokenizer_1();
          this.tokenizer = this.options.tokenizer;
          this.tokenizer.options = this.options;
          var rules = {
            block: block.normal,
            inline: inline.normal
          };

          if (this.options.pedantic) {
            rules.block = block.pedantic;
            rules.inline = inline.pedantic;
          } else if (this.options.gfm) {
            rules.block = block.gfm;

            if (this.options.breaks) {
              rules.inline = inline.breaks;
            } else {
              rules.inline = inline.gfm;
            }
          }

          this.tokenizer.rules = rules;
        }
        /**
         * Expose Rules
         */


        /**
         * Static Lex Method
         */
        Lexer.lex = function lex(src, options) {
          var lexer = new Lexer(options);
          return lexer.lex(src);
        }
        /**
         * Static Lex Inline Method
         */
        ;

        Lexer.lexInline = function lexInline(src, options) {
          var lexer = new Lexer(options);
          return lexer.inlineTokens(src);
        }
        /**
         * Preprocessing
         */
        ;

        var _proto = Lexer.prototype;

        _proto.lex = function lex(src) {
          src = src.replace(/\r\n|\r/g, '\n').replace(/\t/g, '    ');
          this.blockTokens(src, this.tokens, true);
          this.inline(this.tokens);
          return this.tokens;
        }
        /**
         * Lexing
         */
        ;

        _proto.blockTokens = function blockTokens(src, tokens, top) {
          if (tokens === void 0) {
            tokens = [];
          }

          if (top === void 0) {
            top = true;
          }

          if (this.options.pedantic) {
            src = src.replace(/^ +$/gm, '');
          }

          var token, i, l, lastToken;

          while (src) {
            // newline
            if (token = this.tokenizer.space(src)) {
              src = src.substring(token.raw.length);

              if (token.type) {
                tokens.push(token);
              }

              continue;
            } // code


            if (token = this.tokenizer.code(src)) {
              src = src.substring(token.raw.length);
              lastToken = tokens[tokens.length - 1]; // An indented code block cannot interrupt a paragraph.

              if (lastToken && lastToken.type === 'paragraph') {
                lastToken.raw += '\n' + token.raw;
                lastToken.text += '\n' + token.text;
              } else {
                tokens.push(token);
              }

              continue;
            } // fences


            if (token = this.tokenizer.fences(src)) {
              src = src.substring(token.raw.length);
              tokens.push(token);
              continue;
            } // heading


            if (token = this.tokenizer.heading(src)) {
              src = src.substring(token.raw.length);
              tokens.push(token);
              continue;
            } // table no leading pipe (gfm)


            if (token = this.tokenizer.nptable(src)) {
              src = src.substring(token.raw.length);
              tokens.push(token);
              continue;
            } // hr


            if (token = this.tokenizer.hr(src)) {
              src = src.substring(token.raw.length);
              tokens.push(token);
              continue;
            } // blockquote


            if (token = this.tokenizer.blockquote(src)) {
              src = src.substring(token.raw.length);
              token.tokens = this.blockTokens(token.text, [], top);
              tokens.push(token);
              continue;
            } // list


            if (token = this.tokenizer.list(src)) {
              src = src.substring(token.raw.length);
              l = token.items.length;

              for (i = 0; i < l; i++) {
                token.items[i].tokens = this.blockTokens(token.items[i].text, [], false);
              }

              tokens.push(token);
              continue;
            } // html


            if (token = this.tokenizer.html(src)) {
              src = src.substring(token.raw.length);
              tokens.push(token);
              continue;
            } // def


            if (top && (token = this.tokenizer.def(src))) {
              src = src.substring(token.raw.length);

              if (!this.tokens.links[token.tag]) {
                this.tokens.links[token.tag] = {
                  href: token.href,
                  title: token.title
                };
              }

              continue;
            } // table (gfm)


            if (token = this.tokenizer.table(src)) {
              src = src.substring(token.raw.length);
              tokens.push(token);
              continue;
            } // lheading


            if (token = this.tokenizer.lheading(src)) {
              src = src.substring(token.raw.length);
              tokens.push(token);
              continue;
            } // top-level paragraph


            if (top && (token = this.tokenizer.paragraph(src))) {
              src = src.substring(token.raw.length);
              tokens.push(token);
              continue;
            } // text


            if (token = this.tokenizer.text(src)) {
              src = src.substring(token.raw.length);
              lastToken = tokens[tokens.length - 1];

              if (lastToken && lastToken.type === 'text') {
                lastToken.raw += '\n' + token.raw;
                lastToken.text += '\n' + token.text;
              } else {
                tokens.push(token);
              }

              continue;
            }

            if (src) {
              var errMsg = 'Infinite loop on byte: ' + src.charCodeAt(0);

              if (this.options.silent) {
                console.error(errMsg);
                break;
              } else {
                throw new Error(errMsg);
              }
            }
          }

          return tokens;
        };

        _proto.inline = function inline(tokens) {
          var i, j, k, l2, row, token;
          var l = tokens.length;

          for (i = 0; i < l; i++) {
            token = tokens[i];

            switch (token.type) {
              case 'paragraph':
              case 'text':
              case 'heading':
                {
                  token.tokens = [];
                  this.inlineTokens(token.text, token.tokens);
                  break;
                }

              case 'table':
                {
                  token.tokens = {
                    header: [],
                    cells: []
                  }; // header

                  l2 = token.header.length;

                  for (j = 0; j < l2; j++) {
                    token.tokens.header[j] = [];
                    this.inlineTokens(token.header[j], token.tokens.header[j]);
                  } // cells


                  l2 = token.cells.length;

                  for (j = 0; j < l2; j++) {
                    row = token.cells[j];
                    token.tokens.cells[j] = [];

                    for (k = 0; k < row.length; k++) {
                      token.tokens.cells[j][k] = [];
                      this.inlineTokens(row[k], token.tokens.cells[j][k]);
                    }
                  }

                  break;
                }

              case 'blockquote':
                {
                  this.inline(token.tokens);
                  break;
                }

              case 'list':
                {
                  l2 = token.items.length;

                  for (j = 0; j < l2; j++) {
                    this.inline(token.items[j].tokens);
                  }

                  break;
                }
            }
          }

          return tokens;
        }
        /**
         * Lexing/Compiling
         */
        ;

        _proto.inlineTokens = function inlineTokens(src, tokens, inLink, inRawBlock) {
          if (tokens === void 0) {
            tokens = [];
          }

          if (inLink === void 0) {
            inLink = false;
          }

          if (inRawBlock === void 0) {
            inRawBlock = false;
          }

          var token, lastToken; // String with links masked to avoid interference with em and strong

          var maskedSrc = src;
          var match;
          var keepPrevChar, prevChar; // Mask out reflinks

          if (this.tokens.links) {
            var links = Object.keys(this.tokens.links);

            if (links.length > 0) {
              while ((match = this.tokenizer.rules.inline.reflinkSearch.exec(maskedSrc)) != null) {
                if (links.includes(match[0].slice(match[0].lastIndexOf('[') + 1, -1))) {
                  maskedSrc = maskedSrc.slice(0, match.index) + '[' + repeatString('a', match[0].length - 2) + ']' + maskedSrc.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex);
                }
              }
            }
          } // Mask out other blocks


          while ((match = this.tokenizer.rules.inline.blockSkip.exec(maskedSrc)) != null) {
            maskedSrc = maskedSrc.slice(0, match.index) + '[' + repeatString('a', match[0].length - 2) + ']' + maskedSrc.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);
          } // Mask out escaped em & strong delimiters


          while ((match = this.tokenizer.rules.inline.escapedEmSt.exec(maskedSrc)) != null) {
            maskedSrc = maskedSrc.slice(0, match.index) + '++' + maskedSrc.slice(this.tokenizer.rules.inline.escapedEmSt.lastIndex);
          }

          while (src) {
            if (!keepPrevChar) {
              prevChar = '';
            }

            keepPrevChar = false; // escape

            if (token = this.tokenizer.escape(src)) {
              src = src.substring(token.raw.length);
              tokens.push(token);
              continue;
            } // tag


            if (token = this.tokenizer.tag(src, inLink, inRawBlock)) {
              src = src.substring(token.raw.length);
              inLink = token.inLink;
              inRawBlock = token.inRawBlock;
              var _lastToken = tokens[tokens.length - 1];

              if (_lastToken && token.type === 'text' && _lastToken.type === 'text') {
                _lastToken.raw += token.raw;
                _lastToken.text += token.text;
              } else {
                tokens.push(token);
              }

              continue;
            } // link


            if (token = this.tokenizer.link(src)) {
              src = src.substring(token.raw.length);

              if (token.type === 'link') {
                token.tokens = this.inlineTokens(token.text, [], true, inRawBlock);
              }

              tokens.push(token);
              continue;
            } // reflink, nolink


            if (token = this.tokenizer.reflink(src, this.tokens.links)) {
              src = src.substring(token.raw.length);
              var _lastToken2 = tokens[tokens.length - 1];

              if (token.type === 'link') {
                token.tokens = this.inlineTokens(token.text, [], true, inRawBlock);
                tokens.push(token);
              } else if (_lastToken2 && token.type === 'text' && _lastToken2.type === 'text') {
                _lastToken2.raw += token.raw;
                _lastToken2.text += token.text;
              } else {
                tokens.push(token);
              }

              continue;
            } // em & strong


            if (token = this.tokenizer.emStrong(src, maskedSrc, prevChar)) {
              src = src.substring(token.raw.length);
              token.tokens = this.inlineTokens(token.text, [], inLink, inRawBlock);
              tokens.push(token);
              continue;
            } // code


            if (token = this.tokenizer.codespan(src)) {
              src = src.substring(token.raw.length);
              tokens.push(token);
              continue;
            } // br


            if (token = this.tokenizer.br(src)) {
              src = src.substring(token.raw.length);
              tokens.push(token);
              continue;
            } // del (gfm)


            if (token = this.tokenizer.del(src)) {
              src = src.substring(token.raw.length);
              token.tokens = this.inlineTokens(token.text, [], inLink, inRawBlock);
              tokens.push(token);
              continue;
            } // autolink


            if (token = this.tokenizer.autolink(src, mangle)) {
              src = src.substring(token.raw.length);
              tokens.push(token);
              continue;
            } // url (gfm)


            if (!inLink && (token = this.tokenizer.url(src, mangle))) {
              src = src.substring(token.raw.length);
              tokens.push(token);
              continue;
            } // text


            if (token = this.tokenizer.inlineText(src, inRawBlock, smartypants)) {
              src = src.substring(token.raw.length);

              if (token.raw.slice(-1) !== '_') {
                // Track prevChar before string of ____ started
                prevChar = token.raw.slice(-1);
              }

              keepPrevChar = true;
              lastToken = tokens[tokens.length - 1];

              if (lastToken && lastToken.type === 'text') {
                lastToken.raw += token.raw;
                lastToken.text += token.text;
              } else {
                tokens.push(token);
              }

              continue;
            }

            if (src) {
              var errMsg = 'Infinite loop on byte: ' + src.charCodeAt(0);

              if (this.options.silent) {
                console.error(errMsg);
                break;
              } else {
                throw new Error(errMsg);
              }
            }
          }

          return tokens;
        };

        _createClass(Lexer, null, [{
          key: "rules",
          get: function get() {
            return {
              block: block,
              inline: inline
            };
          }
        }]);

        return Lexer;
      }();

      var defaults$2 = defaults$5.defaults;
      var cleanUrl = helpers.cleanUrl,
          escape$1 = helpers.escape;
      /**
       * Renderer
       */

      var Renderer_1 = /*#__PURE__*/function () {
        function Renderer(options) {
          this.options = options || defaults$2;
        }

        var _proto = Renderer.prototype;

        _proto.code = function code(_code, infostring, escaped) {
          var lang = (infostring || '').match(/\S*/)[0];

          if (this.options.highlight) {
            var out = this.options.highlight(_code, lang);

            if (out != null && out !== _code) {
              escaped = true;
              _code = out;
            }
          }

          _code = _code.replace(/\n$/, '') + '\n';

          if (!lang) {
            return '<pre><code>' + (escaped ? _code : escape$1(_code, true)) + '</code></pre>\n';
          }

          return '<pre><code class="' + this.options.langPrefix + escape$1(lang, true) + '">' + (escaped ? _code : escape$1(_code, true)) + '</code></pre>\n';
        };

        _proto.blockquote = function blockquote(quote) {
          return '<blockquote>\n' + quote + '</blockquote>\n';
        };

        _proto.html = function html(_html) {
          return _html;
        };

        _proto.heading = function heading(text, level, raw, slugger) {
          if (this.options.headerIds) {
            return '<h' + level + ' id="' + this.options.headerPrefix + slugger.slug(raw) + '">' + text + '</h' + level + '>\n';
          } // ignore IDs


          return '<h' + level + '>' + text + '</h' + level + '>\n';
        };

        _proto.hr = function hr() {
          return this.options.xhtml ? '<hr/>\n' : '<hr>\n';
        };

        _proto.list = function list(body, ordered, start) {
          var type = ordered ? 'ol' : 'ul',
              startatt = ordered && start !== 1 ? ' start="' + start + '"' : '';
          return '<' + type + startatt + '>\n' + body + '</' + type + '>\n';
        };

        _proto.listitem = function listitem(text) {
          return '<li>' + text + '</li>\n';
        };

        _proto.checkbox = function checkbox(checked) {
          return '<input ' + (checked ? 'checked="" ' : '') + 'disabled="" type="checkbox"' + (this.options.xhtml ? ' /' : '') + '> ';
        };

        _proto.paragraph = function paragraph(text) {
          return '<p>' + text + '</p>\n';
        };

        _proto.table = function table(header, body) {
          if (body) body = '<tbody>' + body + '</tbody>';
          return '<table>\n' + '<thead>\n' + header + '</thead>\n' + body + '</table>\n';
        };

        _proto.tablerow = function tablerow(content) {
          return '<tr>\n' + content + '</tr>\n';
        };

        _proto.tablecell = function tablecell(content, flags) {
          var type = flags.header ? 'th' : 'td';
          var tag = flags.align ? '<' + type + ' align="' + flags.align + '">' : '<' + type + '>';
          return tag + content + '</' + type + '>\n';
        } // span level renderer
        ;

        _proto.strong = function strong(text) {
          return '<strong>' + text + '</strong>';
        };

        _proto.em = function em(text) {
          return '<em>' + text + '</em>';
        };

        _proto.codespan = function codespan(text) {
          return '<code>' + text + '</code>';
        };

        _proto.br = function br() {
          return this.options.xhtml ? '<br/>' : '<br>';
        };

        _proto.del = function del(text) {
          return '<del>' + text + '</del>';
        };

        _proto.link = function link(href, title, text) {
          href = cleanUrl(this.options.sanitize, this.options.baseUrl, href);

          if (href === null) {
            return text;
          }

          var out = '<a href="' + escape$1(href) + '"';

          if (title) {
            out += ' title="' + title + '"';
          }

          out += '>' + text + '</a>';
          return out;
        };

        _proto.image = function image(href, title, text) {
          href = cleanUrl(this.options.sanitize, this.options.baseUrl, href);

          if (href === null) {
            return text;
          }

          var out = '<img src="' + href + '" alt="' + text + '"';

          if (title) {
            out += ' title="' + title + '"';
          }

          out += this.options.xhtml ? '/>' : '>';
          return out;
        };

        _proto.text = function text(_text) {
          return _text;
        };

        return Renderer;
      }();

      /**
       * TextRenderer
       * returns only the textual part of the token
       */
      var TextRenderer_1 = /*#__PURE__*/function () {
        function TextRenderer() {}

        var _proto = TextRenderer.prototype;

        // no need for block level renderers
        _proto.strong = function strong(text) {
          return text;
        };

        _proto.em = function em(text) {
          return text;
        };

        _proto.codespan = function codespan(text) {
          return text;
        };

        _proto.del = function del(text) {
          return text;
        };

        _proto.html = function html(text) {
          return text;
        };

        _proto.text = function text(_text) {
          return _text;
        };

        _proto.link = function link(href, title, text) {
          return '' + text;
        };

        _proto.image = function image(href, title, text) {
          return '' + text;
        };

        _proto.br = function br() {
          return '';
        };

        return TextRenderer;
      }();

      /**
       * Slugger generates header id
       */
      var Slugger_1 = /*#__PURE__*/function () {
        function Slugger() {
          this.seen = {};
        }

        var _proto = Slugger.prototype;

        _proto.serialize = function serialize(value) {
          return value.toLowerCase().trim() // remove html tags
          .replace(/<[!\/a-z].*?>/ig, '') // remove unwanted chars
          .replace(/[\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,./:;<=>?@[\]^`{|}~]/g, '').replace(/\s/g, '-');
        }
        /**
         * Finds the next safe (unique) slug to use
         */
        ;

        _proto.getNextSafeSlug = function getNextSafeSlug(originalSlug, isDryRun) {
          var slug = originalSlug;
          var occurenceAccumulator = 0;

          if (this.seen.hasOwnProperty(slug)) {
            occurenceAccumulator = this.seen[originalSlug];

            do {
              occurenceAccumulator++;
              slug = originalSlug + '-' + occurenceAccumulator;
            } while (this.seen.hasOwnProperty(slug));
          }

          if (!isDryRun) {
            this.seen[originalSlug] = occurenceAccumulator;
            this.seen[slug] = 0;
          }

          return slug;
        }
        /**
         * Convert string to unique id
         * @param {object} options
         * @param {boolean} options.dryrun Generates the next unique slug without updating the internal accumulator.
         */
        ;

        _proto.slug = function slug(value, options) {
          if (options === void 0) {
            options = {};
          }

          var slug = this.serialize(value);
          return this.getNextSafeSlug(slug, options.dryrun);
        };

        return Slugger;
      }();

      var defaults$1 = defaults$5.defaults;
      var unescape = helpers.unescape;
      /**
       * Parsing & Compiling
       */

      var Parser_1 = /*#__PURE__*/function () {
        function Parser(options) {
          this.options = options || defaults$1;
          this.options.renderer = this.options.renderer || new Renderer_1();
          this.renderer = this.options.renderer;
          this.renderer.options = this.options;
          this.textRenderer = new TextRenderer_1();
          this.slugger = new Slugger_1();
        }
        /**
         * Static Parse Method
         */


        Parser.parse = function parse(tokens, options) {
          var parser = new Parser(options);
          return parser.parse(tokens);
        }
        /**
         * Static Parse Inline Method
         */
        ;

        Parser.parseInline = function parseInline(tokens, options) {
          var parser = new Parser(options);
          return parser.parseInline(tokens);
        }
        /**
         * Parse Loop
         */
        ;

        var _proto = Parser.prototype;

        _proto.parse = function parse(tokens, top) {
          if (top === void 0) {
            top = true;
          }

          var out = '',
              i,
              j,
              k,
              l2,
              l3,
              row,
              cell,
              header,
              body,
              token,
              ordered,
              start,
              loose,
              itemBody,
              item,
              checked,
              task,
              checkbox;
          var l = tokens.length;

          for (i = 0; i < l; i++) {
            token = tokens[i];

            switch (token.type) {
              case 'space':
                {
                  continue;
                }

              case 'hr':
                {
                  out += this.renderer.hr();
                  continue;
                }

              case 'heading':
                {
                  out += this.renderer.heading(this.parseInline(token.tokens), token.depth, unescape(this.parseInline(token.tokens, this.textRenderer)), this.slugger);
                  continue;
                }

              case 'code':
                {
                  out += this.renderer.code(token.text, token.lang, token.escaped);
                  continue;
                }

              case 'table':
                {
                  header = ''; // header

                  cell = '';
                  l2 = token.header.length;

                  for (j = 0; j < l2; j++) {
                    cell += this.renderer.tablecell(this.parseInline(token.tokens.header[j]), {
                      header: true,
                      align: token.align[j]
                    });
                  }

                  header += this.renderer.tablerow(cell);
                  body = '';
                  l2 = token.cells.length;

                  for (j = 0; j < l2; j++) {
                    row = token.tokens.cells[j];
                    cell = '';
                    l3 = row.length;

                    for (k = 0; k < l3; k++) {
                      cell += this.renderer.tablecell(this.parseInline(row[k]), {
                        header: false,
                        align: token.align[k]
                      });
                    }

                    body += this.renderer.tablerow(cell);
                  }

                  out += this.renderer.table(header, body);
                  continue;
                }

              case 'blockquote':
                {
                  body = this.parse(token.tokens);
                  out += this.renderer.blockquote(body);
                  continue;
                }

              case 'list':
                {
                  ordered = token.ordered;
                  start = token.start;
                  loose = token.loose;
                  l2 = token.items.length;
                  body = '';

                  for (j = 0; j < l2; j++) {
                    item = token.items[j];
                    checked = item.checked;
                    task = item.task;
                    itemBody = '';

                    if (item.task) {
                      checkbox = this.renderer.checkbox(checked);

                      if (loose) {
                        if (item.tokens.length > 0 && item.tokens[0].type === 'text') {
                          item.tokens[0].text = checkbox + ' ' + item.tokens[0].text;

                          if (item.tokens[0].tokens && item.tokens[0].tokens.length > 0 && item.tokens[0].tokens[0].type === 'text') {
                            item.tokens[0].tokens[0].text = checkbox + ' ' + item.tokens[0].tokens[0].text;
                          }
                        } else {
                          item.tokens.unshift({
                            type: 'text',
                            text: checkbox
                          });
                        }
                      } else {
                        itemBody += checkbox;
                      }
                    }

                    itemBody += this.parse(item.tokens, loose);
                    body += this.renderer.listitem(itemBody, task, checked);
                  }

                  out += this.renderer.list(body, ordered, start);
                  continue;
                }

              case 'html':
                {
                  // TODO parse inline content if parameter markdown=1
                  out += this.renderer.html(token.text);
                  continue;
                }

              case 'paragraph':
                {
                  out += this.renderer.paragraph(this.parseInline(token.tokens));
                  continue;
                }

              case 'text':
                {
                  body = token.tokens ? this.parseInline(token.tokens) : token.text;

                  while (i + 1 < l && tokens[i + 1].type === 'text') {
                    token = tokens[++i];
                    body += '\n' + (token.tokens ? this.parseInline(token.tokens) : token.text);
                  }

                  out += top ? this.renderer.paragraph(body) : body;
                  continue;
                }

              default:
                {
                  var errMsg = 'Token with "' + token.type + '" type was not found.';

                  if (this.options.silent) {
                    console.error(errMsg);
                    return;
                  } else {
                    throw new Error(errMsg);
                  }
                }
            }
          }

          return out;
        }
        /**
         * Parse Inline Tokens
         */
        ;

        _proto.parseInline = function parseInline(tokens, renderer) {
          renderer = renderer || this.renderer;
          var out = '',
              i,
              token;
          var l = tokens.length;

          for (i = 0; i < l; i++) {
            token = tokens[i];

            switch (token.type) {
              case 'escape':
                {
                  out += renderer.text(token.text);
                  break;
                }

              case 'html':
                {
                  out += renderer.html(token.text);
                  break;
                }

              case 'link':
                {
                  out += renderer.link(token.href, token.title, this.parseInline(token.tokens, renderer));
                  break;
                }

              case 'image':
                {
                  out += renderer.image(token.href, token.title, token.text);
                  break;
                }

              case 'strong':
                {
                  out += renderer.strong(this.parseInline(token.tokens, renderer));
                  break;
                }

              case 'em':
                {
                  out += renderer.em(this.parseInline(token.tokens, renderer));
                  break;
                }

              case 'codespan':
                {
                  out += renderer.codespan(token.text);
                  break;
                }

              case 'br':
                {
                  out += renderer.br();
                  break;
                }

              case 'del':
                {
                  out += renderer.del(this.parseInline(token.tokens, renderer));
                  break;
                }

              case 'text':
                {
                  out += renderer.text(token.text);
                  break;
                }

              default:
                {
                  var errMsg = 'Token with "' + token.type + '" type was not found.';

                  if (this.options.silent) {
                    console.error(errMsg);
                    return;
                  } else {
                    throw new Error(errMsg);
                  }
                }
            }
          }

          return out;
        };

        return Parser;
      }();

      var merge = helpers.merge,
          checkSanitizeDeprecation = helpers.checkSanitizeDeprecation,
          escape = helpers.escape;
      var getDefaults = defaults$5.getDefaults,
          changeDefaults = defaults$5.changeDefaults,
          defaults = defaults$5.defaults;
      /**
       * Marked
       */

      function marked(src, opt, callback) {
        // throw error in case of non string input
        if (typeof src === 'undefined' || src === null) {
          throw new Error('marked(): input parameter is undefined or null');
        }

        if (typeof src !== 'string') {
          throw new Error('marked(): input parameter is of type ' + Object.prototype.toString.call(src) + ', string expected');
        }

        if (typeof opt === 'function') {
          callback = opt;
          opt = null;
        }

        opt = merge({}, marked.defaults, opt || {});
        checkSanitizeDeprecation(opt);

        if (callback) {
          var highlight = opt.highlight;
          var tokens;

          try {
            tokens = Lexer_1.lex(src, opt);
          } catch (e) {
            return callback(e);
          }

          var done = function done(err) {
            var out;

            if (!err) {
              try {
                out = Parser_1.parse(tokens, opt);
              } catch (e) {
                err = e;
              }
            }

            opt.highlight = highlight;
            return err ? callback(err) : callback(null, out);
          };

          if (!highlight || highlight.length < 3) {
            return done();
          }

          delete opt.highlight;
          if (!tokens.length) return done();
          var pending = 0;
          marked.walkTokens(tokens, function (token) {
            if (token.type === 'code') {
              pending++;
              setTimeout(function () {
                highlight(token.text, token.lang, function (err, code) {
                  if (err) {
                    return done(err);
                  }

                  if (code != null && code !== token.text) {
                    token.text = code;
                    token.escaped = true;
                  }

                  pending--;

                  if (pending === 0) {
                    done();
                  }
                });
              }, 0);
            }
          });

          if (pending === 0) {
            done();
          }

          return;
        }

        try {
          var _tokens = Lexer_1.lex(src, opt);

          if (opt.walkTokens) {
            marked.walkTokens(_tokens, opt.walkTokens);
          }

          return Parser_1.parse(_tokens, opt);
        } catch (e) {
          e.message += '\nPlease report this to https://github.com/markedjs/marked.';

          if (opt.silent) {
            return '<p>An error occurred:</p><pre>' + escape(e.message + '', true) + '</pre>';
          }

          throw e;
        }
      }
      /**
       * Options
       */


      marked.options = marked.setOptions = function (opt) {
        merge(marked.defaults, opt);
        changeDefaults(marked.defaults);
        return marked;
      };

      marked.getDefaults = getDefaults;
      marked.defaults = defaults;
      /**
       * Use Extension
       */

      marked.use = function (extension) {
        var opts = merge({}, extension);

        if (extension.renderer) {
          (function () {
            var renderer = marked.defaults.renderer || new Renderer_1();

            var _loop = function _loop(prop) {
              var prevRenderer = renderer[prop];

              renderer[prop] = function () {
                for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
                  args[_key] = arguments[_key];
                }

                var ret = extension.renderer[prop].apply(renderer, args);

                if (ret === false) {
                  ret = prevRenderer.apply(renderer, args);
                }

                return ret;
              };
            };

            for (var prop in extension.renderer) {
              _loop(prop);
            }

            opts.renderer = renderer;
          })();
        }

        if (extension.tokenizer) {
          (function () {
            var tokenizer = marked.defaults.tokenizer || new Tokenizer_1();

            var _loop2 = function _loop2(prop) {
              var prevTokenizer = tokenizer[prop];

              tokenizer[prop] = function () {
                for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                  args[_key2] = arguments[_key2];
                }

                var ret = extension.tokenizer[prop].apply(tokenizer, args);

                if (ret === false) {
                  ret = prevTokenizer.apply(tokenizer, args);
                }

                return ret;
              };
            };

            for (var prop in extension.tokenizer) {
              _loop2(prop);
            }

            opts.tokenizer = tokenizer;
          })();
        }

        if (extension.walkTokens) {
          var walkTokens = marked.defaults.walkTokens;

          opts.walkTokens = function (token) {
            extension.walkTokens(token);

            if (walkTokens) {
              walkTokens(token);
            }
          };
        }

        marked.setOptions(opts);
      };
      /**
       * Run callback for every token
       */


      marked.walkTokens = function (tokens, callback) {
        for (var _iterator = _createForOfIteratorHelperLoose(tokens), _step; !(_step = _iterator()).done;) {
          var token = _step.value;
          callback(token);

          switch (token.type) {
            case 'table':
              {
                for (var _iterator2 = _createForOfIteratorHelperLoose(token.tokens.header), _step2; !(_step2 = _iterator2()).done;) {
                  var cell = _step2.value;
                  marked.walkTokens(cell, callback);
                }

                for (var _iterator3 = _createForOfIteratorHelperLoose(token.tokens.cells), _step3; !(_step3 = _iterator3()).done;) {
                  var row = _step3.value;

                  for (var _iterator4 = _createForOfIteratorHelperLoose(row), _step4; !(_step4 = _iterator4()).done;) {
                    var _cell = _step4.value;
                    marked.walkTokens(_cell, callback);
                  }
                }

                break;
              }

            case 'list':
              {
                marked.walkTokens(token.items, callback);
                break;
              }

            default:
              {
                if (token.tokens) {
                  marked.walkTokens(token.tokens, callback);
                }
              }
          }
        }
      };
      /**
       * Parse Inline
       */


      marked.parseInline = function (src, opt) {
        // throw error in case of non string input
        if (typeof src === 'undefined' || src === null) {
          throw new Error('marked.parseInline(): input parameter is undefined or null');
        }

        if (typeof src !== 'string') {
          throw new Error('marked.parseInline(): input parameter is of type ' + Object.prototype.toString.call(src) + ', string expected');
        }

        opt = merge({}, marked.defaults, opt || {});
        checkSanitizeDeprecation(opt);

        try {
          var tokens = Lexer_1.lexInline(src, opt);

          if (opt.walkTokens) {
            marked.walkTokens(tokens, opt.walkTokens);
          }

          return Parser_1.parseInline(tokens, opt);
        } catch (e) {
          e.message += '\nPlease report this to https://github.com/markedjs/marked.';

          if (opt.silent) {
            return '<p>An error occurred:</p><pre>' + escape(e.message + '', true) + '</pre>';
          }

          throw e;
        }
      };
      /**
       * Expose
       */


      marked.Parser = Parser_1;
      marked.parser = Parser_1.parse;
      marked.Renderer = Renderer_1;
      marked.TextRenderer = TextRenderer_1;
      marked.Lexer = Lexer_1;
      marked.lexer = Lexer_1.lex;
      marked.Tokenizer = Tokenizer_1;
      marked.Slugger = Slugger_1;
      marked.parse = marked;
      var marked_1 = marked;

      return marked_1;

    })));
    });

    /* ../../../packages/interkit/components/MarkdownContent.svelte generated by Svelte v3.35.0 */

    function create_fragment$8(ctx) {
    	let div;
    	let raw_value = marked(/*content*/ ctx[0]) + "";

    	return {
    		c() {
    			div = element("div");
    			attr(div, "class", "MarkdownContent");
    		},
    		m(target, anchor) {
    			insert(target, div, anchor);
    			div.innerHTML = raw_value;
    		},
    		p(ctx, [dirty]) {
    			if (dirty & /*content*/ 1 && raw_value !== (raw_value = marked(/*content*/ ctx[0]) + "")) div.innerHTML = raw_value;		},
    		i: noop,
    		o: noop,
    		d(detaching) {
    			if (detaching) detach(div);
    		}
    	};
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let { content } = $$props;

    	$$self.$$set = $$props => {
    		if ("content" in $$props) $$invalidate(0, content = $$props.content);
    	};

    	return [content];
    }

    class MarkdownContent extends SvelteComponent {
    	constructor(options) {
    		super();
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, { content: 0 });
    	}
    }

    /* ../../../packages/interkit/components/ContentElement.svelte generated by Svelte v3.35.0 */
    const get_buttons_slot_changes = dirty => ({});
    const get_buttons_slot_context = ctx => ({});

    // (97:0) {#if element}
    function create_if_block$2(ctx) {
    	let section;
    	let figure;
    	let aspectratio;
    	let t0;
    	let div0;
    	let h4;
    	let t1;
    	let previous_key = /*title*/ ctx[3];
    	let t2;
    	let div3;
    	let div1;
    	let t3;
    	let div2;
    	let t4;
    	let buttonbar;
    	let section_class_value;
    	let current;

    	aspectratio = new AspectRatio({
    			props: {
    				$$slots: { default: [create_default_slot_2] },
    				$$scope: { ctx }
    			}
    		});

    	let if_block0 = /*supertext*/ ctx[4] && create_if_block_4(ctx);
    	let key_block = create_key_block(ctx);
    	let if_block1 = /*short_description*/ ctx[6] && create_if_block_3(ctx);
    	let if_block2 = /*description*/ ctx[5] && create_if_block_2$1(ctx);

    	buttonbar = new ButtonBar({
    			props: {
    				$$slots: { default: [create_default_slot$2] },
    				$$scope: { ctx }
    			}
    		});

    	return {
    		c() {
    			section = element("section");
    			figure = element("figure");
    			create_component(aspectratio.$$.fragment);
    			t0 = space();
    			div0 = element("div");
    			h4 = element("h4");
    			if (if_block0) if_block0.c();
    			t1 = space();
    			key_block.c();
    			t2 = space();
    			div3 = element("div");
    			div1 = element("div");
    			if (if_block1) if_block1.c();
    			t3 = space();
    			div2 = element("div");
    			if (if_block2) if_block2.c();
    			t4 = space();
    			create_component(buttonbar.$$.fragment);
    			attr(figure, "class", "ContentElementAudio__Picture picture svelte-w3qeuq");
    			attr(h4, "class", "ContentElementAudio__SubTitle subtitle svelte-w3qeuq");
    			attr(div0, "class", "ContentElementAudio_Titles titles svelte-w3qeuq");
    			attr(div1, "class", "short-description svelte-w3qeuq");
    			attr(div2, "class", "description svelte-w3qeuq");
    			attr(div3, "class", "ContentElementAudio__Content content svelte-w3qeuq");
    			attr(section, "class", section_class_value = "" + (null_to_empty(`ContentElementAudio container size-${/*size*/ ctx[1]}`) + " svelte-w3qeuq"));
    		},
    		m(target, anchor) {
    			insert(target, section, anchor);
    			append(section, figure);
    			mount_component(aspectratio, figure, null);
    			append(section, t0);
    			append(section, div0);
    			append(div0, h4);
    			if (if_block0) if_block0.m(h4, null);
    			append(div0, t1);
    			key_block.m(div0, null);
    			append(section, t2);
    			append(section, div3);
    			append(div3, div1);
    			if (if_block1) if_block1.m(div1, null);
    			append(div3, t3);
    			append(div3, div2);
    			if (if_block2) if_block2.m(div2, null);
    			append(section, t4);
    			mount_component(buttonbar, section, null);
    			current = true;
    		},
    		p(ctx, dirty) {
    			const aspectratio_changes = {};

    			if (dirty & /*$$scope, imageRef*/ 65664) {
    				aspectratio_changes.$$scope = { dirty, ctx };
    			}

    			aspectratio.$set(aspectratio_changes);

    			if (/*supertext*/ ctx[4]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_4(ctx);
    					if_block0.c();
    					if_block0.m(h4, null);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (dirty & /*title*/ 8 && safe_not_equal(previous_key, previous_key = /*title*/ ctx[3])) {
    				key_block.d(1);
    				key_block = create_key_block(ctx);
    				key_block.c();
    				key_block.m(div0, null);
    			} else {
    				key_block.p(ctx, dirty);
    			}

    			if (/*short_description*/ ctx[6]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty & /*short_description*/ 64) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block_3(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(div1, null);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}

    			if (/*description*/ ctx[5]) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);

    					if (dirty & /*description*/ 32) {
    						transition_in(if_block2, 1);
    					}
    				} else {
    					if_block2 = create_if_block_2$1(ctx);
    					if_block2.c();
    					transition_in(if_block2, 1);
    					if_block2.m(div2, null);
    				}
    			} else if (if_block2) {
    				group_outros();

    				transition_out(if_block2, 1, 1, () => {
    					if_block2 = null;
    				});

    				check_outros();
    			}

    			const buttonbar_changes = {};

    			if (dirty & /*$$scope, distance*/ 65540) {
    				buttonbar_changes.$$scope = { dirty, ctx };
    			}

    			buttonbar.$set(buttonbar_changes);

    			if (!current || dirty & /*size*/ 2 && section_class_value !== (section_class_value = "" + (null_to_empty(`ContentElementAudio container size-${/*size*/ ctx[1]}`) + " svelte-w3qeuq"))) {
    				attr(section, "class", section_class_value);
    			}
    		},
    		i(local) {
    			if (current) return;
    			transition_in(aspectratio.$$.fragment, local);
    			transition_in(if_block1);
    			transition_in(if_block2);
    			transition_in(buttonbar.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(aspectratio.$$.fragment, local);
    			transition_out(if_block1);
    			transition_out(if_block2);
    			transition_out(buttonbar.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			if (detaching) detach(section);
    			destroy_component(aspectratio);
    			if (if_block0) if_block0.d();
    			key_block.d(detaching);
    			if (if_block1) if_block1.d();
    			if (if_block2) if_block2.d();
    			destroy_component(buttonbar);
    		}
    	};
    }

    // (102:6) <AspectRatio>
    function create_default_slot_2(ctx) {
    	let mediafileimage;
    	let current;

    	mediafileimage = new MediaFileImage({
    			props: {
    				objectFit: "cover",
    				fitDimension: "both",
    				mediafileRef: /*imageRef*/ ctx[7]
    			}
    		});

    	return {
    		c() {
    			create_component(mediafileimage.$$.fragment);
    		},
    		m(target, anchor) {
    			mount_component(mediafileimage, target, anchor);
    			current = true;
    		},
    		p(ctx, dirty) {
    			const mediafileimage_changes = {};
    			if (dirty & /*imageRef*/ 128) mediafileimage_changes.mediafileRef = /*imageRef*/ ctx[7];
    			mediafileimage.$set(mediafileimage_changes);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(mediafileimage.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(mediafileimage.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			destroy_component(mediafileimage, detaching);
    		}
    	};
    }

    // (110:8) {#if supertext}
    function create_if_block_4(ctx) {
    	let span;
    	let t;

    	return {
    		c() {
    			span = element("span");
    			t = text(/*supertext*/ ctx[4]);
    			attr(span, "class", "svelte-w3qeuq");
    		},
    		m(target, anchor) {
    			insert(target, span, anchor);
    			append(span, t);
    		},
    		p(ctx, dirty) {
    			if (dirty & /*supertext*/ 16) set_data(t, /*supertext*/ ctx[4]);
    		},
    		d(detaching) {
    			if (detaching) detach(span);
    		}
    	};
    }

    // (115:6) {#key title}
    function create_key_block(ctx) {
    	let h3;
    	let t;

    	return {
    		c() {
    			h3 = element("h3");
    			t = text(/*title*/ ctx[3]);
    			attr(h3, "class", "ContentElementAudio__Title title svelte-w3qeuq");
    		},
    		m(target, anchor) {
    			insert(target, h3, anchor);
    			append(h3, t);
    		},
    		p(ctx, dirty) {
    			if (dirty & /*title*/ 8) set_data(t, /*title*/ ctx[3]);
    		},
    		d(detaching) {
    			if (detaching) detach(h3);
    		}
    	};
    }

    // (126:10) {#if short_description}
    function create_if_block_3(ctx) {
    	let markdowncontent;
    	let current;

    	markdowncontent = new MarkdownContent({
    			props: { content: /*short_description*/ ctx[6] }
    		});

    	return {
    		c() {
    			create_component(markdowncontent.$$.fragment);
    		},
    		m(target, anchor) {
    			mount_component(markdowncontent, target, anchor);
    			current = true;
    		},
    		p(ctx, dirty) {
    			const markdowncontent_changes = {};
    			if (dirty & /*short_description*/ 64) markdowncontent_changes.content = /*short_description*/ ctx[6];
    			markdowncontent.$set(markdowncontent_changes);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(markdowncontent.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(markdowncontent.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			destroy_component(markdowncontent, detaching);
    		}
    	};
    }

    // (132:10) {#if description}
    function create_if_block_2$1(ctx) {
    	let markdowncontent;
    	let current;

    	markdowncontent = new MarkdownContent({
    			props: { content: /*description*/ ctx[5] }
    		});

    	return {
    		c() {
    			create_component(markdowncontent.$$.fragment);
    		},
    		m(target, anchor) {
    			mount_component(markdowncontent, target, anchor);
    			current = true;
    		},
    		p(ctx, dirty) {
    			const markdowncontent_changes = {};
    			if (dirty & /*description*/ 32) markdowncontent_changes.content = /*description*/ ctx[5];
    			markdowncontent.$set(markdowncontent_changes);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(markdowncontent.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(markdowncontent.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			destroy_component(markdowncontent, detaching);
    		}
    	};
    }

    // (142:13) {#if distance}
    function create_if_block_1$1(ctx) {
    	let span;
    	let button;
    	let current;

    	button = new Button({
    			props: {
    				type: "secondary",
    				$$slots: { default: [create_default_slot_1$1] },
    				$$scope: { ctx }
    			}
    		});

    	return {
    		c() {
    			span = element("span");
    			create_component(button.$$.fragment);
    			attr(span, "class", "distance svelte-w3qeuq");
    		},
    		m(target, anchor) {
    			insert(target, span, anchor);
    			mount_component(button, span, null);
    			current = true;
    		},
    		p(ctx, dirty) {
    			const button_changes = {};

    			if (dirty & /*$$scope, distance*/ 65540) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			if (detaching) detach(span);
    			destroy_component(button);
    		}
    	};
    }

    // (143:8) <Button type="secondary">
    function create_default_slot_1$1(ctx) {
    	let icon;
    	let t0;
    	let t1;
    	let current;
    	icon = new Icon({ props: { type: "location" } });

    	return {
    		c() {
    			create_component(icon.$$.fragment);
    			t0 = space();
    			t1 = text(/*distance*/ ctx[2]);
    		},
    		m(target, anchor) {
    			mount_component(icon, target, anchor);
    			insert(target, t0, anchor);
    			insert(target, t1, anchor);
    			current = true;
    		},
    		p(ctx, dirty) {
    			if (!current || dirty & /*distance*/ 4) set_data(t1, /*distance*/ ctx[2]);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(icon.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(icon.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			destroy_component(icon, detaching);
    			if (detaching) detach(t0);
    			if (detaching) detach(t1);
    		}
    	};
    }

    // (140:4) <ButtonBar>
    function create_default_slot$2(ctx) {
    	let if_block_anchor;
    	let current;
    	const buttons_slot_template = /*#slots*/ ctx[15].buttons;
    	const buttons_slot = create_slot(buttons_slot_template, ctx, /*$$scope*/ ctx[16], get_buttons_slot_context);
    	let if_block = /*distance*/ ctx[2] && create_if_block_1$1(ctx);

    	return {
    		c() {
    			if (buttons_slot) buttons_slot.c();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m(target, anchor) {
    			if (buttons_slot) {
    				buttons_slot.m(target, anchor);
    			}

    			if (if_block) if_block.m(target, anchor);
    			insert(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p(ctx, dirty) {
    			if (buttons_slot) {
    				if (buttons_slot.p && dirty & /*$$scope*/ 65536) {
    					update_slot(buttons_slot, buttons_slot_template, ctx, /*$$scope*/ ctx[16], dirty, get_buttons_slot_changes, get_buttons_slot_context);
    				}
    			}

    			if (/*distance*/ ctx[2]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*distance*/ 4) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block_1$1(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i(local) {
    			if (current) return;
    			transition_in(buttons_slot, local);
    			transition_in(if_block);
    			current = true;
    		},
    		o(local) {
    			transition_out(buttons_slot, local);
    			transition_out(if_block);
    			current = false;
    		},
    		d(detaching) {
    			if (buttons_slot) buttons_slot.d(detaching);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach(if_block_anchor);
    		}
    	};
    }

    function create_fragment$7(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*element*/ ctx[0] && create_if_block$2(ctx);

    	return {
    		c() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p(ctx, [dirty]) {
    			if (/*element*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*element*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$2(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach(if_block_anchor);
    		}
    	};
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let title;
    	let supertext;
    	let description;
    	let short_description;
    	let imageRef;
    	let $elementDetail;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	let { element } = $$props; // alaways use prop if passed in directly 

    	// console.log("ContentElement with element prop", element)
    	// otherwise use global store if available
    	let elementDetail = InterkitClient.getGlobalStore("elementDetail");

    	component_subscribe($$self, elementDetail, value => $$invalidate(18, $elementDetail = value));

    	if (!element && $elementDetail) {
    		element = $elementDetail;
    		console.log("using elementDetail store", element);
    	}

    	// otherwise get context from listNav
    	let listNavContext = getContext("listNav");

    	if (!element && listNavContext) {
    		listNavContext.singleViewData.subscribe(data => {
    			$$invalidate(0, element = data);
    			console.log("detected listnav context update, set element to", element);
    		});
    	}

    	// set context for buttons in buttons slot
    	const buttonPayloadStore = writable(element);

    	setContext("buttonBar", { buttonPayload: buttonPayloadStore });
    	let { supertextColumn } = $$props;
    	let { titleColumn } = $$props;
    	let { shortDescriptionColumn } = $$props;
    	let { descriptionColumn } = $$props;
    	let { imageColumn } = $$props;
    	let { locationColumn } = $$props;
    	let { size = element?.size || "m" } = $$props;

    	// s - used in dashboard slider and lists (TODO)
    	// m - used in map - small image, short description only
    	// l - used in full view
    	// slide - used in Slider
    	// TODO: reorganize/generalize these styling options somehow?
    	const elementColumns = {
    		supertextColumn,
    		titleColumn,
    		descriptionColumn,
    		shortDescriptionColumn,
    		imageColumn,
    		locationColumn
    	};

    	// we calculate our own distance here
    	InterkitClient.getGlobalStore("userPosition");
    	let distance;

    	$$self.$$set = $$props => {
    		if ("element" in $$props) $$invalidate(0, element = $$props.element);
    		if ("supertextColumn" in $$props) $$invalidate(9, supertextColumn = $$props.supertextColumn);
    		if ("titleColumn" in $$props) $$invalidate(10, titleColumn = $$props.titleColumn);
    		if ("shortDescriptionColumn" in $$props) $$invalidate(11, shortDescriptionColumn = $$props.shortDescriptionColumn);
    		if ("descriptionColumn" in $$props) $$invalidate(12, descriptionColumn = $$props.descriptionColumn);
    		if ("imageColumn" in $$props) $$invalidate(13, imageColumn = $$props.imageColumn);
    		if ("locationColumn" in $$props) $$invalidate(14, locationColumn = $$props.locationColumn);
    		if ("size" in $$props) $$invalidate(1, size = $$props.size);
    		if ("$$scope" in $$props) $$invalidate(16, $$scope = $$props.$$scope);
    	};

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*element*/ 1) {
    			// update store whenever it changes
    			buttonPayloadStore.set(element);
    		}

    		if ($$self.$$.dirty & /*element*/ 1) {
    			$$invalidate(3, title = util.rowVal(element, elementColumns.titleColumn));
    		}

    		if ($$self.$$.dirty & /*element*/ 1) {
    			$$invalidate(4, supertext = util.rowVal(element, elementColumns.supertextColumn));
    		}

    		if ($$self.$$.dirty & /*element*/ 1) {
    			$$invalidate(5, description = util.rowValString(element, elementColumns.descriptionColumn));
    		}

    		if ($$self.$$.dirty & /*element*/ 1) {
    			$$invalidate(6, short_description = util.rowValString(element, elementColumns.shortDescriptionColumn));
    		}

    		if ($$self.$$.dirty & /*element*/ 1) {
    			$$invalidate(7, imageRef = util.rowVal(element, elementColumns.imageColumn));
    		}
    	};

    	return [
    		element,
    		size,
    		distance,
    		title,
    		supertext,
    		description,
    		short_description,
    		imageRef,
    		elementDetail,
    		supertextColumn,
    		titleColumn,
    		shortDescriptionColumn,
    		descriptionColumn,
    		imageColumn,
    		locationColumn,
    		slots,
    		$$scope
    	];
    }

    class ContentElement extends SvelteComponent {
    	constructor(options) {
    		super();

    		init(this, options, instance$7, create_fragment$7, safe_not_equal, {
    			element: 0,
    			supertextColumn: 9,
    			titleColumn: 10,
    			shortDescriptionColumn: 11,
    			descriptionColumn: 12,
    			imageColumn: 13,
    			locationColumn: 14,
    			size: 1
    		});
    	}
    }

    /* ../../../packages/interkit/components/ElementList.svelte generated by Svelte v3.35.0 */

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[8] = list[i];
    	return child_ctx;
    }

    const get_contentElement_slot_changes = dirty => ({ element: dirty & /*$elements*/ 2 });

    const get_contentElement_slot_context = ctx => ({
    	element: { .../*element*/ ctx[8].row, size: "l" }
    });

    const get_emptyElement_slot_changes = dirty => ({});
    const get_emptyElement_slot_context = ctx => ({});

    // (33:0) {#if $elements}
    function create_if_block$1(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block_1, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*$elements*/ ctx[1].length == 0) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	return {
    		c() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach(if_block_anchor);
    		}
    	};
    }

    // (36:2) {:else}
    function create_else_block(ctx) {
    	let ul;
    	let current;
    	let each_value = /*$elements*/ ctx[1];
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	return {
    		c() {
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}
    		},
    		m(target, anchor) {
    			insert(target, ul, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul, null);
    			}

    			current = true;
    		},
    		p(ctx, dirty) {
    			if (dirty & /*onClick, $elements, selectTrigger, $$scope*/ 75) {
    				each_value = /*$elements*/ ctx[1];
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(ul, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d(detaching) {
    			if (detaching) detach(ul);
    			destroy_each(each_blocks, detaching);
    		}
    	};
    }

    // (34:2) {#if $elements.length == 0}
    function create_if_block_1(ctx) {
    	let current;
    	const emptyElement_slot_template = /*#slots*/ ctx[4].emptyElement;
    	const emptyElement_slot = create_slot(emptyElement_slot_template, ctx, /*$$scope*/ ctx[6], get_emptyElement_slot_context);

    	return {
    		c() {
    			if (emptyElement_slot) emptyElement_slot.c();
    		},
    		m(target, anchor) {
    			if (emptyElement_slot) {
    				emptyElement_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p(ctx, dirty) {
    			if (emptyElement_slot) {
    				if (emptyElement_slot.p && dirty & /*$$scope*/ 64) {
    					update_slot(emptyElement_slot, emptyElement_slot_template, ctx, /*$$scope*/ ctx[6], dirty, get_emptyElement_slot_changes, get_emptyElement_slot_context);
    				}
    			}
    		},
    		i(local) {
    			if (current) return;
    			transition_in(emptyElement_slot, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(emptyElement_slot, local);
    			current = false;
    		},
    		d(detaching) {
    			if (emptyElement_slot) emptyElement_slot.d(detaching);
    		}
    	};
    }

    // (41:10) {#if selectTrigger}
    function create_if_block_2(ctx) {
    	let span;
    	let button;
    	let current;

    	button = new Button({
    			props: {
    				type: "secondary",
    				$$slots: { default: [create_default_slot$1] },
    				$$scope: { ctx }
    			}
    		});

    	return {
    		c() {
    			span = element("span");
    			create_component(button.$$.fragment);
    			attr(span, "class", "right-arrow svelte-179ddyw");
    		},
    		m(target, anchor) {
    			insert(target, span, anchor);
    			mount_component(button, span, null);
    			current = true;
    		},
    		i(local) {
    			if (current) return;
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			if (detaching) detach(span);
    			destroy_component(button);
    		}
    	};
    }

    // (42:38) <Button type="secondary">
    function create_default_slot$1(ctx) {
    	let icon;
    	let current;
    	icon = new Icon({ props: { type: "arrow-right" } });

    	return {
    		c() {
    			create_component(icon.$$.fragment);
    		},
    		m(target, anchor) {
    			mount_component(icon, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i(local) {
    			if (current) return;
    			transition_in(icon.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(icon.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			destroy_component(icon, detaching);
    		}
    	};
    }

    // (38:6) {#each $elements as element}
    function create_each_block(ctx) {
    	let li;
    	let t0;
    	let t1;
    	let current;
    	let mounted;
    	let dispose;
    	const contentElement_slot_template = /*#slots*/ ctx[4].contentElement;
    	const contentElement_slot = create_slot(contentElement_slot_template, ctx, /*$$scope*/ ctx[6], get_contentElement_slot_context);
    	let if_block = /*selectTrigger*/ ctx[0] && create_if_block_2(ctx);

    	function click_handler() {
    		return /*click_handler*/ ctx[5](/*element*/ ctx[8]);
    	}

    	return {
    		c() {
    			li = element("li");
    			if (contentElement_slot) contentElement_slot.c();
    			t0 = space();
    			if (if_block) if_block.c();
    			t1 = space();
    			attr(li, "class", "item svelte-179ddyw");
    		},
    		m(target, anchor) {
    			insert(target, li, anchor);

    			if (contentElement_slot) {
    				contentElement_slot.m(li, null);
    			}

    			append(li, t0);
    			if (if_block) if_block.m(li, null);
    			append(li, t1);
    			current = true;

    			if (!mounted) {
    				dispose = listen(li, "click", click_handler);
    				mounted = true;
    			}
    		},
    		p(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (contentElement_slot) {
    				if (contentElement_slot.p && dirty & /*$$scope, $elements*/ 66) {
    					update_slot(contentElement_slot, contentElement_slot_template, ctx, /*$$scope*/ ctx[6], dirty, get_contentElement_slot_changes, get_contentElement_slot_context);
    				}
    			}

    			if (/*selectTrigger*/ ctx[0]) {
    				if (if_block) {
    					if (dirty & /*selectTrigger*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block_2(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(li, t1);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i(local) {
    			if (current) return;
    			transition_in(contentElement_slot, local);
    			transition_in(if_block);
    			current = true;
    		},
    		o(local) {
    			transition_out(contentElement_slot, local);
    			transition_out(if_block);
    			current = false;
    		},
    		d(detaching) {
    			if (detaching) detach(li);
    			if (contentElement_slot) contentElement_slot.d(detaching);
    			if (if_block) if_block.d();
    			mounted = false;
    			dispose();
    		}
    	};
    }

    function create_fragment$6(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*$elements*/ ctx[1] && create_if_block$1(ctx);

    	return {
    		c() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p(ctx, [dirty]) {
    			if (/*$elements*/ ctx[1]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*$elements*/ 2) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$1(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach(if_block_anchor);
    		}
    	};
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let $elements;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	let { selectTrigger } = $$props;

    	/*
      @example
      <Button>
        Text
      </Button>
    */
    	let elementsContext = getContext("elementsProvider");

    	if (!elementsContext) alert("ElementList needs elementsContextProvider as parent");
    	let elements = elementsContext?.elements;
    	component_subscribe($$self, elements, value => $$invalidate(1, $elements = value));

    	const onClick = element => {
    		console.log("onClick", element);

    		// also trigger the action, if set
    		if (selectTrigger) executeTrigger(selectTrigger, element.row);
    	};

    	const click_handler = element => {
    		onClick(element);
    	};

    	$$self.$$set = $$props => {
    		if ("selectTrigger" in $$props) $$invalidate(0, selectTrigger = $$props.selectTrigger);
    		if ("$$scope" in $$props) $$invalidate(6, $$scope = $$props.$$scope);
    	};

    	return [selectTrigger, $elements, elements, onClick, slots, click_handler, $$scope];
    }

    class ElementList extends SvelteComponent {
    	constructor(options) {
    		super();
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, { selectTrigger: 0 });
    	}
    }

    /* ../../../packages/interkit/components/ElementsContextProvider.svelte generated by Svelte v3.35.0 */

    function create_fragment$5(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[10].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[9], null);

    	return {
    		c() {
    			if (default_slot) default_slot.c();
    		},
    		m(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 512) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[9], dirty, null, null);
    				}
    			}
    		},
    		i(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let $elementProperties;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	let { sheetKey } = $$props; // the sheet to get the elements from
    	let { sortColumn } = $$props; // the column by which to sort the elements
    	let { hideColumn } = $$props; // a column that filters elements 
    	let { excludePropertiesAny } = $$props; // exclude elements with any of these properties
    	let { includePropertiesAny } = $$props; // include elements with any of these properties 
    	let { discoverableColumn } = $$props; // a column that filters elements unless they are explicitly discovered
    	let { discoverProperty } = $$props; // a property that overrides the discoverableColumn
    	let unsubscribe;
    	let unfilteredData;
    	let providedData = writable([]);
    	const elementProperties = InterkitClient.getGlobalStore("elementProperties");
    	component_subscribe($$self, elementProperties, value => $$invalidate(8, $elementProperties = value));

    	//console.log("ElementsContextProvider")
    	const filterData = data => {
    		//console.log("filterData", data, $elementProperties, hideColumn, sortColumn, excludePropertiesAny, includePropertiesAny)
    		if (!data) return [];

    		// exclude elements that have true in hideColumn
    		if (hideColumn) {
    			data = data.filter(a => a.hideColumn != "true");
    		}

    		// sort elemets by sortcolumn
    		if (sortColumn) {
    			data.sort((a, b) => a.sortColumn - b.sortColumn);
    		}

    		// exclude elements with any of these properties set to true
    		if (excludePropertiesAny) {
    			for (let property of excludePropertiesAny.split(", ")) {
    				data = data.filter(a => $elementProperties?.[a.key]?.[property]);
    			}
    		}

    		// include only elements with one of these properties set to true
    		if (includePropertiesAny) {
    			//console.log("includePropertiesAny")
    			let filteredData = [];

    			for (let element of data) {
    				for (let property of includePropertiesAny.split(", ")) {
    					if ($elementProperties?.[element.key]?.[property]) {
    						filteredData.push(element);
    						break;
    					}
    				}
    			}

    			data = filteredData;
    		}

    		// check for discoverables and exclude if not yet discoverd
    		if (discoverableColumn && discoverProperty) {
    			let filteredData = [];

    			for (let element of data) {
    				if (!element.discoverableColumn || element.discoverableColumn && $elementProperties?.[element.key]?.[discoverProperty]) {
    					filteredData.push(element);
    				}
    			}

    			data = filteredData;
    		}

    		return data;
    	};

    	const refilter = () => {
    		providedData.set(filterData(unfilteredData));
    	};

    	const initSubs = async () => {
    		if (!sheetKey) {
    			alert("ElementsContextProvider - no sheetKey set");
    			return;
    		}

    		let rows = await InterkitClient.getRowSubStore(sheetKey, {
    			sortColumn,
    			hideColumn,
    			discoverableColumn
    		});

    		// refilter data when data changes
    		unsubscribe = rows.subscribe(data => {
    			unfilteredData = data;
    			refilter();
    		});
    	};

    	setContext("elementsProvider", { elements: providedData });
    	onMount(initSubs);

    	onDestroy(() => {
    		if (unsubscribe) unsubscribe();
    	});

    	$$self.$$set = $$props => {
    		if ("sheetKey" in $$props) $$invalidate(1, sheetKey = $$props.sheetKey);
    		if ("sortColumn" in $$props) $$invalidate(2, sortColumn = $$props.sortColumn);
    		if ("hideColumn" in $$props) $$invalidate(3, hideColumn = $$props.hideColumn);
    		if ("excludePropertiesAny" in $$props) $$invalidate(4, excludePropertiesAny = $$props.excludePropertiesAny);
    		if ("includePropertiesAny" in $$props) $$invalidate(5, includePropertiesAny = $$props.includePropertiesAny);
    		if ("discoverableColumn" in $$props) $$invalidate(6, discoverableColumn = $$props.discoverableColumn);
    		if ("discoverProperty" in $$props) $$invalidate(7, discoverProperty = $$props.discoverProperty);
    		if ("$$scope" in $$props) $$invalidate(9, $$scope = $$props.$$scope);
    	};

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$elementProperties*/ 256) {
    			// refilter data if elementProperties change
    			{
    				if ($elementProperties) {
    					console.log("ElementsContextProvider detected change in elementProperties, refiltering");
    					refilter();
    				}
    			}
    		}
    	};

    	return [
    		elementProperties,
    		sheetKey,
    		sortColumn,
    		hideColumn,
    		excludePropertiesAny,
    		includePropertiesAny,
    		discoverableColumn,
    		discoverProperty,
    		$elementProperties,
    		$$scope,
    		slots
    	];
    }

    class ElementsContextProvider extends SvelteComponent {
    	constructor(options) {
    		super();

    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {
    			sheetKey: 1,
    			sortColumn: 2,
    			hideColumn: 3,
    			excludePropertiesAny: 4,
    			includePropertiesAny: 5,
    			discoverableColumn: 6,
    			discoverProperty: 7
    		});
    	}
    }

    /* ../../../packages/interkit/components/HeadlinePage.svelte generated by Svelte v3.35.0 */

    function create_fragment$4(ctx) {
    	let h1;
    	let t;

    	return {
    		c() {
    			h1 = element("h1");
    			t = text(/*headline*/ ctx[0]);
    			attr(h1, "class", "HeadlinePage svelte-1o0py12");
    		},
    		m(target, anchor) {
    			insert(target, h1, anchor);
    			append(h1, t);
    		},
    		p(ctx, [dirty]) {
    			if (dirty & /*headline*/ 1) set_data(t, /*headline*/ ctx[0]);
    		},
    		i: noop,
    		o: noop,
    		d(detaching) {
    			if (detaching) detach(h1);
    		}
    	};
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { headline = "test headline" } = $$props;

    	$$self.$$set = $$props => {
    		if ("headline" in $$props) $$invalidate(0, headline = $$props.headline);
    	};

    	return [headline];
    }

    class HeadlinePage extends SvelteComponent {
    	constructor(options) {
    		super();
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, { headline: 0 });
    	}
    }

    /* ../../../packages/interkit/components/ScrollContainer.svelte generated by Svelte v3.35.0 */

    function create_fragment$3(ctx) {
    	let div;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[3].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[2], null);

    	return {
    		c() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			attr(div, "class", "ScrollContainer svelte-1ytj1hi");
    		},
    		m(target, anchor) {
    			insert(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			/*div_binding*/ ctx[4](div);
    			current = true;

    			if (!mounted) {
    				dispose = listen(div, "scroll", /*scroll*/ ctx[1]);
    				mounted = true;
    			}
    		},
    		p(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 4) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[2], dirty, null, null);
    				}
    			}
    		},
    		i(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d(detaching) {
    			if (detaching) detach(div);
    			if (default_slot) default_slot.d(detaching);
    			/*div_binding*/ ctx[4](null);
    			mounted = false;
    			dispose();
    		}
    	};
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	let containerElement;

    	const scrollUp = () => {
    		//console.log("scroll up!")
    		if (containerElement) containerElement.scrollTo(0, 0);
    	};

    	// context for children (for example ElementList)
    	setContext("scrollContainer", { scrollUp });

    	// get context from BottomMenuPage
    	let pageContext = getContext("BottomMenuPage");

    	let lastScrollTop = 0;
    	let lastScrolledUp;

    	const scroll = e => {
    		//console.log("scrolled to", e.target.scrollTop)
    		if (pageContext?.setScrolling) {
    			// scrolling down
    			if (e.target.scrollTop > lastScrollTop && (!lastScrolledUp || new Date().getTime() - lastScrolledUp > 1000)) {
    				pageContext.setScrolling(1);
    			}

    			// scrolling up
    			if (e.target.scrollTop < lastScrollTop) {
    				pageContext.setScrolling(-1);
    				lastScrolledUp = new Date().getTime();
    			} //console.log(lastScrolledUp)

    			lastScrollTop = e.target.scrollTop;
    		}
    	};

    	function div_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			containerElement = $$value;
    			$$invalidate(0, containerElement);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ("$$scope" in $$props) $$invalidate(2, $$scope = $$props.$$scope);
    	};

    	return [containerElement, scroll, $$scope, slots, div_binding];
    }

    class ScrollContainer extends SvelteComponent {
    	constructor(options) {
    		super();
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});
    	}
    }

    /* ../../../packages/interkit/components/Span.svelte generated by Svelte v3.35.0 */

    function create_fragment$2(ctx) {
    	let span;
    	let t;

    	return {
    		c() {
    			span = element("span");
    			t = text(/*text*/ ctx[0]);
    		},
    		m(target, anchor) {
    			insert(target, span, anchor);
    			append(span, t);
    		},
    		p(ctx, [dirty]) {
    			if (dirty & /*text*/ 1) set_data(t, /*text*/ ctx[0]);
    		},
    		i: noop,
    		o: noop,
    		d(detaching) {
    			if (detaching) detach(span);
    		}
    	};
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { text } = $$props;

    	$$self.$$set = $$props => {
    		if ("text" in $$props) $$invalidate(0, text = $$props.text);
    	};

    	return [text];
    }

    class Span extends SvelteComponent {
    	constructor(options) {
    		super();
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, { text: 0 });
    	}
    }

    /* ../../../packages/interkit/components/Theming.svelte generated by Svelte v3.35.0 */

    function create_if_block(ctx) {
    	let link;
    	let t;
    	let script;
    	let script_src_value;

    	return {
    		c() {
    			link = element("link");
    			t = space();
    			script = element("script");
    			attr(link, "rel", "stylesheet");
    			attr(link, "href", /*cssFile*/ ctx[0]);
    			script.defer = true;
    			if (script.src !== (script_src_value = /*jsFile*/ ctx[1])) attr(script, "src", script_src_value);
    		},
    		m(target, anchor) {
    			insert(target, link, anchor);
    			insert(target, t, anchor);
    			insert(target, script, anchor);
    		},
    		p(ctx, dirty) {
    			if (dirty & /*cssFile*/ 1) {
    				attr(link, "href", /*cssFile*/ ctx[0]);
    			}

    			if (dirty & /*jsFile*/ 2 && script.src !== (script_src_value = /*jsFile*/ ctx[1])) {
    				attr(script, "src", script_src_value);
    			}
    		},
    		d(detaching) {
    			if (detaching) detach(link);
    			if (detaching) detach(t);
    			if (detaching) detach(script);
    		}
    	};
    }

    function create_fragment$1(ctx) {
    	let if_block_anchor;
    	let if_block = /*$config*/ ctx[2]?.INTERKIT_APP_LOAD_THEME && create_if_block(ctx);

    	return {
    		c() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m(target, anchor) {
    			if (if_block) if_block.m(document.head, null);
    			append(document.head, if_block_anchor);
    		},
    		p(ctx, [dirty]) {
    			if (/*$config*/ ctx[2]?.INTERKIT_APP_LOAD_THEME) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d(detaching) {
    			if (if_block) if_block.d(detaching);
    			detach(if_block_anchor);
    		}
    	};
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let $config;
    	let { cssFile } = $$props;
    	let { jsFile } = $$props;
    	let config = InterkitClient.config;
    	component_subscribe($$self, config, value => $$invalidate(2, $config = value));

    	$$self.$$set = $$props => {
    		if ("cssFile" in $$props) $$invalidate(0, cssFile = $$props.cssFile);
    		if ("jsFile" in $$props) $$invalidate(1, jsFile = $$props.jsFile);
    	};

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*cssFile, $config*/ 5) {
    			console.log("theming", cssFile, $config);
    		}
    	};

    	return [cssFile, jsFile, $config, config];
    }

    class Theming extends SvelteComponent {
    	constructor(options) {
    		super();
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, { cssFile: 0, jsFile: 1 });
    	}
    }

    /* src/App.svelte generated by Svelte v3.35.0 */

    function create_contentElement_slot(ctx) {
    	let headlinepage0;
    	let t0;
    	let contentelement0;
    	let t1;
    	let headlinepage1;
    	let t2;
    	let contentelement1;
    	let t3;
    	let headlinepage2;
    	let t4;
    	let contentelement2;
    	let t5;
    	let headlinepage3;
    	let t6;
    	let contentelement3;
    	let current;
    	headlinepage0 = new HeadlinePage({ props: { headline: "l" } });

    	contentelement0 = new ContentElement({
    			props: {
    				supertextColumn: "elements/supertext",
    				titleColumn: "elements/title",
    				shortDescriptionColumn: "elements/shortDescription",
    				descriptionColumn: "elements/description",
    				imageColumn: "elements/image",
    				locationColumn: "elements/position",
    				size: "l",
    				element: /*element*/ ctx[0]
    			}
    		});

    	headlinepage1 = new HeadlinePage({ props: { headline: "s" } });

    	contentelement1 = new ContentElement({
    			props: {
    				supertextColumn: "elements/supertext",
    				titleColumn: "elements/title",
    				shortDescriptionColumn: "elements/shortDescription",
    				descriptionColumn: "elements/description",
    				imageColumn: "elements/image",
    				locationColumn: "elements/position",
    				size: "s",
    				element: /*element*/ ctx[0]
    			}
    		});

    	headlinepage2 = new HeadlinePage({ props: { headline: "xs" } });

    	contentelement2 = new ContentElement({
    			props: {
    				supertextColumn: "elements/supertext",
    				titleColumn: "elements/title",
    				shortDescriptionColumn: "elements/shortDescription",
    				descriptionColumn: "elements/description",
    				imageColumn: "elements/image",
    				locationColumn: "elements/position",
    				size: "xs",
    				element: /*element*/ ctx[0]
    			}
    		});

    	headlinepage3 = new HeadlinePage({ props: { headline: "slide" } });

    	contentelement3 = new ContentElement({
    			props: {
    				supertextColumn: "elements/supertext",
    				titleColumn: "elements/title",
    				shortDescriptionColumn: "elements/shortDescription",
    				descriptionColumn: "elements/description",
    				imageColumn: "elements/image",
    				locationColumn: "elements/position",
    				size: "slide",
    				element: /*element*/ ctx[0]
    			}
    		});

    	return {
    		c() {
    			create_component(headlinepage0.$$.fragment);
    			t0 = space();
    			create_component(contentelement0.$$.fragment);
    			t1 = space();
    			create_component(headlinepage1.$$.fragment);
    			t2 = space();
    			create_component(contentelement1.$$.fragment);
    			t3 = space();
    			create_component(headlinepage2.$$.fragment);
    			t4 = space();
    			create_component(contentelement2.$$.fragment);
    			t5 = space();
    			create_component(headlinepage3.$$.fragment);
    			t6 = space();
    			create_component(contentelement3.$$.fragment);
    		},
    		m(target, anchor) {
    			mount_component(headlinepage0, target, anchor);
    			insert(target, t0, anchor);
    			mount_component(contentelement0, target, anchor);
    			insert(target, t1, anchor);
    			mount_component(headlinepage1, target, anchor);
    			insert(target, t2, anchor);
    			mount_component(contentelement1, target, anchor);
    			insert(target, t3, anchor);
    			mount_component(headlinepage2, target, anchor);
    			insert(target, t4, anchor);
    			mount_component(contentelement2, target, anchor);
    			insert(target, t5, anchor);
    			mount_component(headlinepage3, target, anchor);
    			insert(target, t6, anchor);
    			mount_component(contentelement3, target, anchor);
    			current = true;
    		},
    		p(ctx, dirty) {
    			const contentelement0_changes = {};
    			if (dirty & /*element*/ 1) contentelement0_changes.element = /*element*/ ctx[0];
    			contentelement0.$set(contentelement0_changes);
    			const contentelement1_changes = {};
    			if (dirty & /*element*/ 1) contentelement1_changes.element = /*element*/ ctx[0];
    			contentelement1.$set(contentelement1_changes);
    			const contentelement2_changes = {};
    			if (dirty & /*element*/ 1) contentelement2_changes.element = /*element*/ ctx[0];
    			contentelement2.$set(contentelement2_changes);
    			const contentelement3_changes = {};
    			if (dirty & /*element*/ 1) contentelement3_changes.element = /*element*/ ctx[0];
    			contentelement3.$set(contentelement3_changes);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(headlinepage0.$$.fragment, local);
    			transition_in(contentelement0.$$.fragment, local);
    			transition_in(headlinepage1.$$.fragment, local);
    			transition_in(contentelement1.$$.fragment, local);
    			transition_in(headlinepage2.$$.fragment, local);
    			transition_in(contentelement2.$$.fragment, local);
    			transition_in(headlinepage3.$$.fragment, local);
    			transition_in(contentelement3.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(headlinepage0.$$.fragment, local);
    			transition_out(contentelement0.$$.fragment, local);
    			transition_out(headlinepage1.$$.fragment, local);
    			transition_out(contentelement1.$$.fragment, local);
    			transition_out(headlinepage2.$$.fragment, local);
    			transition_out(contentelement2.$$.fragment, local);
    			transition_out(headlinepage3.$$.fragment, local);
    			transition_out(contentelement3.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			destroy_component(headlinepage0, detaching);
    			if (detaching) detach(t0);
    			destroy_component(contentelement0, detaching);
    			if (detaching) detach(t1);
    			destroy_component(headlinepage1, detaching);
    			if (detaching) detach(t2);
    			destroy_component(contentelement1, detaching);
    			if (detaching) detach(t3);
    			destroy_component(headlinepage2, detaching);
    			if (detaching) detach(t4);
    			destroy_component(contentelement2, detaching);
    			if (detaching) detach(t5);
    			destroy_component(headlinepage3, detaching);
    			if (detaching) detach(t6);
    			destroy_component(contentelement3, detaching);
    		}
    	};
    }

    // (100:6) <svelte:fragment slot="emptyElement">
    function create_emptyElement_slot(ctx) {
    	let span;
    	let current;
    	span = new Span({ props: { text: "nothing to see here" } });

    	return {
    		c() {
    			create_component(span.$$.fragment);
    		},
    		m(target, anchor) {
    			mount_component(span, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i(local) {
    			if (current) return;
    			transition_in(span.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(span.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			destroy_component(span, detaching);
    		}
    	};
    }

    // (22:4) <ScrollContainer     >
    function create_default_slot_1(ctx) {
    	let elementlist;
    	let current;

    	elementlist = new ElementList({
    			props: {
    				dataSheetKey: "elements",
    				sortColumn: "elements/categoryOrder",
    				bookmarkFilter: "FALSE",
    				hideColumn: "elements/hideInArchive",
    				$$slots: {
    					emptyElement: [create_emptyElement_slot],
    					contentElement: [
    						create_contentElement_slot,
    						({ element }) => ({ 0: element }),
    						({ element }) => element ? 1 : 0
    					]
    				},
    				$$scope: { ctx }
    			}
    		});

    	return {
    		c() {
    			create_component(elementlist.$$.fragment);
    		},
    		m(target, anchor) {
    			mount_component(elementlist, target, anchor);
    			current = true;
    		},
    		p(ctx, dirty) {
    			const elementlist_changes = {};

    			if (dirty & /*$$scope, element*/ 3) {
    				elementlist_changes.$$scope = { dirty, ctx };
    			}

    			elementlist.$set(elementlist_changes);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(elementlist.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(elementlist.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			destroy_component(elementlist, detaching);
    		}
    	};
    }

    // (17:2) <ElementsContextProvider      sheetKey="elements"                  discoverableColumn="elements/discoverable"      discoverProperty="discovered"   >
    function create_default_slot(ctx) {
    	let scrollcontainer;
    	let current;

    	scrollcontainer = new ScrollContainer({
    			props: {
    				$$slots: { default: [create_default_slot_1] },
    				$$scope: { ctx }
    			}
    		});

    	return {
    		c() {
    			create_component(scrollcontainer.$$.fragment);
    		},
    		m(target, anchor) {
    			mount_component(scrollcontainer, target, anchor);
    			current = true;
    		},
    		p(ctx, dirty) {
    			const scrollcontainer_changes = {};

    			if (dirty & /*$$scope*/ 2) {
    				scrollcontainer_changes.$$scope = { dirty, ctx };
    			}

    			scrollcontainer.$set(scrollcontainer_changes);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(scrollcontainer.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(scrollcontainer.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			destroy_component(scrollcontainer, detaching);
    		}
    	};
    }

    // (16:0) <svelte:fragment slot="viewport">
    function create_viewport_slot(ctx) {
    	let elementscontextprovider;
    	let current;

    	elementscontextprovider = new ElementsContextProvider({
    			props: {
    				sheetKey: "elements",
    				discoverableColumn: "elements/discoverable",
    				discoverProperty: "discovered",
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			}
    		});

    	return {
    		c() {
    			create_component(elementscontextprovider.$$.fragment);
    		},
    		m(target, anchor) {
    			mount_component(elementscontextprovider, target, anchor);
    			current = true;
    		},
    		p(ctx, dirty) {
    			const elementscontextprovider_changes = {};

    			if (dirty & /*$$scope*/ 2) {
    				elementscontextprovider_changes.$$scope = { dirty, ctx };
    			}

    			elementscontextprovider.$set(elementscontextprovider_changes);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(elementscontextprovider.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(elementscontextprovider.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			destroy_component(elementscontextprovider, detaching);
    		}
    	};
    }

    function create_fragment(ctx) {
    	let appbase;
    	let t;
    	let theming;
    	let current;

    	appbase = new AppBase({
    			props: {
    				$$slots: { viewport: [create_viewport_slot] },
    				$$scope: { ctx }
    			}
    		});

    	theming = new Theming({ props: { cssFile: "global.css" } });

    	return {
    		c() {
    			create_component(appbase.$$.fragment);
    			t = space();
    			create_component(theming.$$.fragment);
    		},
    		m(target, anchor) {
    			mount_component(appbase, target, anchor);
    			insert(target, t, anchor);
    			mount_component(theming, target, anchor);
    			current = true;
    		},
    		p(ctx, [dirty]) {
    			const appbase_changes = {};

    			if (dirty & /*$$scope*/ 2) {
    				appbase_changes.$$scope = { dirty, ctx };
    			}

    			appbase.$set(appbase_changes);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(appbase.$$.fragment, local);
    			transition_in(theming.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(appbase.$$.fragment, local);
    			transition_out(theming.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			destroy_component(appbase, detaching);
    			if (detaching) detach(t);
    			destroy_component(theming, detaching);
    		}
    	};
    }

    function instance($$self) {
    	initActions();
    	return [];
    }

    class App extends SvelteComponent {
    	constructor(options) {
    		super();
    		init(this, options, instance, create_fragment, safe_not_equal, {});
    	}
    }

    document.body.innerHTML = '';
    const app = new App({
    	target: document.body
    });

    return app;

}());
