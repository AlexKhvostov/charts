(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["modules-packs-packs-module"],{

/***/ "./node_modules/@angular/youtube-player/fesm2015/youtube-player.js":
/*!*************************************************************************!*\
  !*** ./node_modules/@angular/youtube-player/fesm2015/youtube-player.js ***!
  \*************************************************************************/
/*! exports provided: YouTubePlayer, YouTubePlayerModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "YouTubePlayer", function() { return YouTubePlayer; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "YouTubePlayerModule", function() { return YouTubePlayerModule; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm5/index.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");





/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
const DEFAULT_PLAYER_WIDTH = 640;
const DEFAULT_PLAYER_HEIGHT = 390;
/**
 * Angular component that renders a YouTube player via the YouTube player
 * iframe API.
 * @see https://developers.google.com/youtube/iframe_api_reference
 */
class YouTubePlayer {
    constructor(_ngZone, platformId) {
        this._ngZone = _ngZone;
        this._youtubeContainer = new rxjs__WEBPACK_IMPORTED_MODULE_2__["Subject"]();
        this._destroyed = new rxjs__WEBPACK_IMPORTED_MODULE_2__["Subject"]();
        this._playerChanges = new rxjs__WEBPACK_IMPORTED_MODULE_2__["BehaviorSubject"](undefined);
        this._videoId = new rxjs__WEBPACK_IMPORTED_MODULE_2__["BehaviorSubject"](undefined);
        this._height = new rxjs__WEBPACK_IMPORTED_MODULE_2__["BehaviorSubject"](DEFAULT_PLAYER_HEIGHT);
        this._width = new rxjs__WEBPACK_IMPORTED_MODULE_2__["BehaviorSubject"](DEFAULT_PLAYER_WIDTH);
        this._startSeconds = new rxjs__WEBPACK_IMPORTED_MODULE_2__["BehaviorSubject"](undefined);
        this._endSeconds = new rxjs__WEBPACK_IMPORTED_MODULE_2__["BehaviorSubject"](undefined);
        this._suggestedQuality = new rxjs__WEBPACK_IMPORTED_MODULE_2__["BehaviorSubject"](undefined);
        this._playerVars = new rxjs__WEBPACK_IMPORTED_MODULE_2__["BehaviorSubject"](undefined);
        /** Outputs are direct proxies from the player itself. */
        this.ready = this._getLazyEmitter('onReady');
        this.stateChange = this._getLazyEmitter('onStateChange');
        this.error = this._getLazyEmitter('onError');
        this.apiChange = this._getLazyEmitter('onApiChange');
        this.playbackQualityChange = this._getLazyEmitter('onPlaybackQualityChange');
        this.playbackRateChange = this._getLazyEmitter('onPlaybackRateChange');
        this._isBrowser = Object(_angular_common__WEBPACK_IMPORTED_MODULE_1__["isPlatformBrowser"])(platformId);
    }
    /** YouTube Video ID to view */
    get videoId() { return this._videoId.value; }
    set videoId(videoId) {
        this._videoId.next(videoId);
    }
    /** Height of video player */
    get height() { return this._height.value; }
    set height(height) {
        this._height.next(height || DEFAULT_PLAYER_HEIGHT);
    }
    /** Width of video player */
    get width() { return this._width.value; }
    set width(width) {
        this._width.next(width || DEFAULT_PLAYER_WIDTH);
    }
    /** The moment when the player is supposed to start playing */
    set startSeconds(startSeconds) {
        this._startSeconds.next(startSeconds);
    }
    /** The moment when the player is supposed to stop playing */
    set endSeconds(endSeconds) {
        this._endSeconds.next(endSeconds);
    }
    /** The suggested quality of the player */
    set suggestedQuality(suggestedQuality) {
        this._suggestedQuality.next(suggestedQuality);
    }
    /**
     * Extra parameters used to configure the player. See:
     * https://developers.google.com/youtube/player_parameters.html?playerVersion=HTML5#Parameters
     */
    get playerVars() { return this._playerVars.value; }
    set playerVars(playerVars) {
        this._playerVars.next(playerVars);
    }
    ngOnInit() {
        // Don't do anything if we're not in a browser environment.
        if (!this._isBrowser) {
            return;
        }
        let iframeApiAvailableObs = Object(rxjs__WEBPACK_IMPORTED_MODULE_2__["of"])(true);
        if (!window.YT) {
            if (this.showBeforeIframeApiLoads) {
                throw new Error('Namespace YT not found, cannot construct embedded youtube player. ' +
                    'Please install the YouTube Player API Reference for iframe Embeds: ' +
                    'https://developers.google.com/youtube/iframe_api_reference');
            }
            const iframeApiAvailableSubject = new rxjs__WEBPACK_IMPORTED_MODULE_2__["Subject"]();
            this._existingApiReadyCallback = window.onYouTubeIframeAPIReady;
            window.onYouTubeIframeAPIReady = () => {
                if (this._existingApiReadyCallback) {
                    this._existingApiReadyCallback();
                }
                this._ngZone.run(() => iframeApiAvailableSubject.next(true));
            };
            iframeApiAvailableObs = iframeApiAvailableSubject.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["take"])(1), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["startWith"])(false));
        }
        // An observable of the currently loaded player.
        const playerObs = createPlayerObservable(this._youtubeContainer, this._videoId, iframeApiAvailableObs, this._width, this._height, this._playerVars, this._ngZone).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["tap"])(player => {
            // Emit this before the `waitUntilReady` call so that we can bind to
            // events that happen as the player is being initialized (e.g. `onReady`).
            this._playerChanges.next(player);
        }), waitUntilReady(player => {
            // Destroy the player if loading was aborted so that we don't end up leaking memory.
            if (!playerIsReady(player)) {
                player.destroy();
            }
        }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["takeUntil"])(this._destroyed), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["publish"])());
        // Set up side effects to bind inputs to the player.
        playerObs.subscribe(player => {
            this._player = player;
            if (player && this._pendingPlayerState) {
                this._initializePlayer(player, this._pendingPlayerState);
            }
            this._pendingPlayerState = undefined;
        });
        bindSizeToPlayer(playerObs, this._width, this._height);
        bindSuggestedQualityToPlayer(playerObs, this._suggestedQuality);
        bindCueVideoCall(playerObs, this._videoId, this._startSeconds, this._endSeconds, this._suggestedQuality, this._destroyed);
        // After all of the subscriptions are set up, connect the observable.
        playerObs.connect();
    }
    /**
     * @deprecated No longer being used. To be removed.
     * @breaking-change 11.0.0
     */
    createEventsBoundInZone() {
        return {};
    }
    ngAfterViewInit() {
        this._youtubeContainer.next(this.youtubeContainer.nativeElement);
    }
    ngOnDestroy() {
        if (this._player) {
            this._player.destroy();
            window.onYouTubeIframeAPIReady = this._existingApiReadyCallback;
        }
        this._playerChanges.complete();
        this._videoId.complete();
        this._height.complete();
        this._width.complete();
        this._startSeconds.complete();
        this._endSeconds.complete();
        this._suggestedQuality.complete();
        this._youtubeContainer.complete();
        this._playerVars.complete();
        this._destroyed.next();
        this._destroyed.complete();
    }
    /** See https://developers.google.com/youtube/iframe_api_reference#playVideo */
    playVideo() {
        if (this._player) {
            this._player.playVideo();
        }
        else {
            this._getPendingState().playbackState = 1 /* PLAYING */;
        }
    }
    /** See https://developers.google.com/youtube/iframe_api_reference#pauseVideo */
    pauseVideo() {
        if (this._player) {
            this._player.pauseVideo();
        }
        else {
            this._getPendingState().playbackState = 2 /* PAUSED */;
        }
    }
    /** See https://developers.google.com/youtube/iframe_api_reference#stopVideo */
    stopVideo() {
        if (this._player) {
            this._player.stopVideo();
        }
        else {
            // It seems like YouTube sets the player to CUED when it's stopped.
            this._getPendingState().playbackState = 5 /* CUED */;
        }
    }
    /** See https://developers.google.com/youtube/iframe_api_reference#seekTo */
    seekTo(seconds, allowSeekAhead) {
        if (this._player) {
            this._player.seekTo(seconds, allowSeekAhead);
        }
        else {
            this._getPendingState().seek = { seconds, allowSeekAhead };
        }
    }
    /** See https://developers.google.com/youtube/iframe_api_reference#mute */
    mute() {
        if (this._player) {
            this._player.mute();
        }
        else {
            this._getPendingState().muted = true;
        }
    }
    /** See https://developers.google.com/youtube/iframe_api_reference#unMute */
    unMute() {
        if (this._player) {
            this._player.unMute();
        }
        else {
            this._getPendingState().muted = false;
        }
    }
    /** See https://developers.google.com/youtube/iframe_api_reference#isMuted */
    isMuted() {
        if (this._player) {
            return this._player.isMuted();
        }
        if (this._pendingPlayerState) {
            return !!this._pendingPlayerState.muted;
        }
        return false;
    }
    /** See https://developers.google.com/youtube/iframe_api_reference#setVolume */
    setVolume(volume) {
        if (this._player) {
            this._player.setVolume(volume);
        }
        else {
            this._getPendingState().volume = volume;
        }
    }
    /** See https://developers.google.com/youtube/iframe_api_reference#getVolume */
    getVolume() {
        if (this._player) {
            return this._player.getVolume();
        }
        if (this._pendingPlayerState && this._pendingPlayerState.volume != null) {
            return this._pendingPlayerState.volume;
        }
        return 0;
    }
    /** See https://developers.google.com/youtube/iframe_api_reference#setPlaybackRate */
    setPlaybackRate(playbackRate) {
        if (this._player) {
            return this._player.setPlaybackRate(playbackRate);
        }
        else {
            this._getPendingState().playbackRate = playbackRate;
        }
    }
    /** See https://developers.google.com/youtube/iframe_api_reference#getPlaybackRate */
    getPlaybackRate() {
        if (this._player) {
            return this._player.getPlaybackRate();
        }
        if (this._pendingPlayerState && this._pendingPlayerState.playbackRate != null) {
            return this._pendingPlayerState.playbackRate;
        }
        return 0;
    }
    /** See https://developers.google.com/youtube/iframe_api_reference#getAvailablePlaybackRates */
    getAvailablePlaybackRates() {
        return this._player ? this._player.getAvailablePlaybackRates() : [];
    }
    /** See https://developers.google.com/youtube/iframe_api_reference#getVideoLoadedFraction */
    getVideoLoadedFraction() {
        return this._player ? this._player.getVideoLoadedFraction() : 0;
    }
    /** See https://developers.google.com/youtube/iframe_api_reference#getPlayerState */
    getPlayerState() {
        if (!this._isBrowser || !window.YT) {
            return undefined;
        }
        if (this._player) {
            return this._player.getPlayerState();
        }
        if (this._pendingPlayerState && this._pendingPlayerState.playbackState != null) {
            return this._pendingPlayerState.playbackState;
        }
        return -1 /* UNSTARTED */;
    }
    /** See https://developers.google.com/youtube/iframe_api_reference#getCurrentTime */
    getCurrentTime() {
        if (this._player) {
            return this._player.getCurrentTime();
        }
        if (this._pendingPlayerState && this._pendingPlayerState.seek) {
            return this._pendingPlayerState.seek.seconds;
        }
        return 0;
    }
    /** See https://developers.google.com/youtube/iframe_api_reference#getPlaybackQuality */
    getPlaybackQuality() {
        return this._player ? this._player.getPlaybackQuality() : 'default';
    }
    /** See https://developers.google.com/youtube/iframe_api_reference#getAvailableQualityLevels */
    getAvailableQualityLevels() {
        return this._player ? this._player.getAvailableQualityLevels() : [];
    }
    /** See https://developers.google.com/youtube/iframe_api_reference#getDuration */
    getDuration() {
        return this._player ? this._player.getDuration() : 0;
    }
    /** See https://developers.google.com/youtube/iframe_api_reference#getVideoUrl */
    getVideoUrl() {
        return this._player ? this._player.getVideoUrl() : '';
    }
    /** See https://developers.google.com/youtube/iframe_api_reference#getVideoEmbedCode */
    getVideoEmbedCode() {
        return this._player ? this._player.getVideoEmbedCode() : '';
    }
    /** Gets an object that should be used to store the temporary API state. */
    _getPendingState() {
        if (!this._pendingPlayerState) {
            this._pendingPlayerState = {};
        }
        return this._pendingPlayerState;
    }
    /** Initializes a player from a temporary state. */
    _initializePlayer(player, state) {
        const { playbackState, playbackRate, volume, muted, seek } = state;
        switch (playbackState) {
            case 1 /* PLAYING */:
                player.playVideo();
                break;
            case 2 /* PAUSED */:
                player.pauseVideo();
                break;
            case 5 /* CUED */:
                player.stopVideo();
                break;
        }
        if (playbackRate != null) {
            player.setPlaybackRate(playbackRate);
        }
        if (volume != null) {
            player.setVolume(volume);
        }
        if (muted != null) {
            muted ? player.mute() : player.unMute();
        }
        if (seek != null) {
            player.seekTo(seek.seconds, seek.allowSeekAhead);
        }
    }
    /** Gets an observable that adds an event listener to the player when a user subscribes to it. */
    _getLazyEmitter(name) {
        // Start with the stream of players. This way the events will be transferred
        // over to the new player if it gets swapped out under-the-hood.
        return this._playerChanges.pipe(
        // Switch to the bound event. `switchMap` ensures that the old event is removed when the
        // player is changed. If there's no player, return an observable that never emits.
        Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["switchMap"])(player => {
            return player ? Object(rxjs__WEBPACK_IMPORTED_MODULE_2__["fromEventPattern"])((listener) => {
                player.addEventListener(name, listener);
            }, (listener) => {
                // The API seems to throw when we try to unbind from a destroyed player and it doesn't
                // expose whether the player has been destroyed so we have to wrap it in a try/catch to
                // prevent the entire stream from erroring out.
                try {
                    if (player.removeEventListener) {
                        player.removeEventListener(name, listener);
                    }
                }
                catch (_a) { }
            }) : Object(rxjs__WEBPACK_IMPORTED_MODULE_2__["of"])();
        }), 
        // By default we run all the API interactions outside the zone
        // so we have to bring the events back in manually when they emit.
        (source) => new rxjs__WEBPACK_IMPORTED_MODULE_2__["Observable"](observer => source.subscribe({
            next: value => this._ngZone.run(() => observer.next(value)),
            error: error => observer.error(error),
            complete: () => observer.complete()
        })), 
        // Ensures that everything is cleared out on destroy.
        Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["takeUntil"])(this._destroyed));
    }
}
YouTubePlayer.decorators = [
    { type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"], args: [{
                selector: 'youtube-player',
                changeDetection: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ChangeDetectionStrategy"].OnPush,
                encapsulation: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewEncapsulation"].None,
                // This div is *replaced* by the YouTube player embed.
                template: '<div #youtubeContainer></div>'
            },] }
];
YouTubePlayer.ctorParameters = () => [
    { type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["NgZone"] },
    { type: Object, decorators: [{ type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Inject"], args: [_angular_core__WEBPACK_IMPORTED_MODULE_0__["PLATFORM_ID"],] }] }
];
YouTubePlayer.propDecorators = {
    videoId: [{ type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"] }],
    height: [{ type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"] }],
    width: [{ type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"] }],
    startSeconds: [{ type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"] }],
    endSeconds: [{ type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"] }],
    suggestedQuality: [{ type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"] }],
    playerVars: [{ type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"] }],
    showBeforeIframeApiLoads: [{ type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Input"] }],
    ready: [{ type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Output"] }],
    stateChange: [{ type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Output"] }],
    error: [{ type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Output"] }],
    apiChange: [{ type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Output"] }],
    playbackQualityChange: [{ type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Output"] }],
    playbackRateChange: [{ type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Output"] }],
    youtubeContainer: [{ type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["ViewChild"], args: ['youtubeContainer',] }]
};
/** Listens to changes to the given width and height and sets it on the player. */
function bindSizeToPlayer(playerObs, widthObs, heightObs) {
    return Object(rxjs__WEBPACK_IMPORTED_MODULE_2__["combineLatest"])([playerObs, widthObs, heightObs])
        .subscribe(([player, width, height]) => player && player.setSize(width, height));
}
/** Listens to changes from the suggested quality and sets it on the given player. */
function bindSuggestedQualityToPlayer(playerObs, suggestedQualityObs) {
    return Object(rxjs__WEBPACK_IMPORTED_MODULE_2__["combineLatest"])([
        playerObs,
        suggestedQualityObs
    ]).subscribe(([player, suggestedQuality]) => player && suggestedQuality && player.setPlaybackQuality(suggestedQuality));
}
/**
 * Returns an observable that emits the loaded player once it's ready. Certain properties/methods
 * won't be available until the iframe finishes loading.
 * @param onAbort Callback function that will be invoked if the player loading was aborted before
 * it was able to complete. Can be used to clean up any loose references.
 */
function waitUntilReady(onAbort) {
    return Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["flatMap"])(player => {
        if (!player) {
            return Object(rxjs__WEBPACK_IMPORTED_MODULE_2__["of"])(undefined);
        }
        if (playerIsReady(player)) {
            return Object(rxjs__WEBPACK_IMPORTED_MODULE_2__["of"])(player);
        }
        // Since removeEventListener is not on Player when it's initialized, we can't use fromEvent.
        // The player is not initialized fully until the ready is called.
        return new rxjs__WEBPACK_IMPORTED_MODULE_2__["Observable"](emitter => {
            let aborted = false;
            let resolved = false;
            const onReady = (event) => {
                resolved = true;
                if (!aborted) {
                    event.target.removeEventListener('onReady', onReady);
                    emitter.next(event.target);
                }
            };
            player.addEventListener('onReady', onReady);
            return () => {
                aborted = true;
                if (!resolved) {
                    onAbort(player);
                }
            };
        }).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["take"])(1), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["startWith"])(undefined));
    });
}
/** Create an observable for the player based on the given options. */
function createPlayerObservable(youtubeContainer, videoIdObs, iframeApiAvailableObs, widthObs, heightObs, playerVarsObs, ngZone) {
    const playerOptions = Object(rxjs__WEBPACK_IMPORTED_MODULE_2__["combineLatest"])([videoIdObs, playerVarsObs]).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["withLatestFrom"])(Object(rxjs__WEBPACK_IMPORTED_MODULE_2__["combineLatest"])([widthObs, heightObs])), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["map"])(([constructorOptions, sizeOptions]) => {
        const [videoId, playerVars] = constructorOptions;
        const [width, height] = sizeOptions;
        return videoId ? ({ videoId, playerVars, width, height }) : undefined;
    }));
    return Object(rxjs__WEBPACK_IMPORTED_MODULE_2__["combineLatest"])([youtubeContainer, playerOptions, Object(rxjs__WEBPACK_IMPORTED_MODULE_2__["of"])(ngZone)])
        .pipe(skipUntilRememberLatest(iframeApiAvailableObs), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["scan"])(syncPlayerState, undefined), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["distinctUntilChanged"])());
}
/** Skips the given observable until the other observable emits true, then emit the latest. */
function skipUntilRememberLatest(notifier) {
    return Object(rxjs__WEBPACK_IMPORTED_MODULE_2__["pipe"])(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["combineLatest"])(notifier), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["skipWhile"])(([_, doneSkipping]) => !doneSkipping), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["map"])(([value]) => value));
}
/** Destroy the player if there are no options, or create the player if there are options. */
function syncPlayerState(player, [container, videoOptions, ngZone]) {
    if (player && videoOptions && player.playerVars !== videoOptions.playerVars) {
        // The player needs to be recreated if the playerVars are different.
        player.destroy();
    }
    else if (!videoOptions) {
        if (player) {
            // Destroy the player if the videoId was removed.
            player.destroy();
        }
        return;
    }
    else if (player) {
        return player;
    }
    // Important! We need to create the Player object outside of the `NgZone`, because it kicks
    // off a 250ms setInterval which will continually trigger change detection if we don't.
    const newPlayer = ngZone.runOutsideAngular(() => new YT.Player(container, videoOptions));
    newPlayer.videoId = videoOptions.videoId;
    newPlayer.playerVars = videoOptions.playerVars;
    return newPlayer;
}
/**
 * Call cueVideoById if the videoId changes, or when start or end seconds change. cueVideoById will
 * change the loaded video id to the given videoId, and set the start and end times to the given
 * start/end seconds.
 */
function bindCueVideoCall(playerObs, videoIdObs, startSecondsObs, endSecondsObs, suggestedQualityObs, destroyed) {
    const cueOptionsObs = Object(rxjs__WEBPACK_IMPORTED_MODULE_2__["combineLatest"])([startSecondsObs, endSecondsObs])
        .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["map"])(([startSeconds, endSeconds]) => ({ startSeconds, endSeconds })));
    // Only respond to changes in cue options if the player is not running.
    const filteredCueOptions = cueOptionsObs
        .pipe(filterOnOther(playerObs, player => !!player && !hasPlayerStarted(player)));
    // If the video id changed, there's no reason to run 'cue' unless the player
    // was initialized with a different video id.
    const changedVideoId = videoIdObs
        .pipe(filterOnOther(playerObs, (player, videoId) => !!player && player.videoId !== videoId));
    // If the player changed, there's no reason to run 'cue' unless there are cue options.
    const changedPlayer = playerObs.pipe(filterOnOther(Object(rxjs__WEBPACK_IMPORTED_MODULE_2__["combineLatest"])([videoIdObs, cueOptionsObs]), ([videoId, cueOptions], player) => !!player &&
        (videoId != player.videoId || !!cueOptions.startSeconds || !!cueOptions.endSeconds)));
    Object(rxjs__WEBPACK_IMPORTED_MODULE_2__["merge"])(changedPlayer, changedVideoId, filteredCueOptions)
        .pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["withLatestFrom"])(Object(rxjs__WEBPACK_IMPORTED_MODULE_2__["combineLatest"])([playerObs, videoIdObs, cueOptionsObs, suggestedQualityObs])), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["map"])(([_, values]) => values), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["takeUntil"])(destroyed))
        .subscribe(([player, videoId, cueOptions, suggestedQuality]) => {
        if (!videoId || !player) {
            return;
        }
        player.videoId = videoId;
        player.cueVideoById(Object.assign({ videoId,
            suggestedQuality }, cueOptions));
    });
}
function hasPlayerStarted(player) {
    const state = player.getPlayerState();
    return state !== -1 /* UNSTARTED */ && state !== 5 /* CUED */;
}
function playerIsReady(player) {
    return 'getPlayerStatus' in player;
}
/** Combines the two observables temporarily for the filter function. */
function filterOnOther(otherObs, filterFn) {
    return Object(rxjs__WEBPACK_IMPORTED_MODULE_2__["pipe"])(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["withLatestFrom"])(otherObs), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["filter"])(([value, other]) => filterFn(other, value)), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["map"])(([value]) => value));
}

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
const COMPONENTS = [YouTubePlayer];
class YouTubePlayerModule {
}
YouTubePlayerModule.decorators = [
    { type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"], args: [{
                declarations: COMPONENTS,
                exports: COMPONENTS,
            },] }
];

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

/**
 * Generated bundle index. Do not edit.
 */


//# sourceMappingURL=youtube-player.js.map


/***/ }),

/***/ "./node_modules/raw-loader/dist/cjs.js!./src/app/modules/charts/modules/packs/components/chart-details/chart-details.component.html":
/*!******************************************************************************************************************************************!*\
  !*** ./node_modules/raw-loader/dist/cjs.js!./src/app/modules/charts/modules/packs/components/chart-details/chart-details.component.html ***!
  \******************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("<div class=\"app-creating-lessons\">\n\n\n  <mat-tab-group animationDuration=\"0ms\">\n\n    <mat-tab #defaultTab  [label]=\"'Charts' | translate\">\n\n      <div class=\"app-admin__type-title\" *ngIf=\"charts3max.length\">\n        3 - max\n      </div>\n      <mat-accordion>\n\n        <mat-expansion-panel class=\"app-admin__accordion\" *ngFor=\"let chart of charts3max\">\n\n        <mat-expansion-panel-header>\n          <mat-panel-title>\n            {{chart.title}}\n          </mat-panel-title>\n        </mat-expansion-panel-header>\n\n        <mat-divider></mat-divider>\n\n        <ng-container *ngFor=\"let lesson of chart.charts\">\n\n          <div class=\"app-creating-lessons__chart\" (click)=\"openLesson(lesson)\">\n\n            <mat-icon class=\"app-mat-icon_size_5 app-chart-details__delete-button\"\n                      *ngIf=\"isEditable\"\n                      matTooltip=\"Delete Lesson\"\n                      (click)=\"deleteLesson($event, lesson, chart, false)\">delete_forever</mat-icon>\n\n            <mat-icon class=\"app-mat-icon_size_5 app-chart-details__delete-button\"\n                      *ngIf=\"isEditable\"\n                      matTooltip=\"Copy Lesson\"\n                      (click)=\"copyLesson($event, lesson)\">description</mat-icon>\n\n            vs {{lesson.opponentsType.type | oppsTitle:chart.title}}\n\n            <div class=\"app-chart-details__pfr\" *ngIf=\"showPFR(lesson.pfr)\">\n              PFR:\n              <ng-container *ngIf=\"getPFRLabels(lesson.pfr).length\">\n                <ng-container *ngFor=\"let label of getPFRLabels(lesson.pfr); let last = last\">\n                  <span>{{ label }}</span><span *ngIf=\"!last\">/</span>\n                </ng-container>\n              </ng-container>\n            </div>\n\n          </div>\n\n          <mat-divider></mat-divider>\n\n        </ng-container>\n\n      </mat-expansion-panel>\n\n      </mat-accordion>\n\n      <div class=\"app-admin__type-title\" *ngIf=\"chartsHu.length\">\n        HU\n      </div>\n      <mat-accordion>\n\n        <mat-expansion-panel class=\"app-admin__accordion\" *ngFor=\"let chart of chartsHu\">\n\n          <mat-expansion-panel-header>\n            <mat-panel-title>\n              {{chart.title}}\n            </mat-panel-title>\n          </mat-expansion-panel-header>\n\n          <mat-divider></mat-divider>\n\n          <ng-container *ngFor=\"let lesson of chart.charts\">\n\n            <div class=\"app-creating-lessons__chart\" (click)=\"openLesson(lesson)\">\n\n              <mat-icon class=\"app-mat-icon_size_5 app-chart-details__delete-button\"\n                        *ngIf=\"isEditable\"\n                        matTooltip=\"Delete Lesson\"\n                        (click)=\"deleteLesson($event, lesson, chart, true)\">delete_forever</mat-icon>\n\n              <mat-icon class=\"app-mat-icon_size_5 app-chart-details__delete-button\"\n                        *ngIf=\"isEditable\"\n                        matTooltip=\"Copy Lesson\"\n                        (click)=\"copyLesson($event, lesson)\">description</mat-icon>\n\n              vs {{lesson.opponentsType.type}}\n\n              <div class=\"app-chart-details__pfr\" *ngIf=\"showPFR(lesson.pfr)\">\n                PFR:\n                <ng-container *ngIf=\"getPFRLabels(lesson.pfr).length\">\n                  <ng-container *ngFor=\"let label of getPFRLabels(lesson.pfr); let last = last\">\n                    <span>{{ label }}</span><span *ngIf=\"!last\">/</span>\n                  </ng-container>\n                </ng-container>\n              </div>\n\n            </div>\n\n            <mat-divider></mat-divider>\n\n          </ng-container>\n\n        </mat-expansion-panel>\n\n      </mat-accordion>\n\n\n    </mat-tab>\n\n    <mat-tab #mixedTab [label]=\"'Course' | translate\">\n\n      <div class=\"app-chart-details__title\">\n        <div class=\"app-admin__type-title\">\n          Chapters\n        </div>\n\n        <div class=\"app-chart-details__menu-title\">\n          <ng-container>\n\n            <button mat-icon-button [matMenuTriggerFor]=\"menu\" *ngIf=\"isEditable\">\n\n              <mat-icon class=\"app-mat-icon_size_7\">more_vert</mat-icon>\n\n            </button>\n\n            <mat-menu #menu=\"matMenu\">\n              <button mat-menu-item (click)=\"openDialogChapterCreate()\">\n                <mat-icon>edit</mat-icon>\n                <span>Manage chapters</span>\n              </button>\n            </mat-menu>\n\n          </ng-container>\n        </div>\n      </div>\n\n      <mat-accordion>\n\n        <mat-expansion-panel class=\"app-admin__accordion\" *ngFor=\"let chapter of chapters; let i = index\">\n\n          <mat-expansion-panel-header>\n            <mat-panel-title>\n              Chapter {{i + 1}} {{chapter.title}}\n            </mat-panel-title>\n\n          </mat-expansion-panel-header>\n\n          <mat-divider></mat-divider>\n\n          <ng-container *ngFor=\"let lesson of chapter.mixTasks\">\n\n            <div class=\"app-chart-details__item\" (click)=\"openMixedLesson(lesson.id)\">\n\n              <mat-list-item class=\"app-creating-lessons__chart\">\n\n                {{lesson.title}}\n\n              </mat-list-item>\n\n              <div class=\"app-chart-details__menu-item\">\n                <ng-container>\n\n                  <button mat-icon-button [matMenuTriggerFor]=\"menu\" (click)=\"$event.stopPropagation()\">\n\n                    <mat-icon class=\"app-mat-icon_size_7\">more_vert</mat-icon>\n\n                  </button>\n\n                  <mat-menu #menu=\"matMenu\">\n                    <button mat-menu-item [routerLink]=\"['edit-mixed-lesson', lesson.id]\">\n                      <mat-icon>edit</mat-icon>\n                      <span>Edit</span>\n                    </button>\n                    <button mat-menu-item *ngIf=\"isEditable\"\n                            (click)=\"deleteMixedLesson($event, lesson, i)\">\n                      <mat-icon>delete_forever</mat-icon>\n                      <span>Delete</span>\n                    </button>\n                  </mat-menu>\n\n                </ng-container>\n              </div>\n\n            </div>\n\n            <mat-divider></mat-divider>\n\n          </ng-container>\n\n        </mat-expansion-panel>\n\n      </mat-accordion>\n\n    </mat-tab>\n\n  </mat-tab-group>\n\n</div>\n\n<ng-template #headerTitleTemplate>\n\n  <app-breadcrumb [title]=\"packTitle\"></app-breadcrumb>\n\n</ng-template>\n\n<ng-template #headerActionsTemplate>\n\n  <button matTooltip=\"Flash\"\n          *ngIf=\"!isTrial\"\n          mat-icon-button class=\"app-creating-lessons__button\" (click)=\"openFlashOptions()\">\n\n    <mat-icon class=\"app-mat-icon_size_7\">flash_on</mat-icon>\n\n  </button>\n\n  <button matTooltip=\"Movie\" *ngIf=\"chartUuid === defaultDataService.getSfPackUuid()\n                            || chartUuid === defaultDataService.getSpCoursePackUuid()\n                            || chartUuid === defaultDataService.getSpPackUuid()\"\n          mat-icon-button class=\"app-creating-lessons__button\" (click)=\"openYoutubeDialog()\">\n\n    <mat-icon class=\"app-mat-icon_size_7\">movie</mat-icon>\n\n  </button>\n\n  <div class=\"app-lesson__sidebar hidden-ts-down\" *ngIf=\"isEditable\">\n\n    <button *ngIf=\"defaultTab.isActive\" mat-flat-button class=\"app-creating-lessons__button btn-white\" [routerLink]=\"['new-lesson']\">\n\n      {{'Create new lesson' | translate}}\n\n    </button>\n\n    <button *ngIf=\"mixedTab.isActive\" mat-flat-button class=\"app-creating-lessons__button btn-white\" [routerLink]=\"['new-mixed-lesson']\">\n\n      {{'Create new mixed lesson' | translate}}\n\n    </button>\n\n  </div>\n\n  <div class=\"app-lesson__sidebar hidden-ts-up\" *ngIf=\"isEditable\">\n\n\n    <button *ngIf=\"defaultTab.isActive\" matTooltip=\"Create new lesson\"\n            mat-icon-button class=\"app-creating-lessons__button\" [routerLink]=\"['new-lesson']\">\n\n      <mat-icon class=\"app-mat-icon_size_7\">create_new_folder</mat-icon>\n\n    </button>\n\n    <button *ngIf=\"mixedTab.isActive\" matTooltip=\"Create new mixed lesson\"\n            mat-icon-button class=\"app-creating-lessons__button\" [routerLink]=\"['new-mixed-lesson']\">\n\n      <mat-icon class=\"app-mat-icon_size_7\">create_new_folder</mat-icon>\n\n    </button>\n\n  </div>\n\n</ng-template>\n");

/***/ }),

/***/ "./node_modules/raw-loader/dist/cjs.js!./src/app/modules/charts/modules/packs/components/creating-lesson/creating-lesson.component.html":
/*!**********************************************************************************************************************************************!*\
  !*** ./node_modules/raw-loader/dist/cjs.js!./src/app/modules/charts/modules/packs/components/creating-lesson/creating-lesson.component.html ***!
  \**********************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("<ng-container *ngIf=\"isState\">\n  <mat-spinner></mat-spinner>\n  <div class=\"app-overlay\"></div>\n</ng-container>\n\n<div class=\"app-creating-lessons__container\">\n\n  <form class=\"app-creating-lessons-form\" [formGroup]=\"formGroup\">\n\n    <div class=\"app-creating-lessons-form__row\">\n\n      <mat-form-field class=\"app-creating-lessons-form__field\">\n\n        <mat-label>{{'Game type' | translate}}</mat-label>\n\n        <mat-select\n            [compareWith]=\"compareGameTypesFn\"\n            [formControlName]=\"'gameTypesCtrl'\">\n\n          <ng-container *ngIf=\"gameTypes$ | async as gameTypes\">\n\n            <mat-option *ngFor=\"let gameType of gameTypes; trackBy: trackGameTypesFn\" [value]=\"gameType\">\n\n              {{gameType.title}}\n\n            </mat-option>\n\n          </ng-container>\n\n        </mat-select>\n\n      </mat-form-field>\n\n      <mat-form-field class=\"app-creating-lessons-form__field\">\n\n        <mat-label>{{'Position' | translate}}</mat-label>\n\n        <mat-select\n            [compareWith]=\"comparePositionsFn\"\n            [formControlName]=\"'positionsCtrl'\">\n\n          <ng-container *ngIf=\"positions$ | async as positions\">\n\n            <mat-option *ngFor=\"let position of positions ; trackBy: trackPositionsFn\" [value]=\"position\">\n\n              {{position.title}}\n\n            </mat-option>\n\n          </ng-container>\n\n        </mat-select>\n\n      </mat-form-field>\n\n      <mat-form-field class=\"app-creating-lessons-form__field\">\n\n        <mat-label>{{'Action' | translate}}</mat-label>\n\n        <mat-select\n            [compareWith]=\"compareActionsFn\"\n            [formControlName]=\"'actionsCtrl'\">\n\n          <ng-container *ngIf=\"actions$ | async as actions\">\n\n            <mat-option *ngFor=\"let action of actions; trackBy: trackActionsFn\" [value]=\"action\">\n\n              {{action.title}}\n\n            </mat-option>\n\n          </ng-container>\n\n        </mat-select>\n\n      </mat-form-field>\n\n      <mat-form-field class=\"app-creating-lessons-form__field\">\n\n        <mat-label>{{'Opponents' | translate}}</mat-label>\n\n        <mat-select\n            [compareWith]=\"compareOpponentsFn\"\n            [formControlName]=\"'opponentsCtrl'\">\n\n          <ng-container *ngIf=\"opponentTypes$ | async as opponentTypes\">\n\n            <mat-option *ngFor=\"let opponentType of opponentTypes; trackBy: trackActionsFn\" [value]=\"opponentType\">\n\n              {{opponentType.type | oppsTitle:currentAction}}\n\n            </mat-option>\n\n          </ng-container>\n\n        </mat-select>\n\n      </mat-form-field>\n    </div>\n\n    <span class=\"app-creating-lessons-form-title\">PFR:</span>\n\n    <div class=\"app-creating-lessons-form__row-2\">\n      <ng-container *ngFor=\"let pfr of pfr$ | async\">\n        <span class=\"app-creating-lessons-form-label\">{{ pfr.position | translate }}:</span>\n        <mat-form-field class=\"app-creating-lessons-form__field_input\">\n          <mat-label>{{ 'from' | translate }}</mat-label>\n          <input matInput type=\"number\" autocomplete=\"off\" [formControlName]=\"pfr.position.toLowerCase() + 'StartPfrCtrl'\">\n        </mat-form-field>\n        <mat-form-field class=\"app-creating-lessons-form__field_input\">\n          <mat-label>{{ 'to' | translate }}</mat-label>\n          <input matInput type=\"number\" autocomplete=\"off\" [formControlName]=\"pfr.position.toLowerCase() + 'FinishPfrCtrl'\">\n        </mat-form-field>\n      </ng-container>\n    </div>\n\n  </form>\n\n  <div class=\"app-creating-lessons-tabs\">\n\n    <div class=\"app-creating-lessons__description\" *ngIf=\"isDescriptionShown\">\n\n    <textarea class=\"app-creating-lessons__description\"\n              rows=\"7\"\n              [(ngModel)]=\"description\">\n\n    </textarea>\n\n    </div>\n\n    <button mat-raised-button color=\"primary\" (click)=\"openRangesSettingDialog()\">\n      {{'Setup ranges' | translate}}\n    </button>\n\n    <button mat-raised-button class=\"app-creating-lessons__description-button\" color=\"primary\" (click)=\"showDescription()\">\n      {{'Description' | translate}}\n    </button>\n\n    <mat-tab-group animationDuration=\"0ms\">\n\n      <mat-tab *ngFor=\"let range of stackRanges; let first = first; let i = index\" [label]=\"generateRangeLabel(range.rangeMin, range.rangeMax)\">\n\n        <app-chart [combinations]=\"range.charts[0].combinations\"\n                   [answers]=\"range.charts[0].answers\"\n                   [secondAction]=\"range.charts[0].secondAction\"\n                   [actionTitle]=\"'First action'\"></app-chart>\n\n        <div class=\"app-creating-lesson__actions\">\n\n          <button mat-raised-button color=\"primary\" class=\"app-creating-lesson__second-action-button\" (click)=\"openAddSecondActionDialog(range)\">\n            {{'Add second action' | translate}}\n          </button>\n\n          <div class=\"app-creating-lesson__hands_filter\">\n\n            <div class=\"app-creating-lesson__filter-value\">\n              <span class=\"app-creating-lesson__filter-value_bordered\">{{'Easy'}}</span>\n\n              <button mat-icon-button color=\"primary\" (click)=\"openHandsFilter(range, 'Easy mode range', range.easy, 0)\">\n                <mat-icon>edit</mat-icon>\n              </button>\n            </div>\n\n          </div>\n\n          <div class=\"app-creating-lesson__hands_filter\">\n\n            <div class=\"app-creating-lesson__filter-value\">\n              <span class=\"app-creating-lesson__filter-value_bordered\">{{'Normal'}}</span>\n\n              <button mat-icon-button color=\"primary\" (click)=\"openHandsFilter(range, 'Normal mode range', range.normal, 1)\">\n                <mat-icon>edit</mat-icon>\n              </button>\n            </div>\n\n          </div>\n\n          <div class=\"app-creating-lesson__hands_filter\">\n\n            <div class=\"app-creating-lesson__filter-value\">\n              <span class=\"app-creating-lesson__filter-value_bordered\">{{'Hard'}}</span>\n\n              <button mat-icon-button color=\"primary\" (click)=\"openHandsFilter(range, 'Hard mode range', range.hard, 2)\">\n                <mat-icon>edit</mat-icon>\n              </button>\n            </div>\n\n          </div>\n\n        </div>\n\n        <mat-tab-group animationDuration=\"0ms\">\n\n          <ng-container *ngFor=\"let chart of range.charts; let i = index\">\n\n            <mat-tab *ngIf=\"i !== 0\" [label]=\"getSecondActionTitle(chart.secondActionFactor, chart.secondAction)\" >\n\n              <app-chart [combinations]=\"chart.combinations\"\n                         [actionTitle]=\"getSecondActionTitle(chart.secondActionFactor, chart.secondAction)\"\n                         [parentCombinations]=\"range.charts[0].combinations\"\n                         [canBeDeleted]=\"true\"\n                         (chartDeleted)=\"onSecondActionDeleted(range, i)\"\n                         [secondAction]=\"chart.secondAction\"\n                         [answers]=\"chart.answers\"></app-chart>\n\n            </mat-tab>\n\n          </ng-container>\n\n        </mat-tab-group>\n\n      </mat-tab>\n\n    </mat-tab-group>\n\n  </div>\n\n</div>\n\n\n\n\n<ng-template #headerTitleTemplate>\n\n  <app-breadcrumb></app-breadcrumb>\n\n</ng-template>\n\n<ng-template #headerActionsTemplate>\n\n  <div class=\"app-lesson__sidebar\">\n\n    <button mat-raised-button color=\"primary\" [disabled]=\"this.formGroup.invalid\" (click)=\"onSubmitButtonClick()\">\n\n      {{'Create lesson' | translate}}\n\n    </button>\n\n  </div>\n\n</ng-template>\n");

/***/ }),

/***/ "./node_modules/raw-loader/dist/cjs.js!./src/app/modules/charts/modules/packs/components/creating-mixed-lesson/creating-mixed-lesson.component.html":
/*!**********************************************************************************************************************************************************!*\
  !*** ./node_modules/raw-loader/dist/cjs.js!./src/app/modules/charts/modules/packs/components/creating-mixed-lesson/creating-mixed-lesson.component.html ***!
  \**********************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("<div class=\"app-creating-lessons__container\">\n\n  <form [formGroup]=\"formGroup\" class=\"app-creating-lessons-form\">\n\n    <mat-form-field class=\"app-creating-lessons-form__field app-creating-lessons-form__field_mt-10\">\n\n      <mat-label>{{'Select chapter' | translate}}</mat-label>\n\n      <mat-select\n        [compareWith]=\"compareLessonsFn\"\n        [formControlName]=\"'chapterCtrl'\">\n\n        <ng-container *ngIf=\"chapters$ | async as chapters\">\n\n          <mat-option *ngFor=\"let chapter of chapters; trackBy: trackLessonsFn\" [value]=\"chapter\">\n\n            {{chapter.title}}\n\n          </mat-option>\n\n        </ng-container>\n\n      </mat-select>\n\n    </mat-form-field>\n\n    <mat-form-field class=\"app-creating-lessons-form__field\">\n\n      <mat-label>{{'Title' | translate}}</mat-label>\n\n      <input matInput autocomplete=\"off\" [formControlName]=\"'titleCtrl'\">\n\n    </mat-form-field>\n\n    <mat-form-field class=\"app-creating-lessons-form__field app-creating-lessons-form__field_mt-10\">\n\n      <mat-label>{{'Select lessons' | translate}}</mat-label>\n\n      <mat-select\n        [compareWith]=\"compareLessonsFn\"\n        [formControlName]=\"'lessonsCtrl'\" multiple>\n\n        <mat-select-trigger>\n\n          <span *ngIf=\"formGroup.get('lessonsCtrl').value && formGroup.get('lessonsCtrl').value.length > 0\">\n           {{formGroup.get('lessonsCtrl').value.length}} {{'selected' | translate}}\n          </span>\n\n        </mat-select-trigger>\n\n        <ng-container *ngIf=\"lessons$ | async as lessons\">\n\n          <mat-option *ngFor=\"let lesson of lessons; trackBy: trackLessonsFn\" [value]=\"lesson\">\n\n            {{lesson.title}}\n\n          </mat-option>\n\n        </ng-container>\n\n      </mat-select>\n\n    </mat-form-field>\n\n    <div>\n\n      <app-radio-button\n                        [label]=\"'Game mode' | translate\"\n                        [items]=\"gameModes\"\n                        [control]=\"gameModeCtrl\">\n      </app-radio-button>\n\n      <div class=\"app-custom-range app-creating-lessons-form__custom-range\">\n\n        <label  class=\"app-custom-range__label\">{{'Stack Size' | translate}}</label>\n\n        <div class=\"app-custom-range__selects\">\n\n          <div class=\"app-custom-range__min\">\n\n            <div class=\"app-custom-range__title\">min</div>\n            <mat-form-field class=\"app-custom-range__select\">\n\n              <mat-select (valueChange)=\"onChangedMinRange($event)\"\n                          [formControl]=\"customRangeMinCtrl\" [compareWith]=\"compareIndex\">\n\n                <mat-option *ngFor=\"let item of customRangeMin;\n              trackBy: trackChartGroupFn\" [value]=\"item\" [disabled]=\"item > customRangeMaxCtrl.value\">\n\n                  {{item}}\n\n                </mat-option>\n\n              </mat-select>\n\n            </mat-form-field>\n          </div>\n          <div class=\"app-custom-range__max\">\n            <div class=\"app-custom-range__title\">max</div>\n            <mat-form-field class=\"app-custom-range__select\">\n\n              <mat-select (valueChange)=\"onChangedMaxRange($event)\"\n                          [formControl]=\"customRangeMaxCtrl\" [compareWith]=\"compareIndex\">\n\n                <mat-option *ngFor=\"let item of customRangeMax;\n              trackBy: trackChartGroupFn\" [value]=\"item\" [disabled]=\"item < customRangeMinCtrl.value\">\n\n                  {{item}}\n\n                </mat-option>\n\n              </mat-select>\n\n            </mat-form-field>\n          </div>\n\n        </div>\n\n      </div>\n\n    </div>\n\n    <mat-form-field class=\"app-creating-lessons-form__field app-creating-lessons-form__field_mt-16\">\n\n      <mat-label>{{'Count hands' | translate}}</mat-label>\n\n      <input matInput autocomplete=\"off\" type=\"number\" [formControlName]=\"'countHandsCtrl'\">\n\n    </mat-form-field>\n\n    <mat-form-field class=\"app-creating-lessons-form__field\">\n\n      <mat-label>\n        <mat-icon>star_rate</mat-icon>\n      </mat-label>\n\n      <input matInput autocomplete=\"off\" type=\"number\" [formControlName]=\"'star1Ctrl'\">\n\n    </mat-form-field>\n\n    <mat-form-field class=\"app-creating-lessons-form__field\">\n\n      <mat-label>\n        <mat-icon>star_rate</mat-icon>\n        <mat-icon>star_rate</mat-icon>\n      </mat-label>\n\n      <input matInput autocomplete=\"off\"\n             type=\"number\" [formControlName]=\"'star2Ctrl'\">\n\n    </mat-form-field>\n\n    <mat-form-field class=\"app-creating-lessons-form__field\">\n\n      <mat-label>\n        <mat-icon>star_rate</mat-icon>\n        <mat-icon>star_rate</mat-icon>\n        <mat-icon>star_rate</mat-icon>\n      </mat-label>\n\n      <input matInput autocomplete=\"off\" type=\"number\" [formControlName]=\"'star3Ctrl'\">\n\n    </mat-form-field>\n\n  </form>\n\n  <div class=\"app-edit-mixed-lesson__list\">\n\n    <div class=\"app-edit-mixed-lesson__list-item\" *ngFor=\"let lesson of formGroup.get('lessonsCtrl').value\">\n\n      {{lesson.title}}\n\n    </div>\n\n  </div>\n\n  <button mat-raised-button color=\"primary\" [disabled]=\"this.formGroup.invalid\" (click)=\"onSubmitButtonClick()\">\n\n    {{'Create lesson' | translate}}\n\n  </button>\n\n</div>\n\n<ng-template #headerTitleTemplate>\n\n  <app-breadcrumb></app-breadcrumb>\n\n</ng-template>\n");

/***/ }),

/***/ "./node_modules/raw-loader/dist/cjs.js!./src/app/modules/charts/modules/packs/components/edit-lesson/edit-lesson.component.html":
/*!**************************************************************************************************************************************!*\
  !*** ./node_modules/raw-loader/dist/cjs.js!./src/app/modules/charts/modules/packs/components/edit-lesson/edit-lesson.component.html ***!
  \**************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("<ng-container *ngIf=\"isState\">\n  <mat-spinner></mat-spinner>\n  <div class=\"app-overlay\"></div>\n</ng-container>\n\n<div class=\"app-edit-lesson\">\n\n  <div class=\"app-edit-lesson__description\" *ngIf=\"isDescriptionShown\">\n\n    <div class=\"app-edit-lesson__description app-edit-lesson__description_cursive\"\n         *ngIf=\"isRussianLanguage && !chart.isEditable\"\n         [innerHTML]=\"chart.description ? chart.description : 'No description'\">\n\n    </div>\n\n    <div class=\"app-edit-lesson__description app-edit-lesson__description_cursive\"\n         *ngIf=\"!isRussianLanguage && !chart.isEditable\"\n         [innerHTML]=\"chart.descriptionEn ? chart.descriptionEn : 'No description'\">\n\n    </div>\n\n    <textarea matInput class=\"app-edit-lesson__description\"\n              rows=\"7\"\n              *ngIf=\"isRussianLanguage && chart.isEditable\"\n              [(ngModel)]=\"chart.description\">\n\n    </textarea>\n\n      <textarea matInput class=\"app-edit-lesson__description\"\n                rows=\"7\"\n                *ngIf=\"!isRussianLanguage && chart.isEditable\"\n                [disabled]=\"!chart.isEditable\"\n                [(ngModel)]=\"chart.descriptionEn\">\n\n    </textarea>\n\n  </div>\n\n\n  <button mat-raised-button color=\"primary\" (click)=\"openRangesSettingDialog()\" *ngIf=\"chart.isEditable\">\n    {{'Setup ranges' | translate}}\n  </button>\n\n  <button mat-raised-button class=\"app-edit-lesson__description-button\" color=\"primary\" (click)=\"showDescription()\">\n    {{'Description' | translate}}\n  </button>\n\n  <form class=\"app-edit-lessons-form\" [formGroup]=\"pfrFormGroup\">\n    <div class=\"app-edit-lessons-form__row\">\n      <span class=\"app-edit-lessons-form-title\">PFR:</span>\n\n      <div class=\"app-edit-lessons-form__row-2\">\n        <ng-container *ngFor=\"let pfr of pfrlist\">\n          <span class=\"app-edit-lessons-form-label\">{{ pfr.position | translate }}:</span>\n          <mat-form-field class=\"app-edit-lessons-form__field_input\">\n            <mat-label>{{ 'from' | translate }}</mat-label>\n            <input matInput type=\"number\" autocomplete=\"off\" [formControlName]=\"pfr.position.toLowerCase() + 'StartPfrCtrl'\">\n          </mat-form-field>\n          <mat-form-field class=\"app-edit-lessons-form__field_input\">\n            <mat-label>{{ 'to' | translate }}</mat-label>\n            <input matInput type=\"number\" autocomplete=\"off\" [formControlName]=\"pfr.position.toLowerCase() + 'FinishPfrCtrl'\">\n          </mat-form-field>\n        </ng-container>\n      </div>\n    </div>\n  </form>\n\n  <mat-tab-group animationDuration=\"0ms\">\n\n  <mat-tab *ngFor=\"let range of chart.stackRanges; let first = first; let i = index\" [label]=\"range.rangeMin + '-' + range.rangeMax\">\n\n    <app-chart [combinations]=\"range.charts[0].combinations\"\n               [answers]=\"range.charts[0].answers\"\n               [isDisabled]=\"!chart.isEditable\"\n               [secondAction]=\"range.charts[0].secondAction\"\n               [actionTitle]=\"'First action'\"></app-chart>\n\n    <div class=\"app-creating-lesson__actions\" *ngIf=\"chart.isEditable\">\n\n      <button mat-raised-button color=\"primary\" class=\"app-creating-lesson__second-action-button\" (click)=\"openAddSecondActionDialog(range)\">\n        {{'Add second action' | translate}}\n      </button>\n\n      <div class=\"app-creating-lesson__hands_filter\">\n\n        <div class=\"app-creating-lesson__filter-value\">\n          <span class=\"app-creating-lesson__filter-value_bordered\">{{'Easy'}}</span>\n\n          <button mat-icon-button color=\"primary\" (click)=\"openHandsFilter(range, 'Easy mode range', range.easy, 0)\">\n            <mat-icon>edit</mat-icon>\n          </button>\n        </div>\n\n      </div>\n\n      <div class=\"app-creating-lesson__hands_filter\">\n\n        <div class=\"app-creating-lesson__filter-value\">\n          <span class=\"app-creating-lesson__filter-value_bordered\">{{'Normal'}}</span>\n\n          <button mat-icon-button color=\"primary\" (click)=\"openHandsFilter(range, 'Normal mode range', range.normal, 1)\">\n            <mat-icon>edit</mat-icon>\n          </button>\n        </div>\n\n      </div>\n\n      <div class=\"app-creating-lesson__hands_filter\">\n\n        <div class=\"app-creating-lesson__filter-value\">\n          <span class=\"app-creating-lesson__filter-value_bordered\">{{'Hard'}}</span>\n\n          <button mat-icon-button color=\"primary\" (click)=\"openHandsFilter(range, 'Hard mode range', range.hard, 2)\">\n            <mat-icon>edit</mat-icon>\n          </button>\n        </div>\n\n      </div>\n\n    </div>\n\n    <mat-tab-group animationDuration=\"0ms\">\n\n      <ng-container *ngFor=\"let rangeChart of range.charts; let i = index\">\n\n        <mat-tab *ngIf=\"i !== 0\" [label]=\"getSecondActionTitle(rangeChart.secondActionFactor, rangeChart.secondAction)\" >\n\n          <app-chart [combinations]=\"rangeChart.combinations\"\n                     [actionTitle]=\"getSecondActionTitle(rangeChart.secondActionFactor, rangeChart.secondAction)\"\n                     [parentCombinations]=\"range.charts[0].combinations\"\n                     [isDisabled]=\"!chart.isEditable\"\n                     [canBeDeleted]=\"true\"\n                     (chartDeleted)=\"onSecondActionDeleted(range, i)\"\n                     [secondAction]=\"rangeChart.secondAction\"\n                     [answers]=\"rangeChart.answers\"></app-chart>\n\n        </mat-tab>\n\n      </ng-container>\n\n  </mat-tab-group>\n\n  </mat-tab>\n\n</mat-tab-group>\n\n</div>\n\n\n<ng-template #headerTitleTemplate>\n\n  <app-breadcrumb [title]=\"chart.title\"></app-breadcrumb>\n\n</ng-template>\n\n<ng-template #headerActionsTemplate>\n\n  <div class=\"app-lesson__sidebar\">\n\n    <button mat-raised-button color=\"primary\" (click)=\"onSaveButtonClick()\" *ngIf=\"chart.isEditable\">{{'Save' | translate}}</button>\n\n\n  </div>\n\n</ng-template>\n");

/***/ }),

/***/ "./node_modules/raw-loader/dist/cjs.js!./src/app/modules/charts/modules/packs/components/edit-mixed-lesson/edit-mixed-lesson.component.html":
/*!**************************************************************************************************************************************************!*\
  !*** ./node_modules/raw-loader/dist/cjs.js!./src/app/modules/charts/modules/packs/components/edit-mixed-lesson/edit-mixed-lesson.component.html ***!
  \**************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("<div class=\"app-creating-lessons__container\">\n\n  <form [formGroup]=\"formGroup\" class=\"app-creating-lessons-form\">\n\n    <mat-form-field class=\"app-creating-lessons-form__field app-creating-lessons-form__field_mt-10\">\n\n      <mat-label>{{'Select chapter' | translate}}</mat-label>\n\n      <mat-select\n        [compareWith]=\"compareLessonsFn\"\n        [formControlName]=\"'chapterCtrl'\">\n\n        <ng-container *ngIf=\"chapters$ | async as chapters\">\n\n          <mat-option *ngFor=\"let chapter of chapters; trackBy: trackLessonsFn\" [value]=\"chapter\">\n\n            {{chapter.title}}\n\n          </mat-option>\n\n        </ng-container>\n\n      </mat-select>\n\n    </mat-form-field>\n\n    <mat-form-field class=\"app-creating-lessons-form__field\">\n\n      <mat-label>{{'Title' | translate}}</mat-label>\n\n      <input matInput autocomplete=\"off\" [formControlName]=\"'titleCtrl'\">\n\n    </mat-form-field>\n\n    <mat-form-field class=\"app-creating-lessons-form__field app-creating-lessons-form__field_mt-10\">\n\n      <mat-label>{{'Select lessons' | translate}}</mat-label>\n\n      <mat-select\n        [compareWith]=\"compareLessonsFn\"\n        [formControlName]=\"'lessonsCtrl'\" multiple>\n        <mat-select-trigger>\n\n          <span *ngIf=\"formGroup.get('lessonsCtrl').value && formGroup.get('lessonsCtrl').value.length > 0\">\n           {{formGroup.get('lessonsCtrl').value.length}} lesson<span *ngIf=\"formGroup.get('lessonsCtrl').value.length > 1\">s</span>\n          </span>\n\n        </mat-select-trigger>\n\n        <ng-container *ngIf=\"lessons$ | async as lessons\">\n\n          <mat-option *ngFor=\"let lesson of lessons; trackBy: trackLessonsFn\" [value]=\"lesson\">\n\n            {{lesson.title}}\n\n          </mat-option>\n\n        </ng-container>\n\n      </mat-select>\n\n    </mat-form-field>\n\n    <div>\n\n      <app-radio-button\n        [label]=\"'Game mode' | translate\"\n        [items]=\"gameModes\"\n        [control]=\"gameModeCtrl\">\n      </app-radio-button>\n\n      <div class=\"app-custom-range app-creating-lessons-form__custom-range\">\n\n        <label  class=\"app-custom-range__label\">{{'Stack Size' | translate}}</label>\n\n        <div class=\"app-custom-range__selects\">\n\n          <div class=\"app-custom-range__min\">\n\n            <div class=\"app-custom-range__title\">min</div>\n            <mat-form-field class=\"app-custom-range__select\">\n\n              <mat-select (valueChange)=\"onChangedMinRange($event)\"\n                          [formControl]=\"customRangeMinCtrl\" [compareWith]=\"compareIndex\">\n\n                <mat-option *ngFor=\"let item of customRangeMin;\n              trackBy: trackChartGroupFn\" [value]=\"item\" [disabled]=\"item > customRangeMaxCtrl.value\">\n\n                  {{item}}\n\n                </mat-option>\n\n              </mat-select>\n\n            </mat-form-field>\n          </div>\n          <div class=\"app-custom-range__max\">\n            <div class=\"app-custom-range__title\">max</div>\n            <mat-form-field class=\"app-custom-range__select\">\n\n              <mat-select (valueChange)=\"onChangedMaxRange($event)\"\n                          [formControl]=\"customRangeMaxCtrl\" [compareWith]=\"compareIndex\">\n\n                <mat-option *ngFor=\"let item of customRangeMax;\n              trackBy: trackChartGroupFn\" [value]=\"item\" [disabled]=\"item < customRangeMinCtrl.value\">\n\n                  {{item}}\n\n                </mat-option>\n\n              </mat-select>\n\n            </mat-form-field>\n          </div>\n\n        </div>\n\n      </div>\n\n    </div>\n\n    <mat-form-field class=\"app-creating-lessons-form__field app-creating-lessons-form__field_mt-16\">\n\n      <mat-label>{{'Count hands' | translate}}</mat-label>\n\n      <input matInput autocomplete=\"off\" type=\"number\" [formControlName]=\"'countHandsCtrl'\">\n\n    </mat-form-field>\n\n    <mat-form-field class=\"app-creating-lessons-form__field\">\n\n      <mat-label>\n        <mat-icon>star_rate</mat-icon>\n      </mat-label>\n\n      <input matInput autocomplete=\"off\" type=\"number\" [formControlName]=\"'star1Ctrl'\">\n\n    </mat-form-field>\n\n    <mat-form-field class=\"app-creating-lessons-form__field\">\n\n      <mat-label>\n        <mat-icon>star_rate</mat-icon>\n        <mat-icon>star_rate</mat-icon>\n      </mat-label>\n\n      <input matInput autocomplete=\"off\"\n             type=\"number\" [formControlName]=\"'star2Ctrl'\">\n\n    </mat-form-field>\n\n    <mat-form-field class=\"app-creating-lessons-form__field\">\n\n      <mat-label>\n        <mat-icon>star_rate</mat-icon>\n        <mat-icon>star_rate</mat-icon>\n        <mat-icon>star_rate</mat-icon>\n      </mat-label>\n\n      <input matInput autocomplete=\"off\" type=\"number\" [formControlName]=\"'star3Ctrl'\">\n\n    </mat-form-field>\n\n  </form>\n\n  <div class=\"app-edit-mixed-lesson__list\">\n\n    <div class=\"app-edit-mixed-lesson__list-item\" *ngFor=\"let lesson of formGroup.get('lessonsCtrl').value\">\n\n      {{lesson.title}}\n\n    </div>\n\n  </div>\n\n  <button mat-raised-button color=\"primary\"\n          *ngIf=\"chart.isEditable\"\n          [disabled]=\"this.formGroup.invalid\"\n          (click)=\"onSubmitButtonClick()\">\n\n    Save lesson\n\n  </button>\n\n</div>\n\n<ng-template #headerTitleTemplate>\n\n  <app-breadcrumb [title]=\"chart?.title\"></app-breadcrumb>\n\n</ng-template>\n");

/***/ }),

/***/ "./node_modules/raw-loader/dist/cjs.js!./src/app/modules/charts/modules/packs/components/flash-dialog/flash-dialog.component.html":
/*!****************************************************************************************************************************************!*\
  !*** ./node_modules/raw-loader/dist/cjs.js!./src/app/modules/charts/modules/packs/components/flash-dialog/flash-dialog.component.html ***!
  \****************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("<div class=\"app-flash-dialog__header\">\n  <div>\n    <span class=\"app-flash-dialog__link\">Charts </span>\n    <span class=\"app-flash-dialog__link\">/ {{packTitle}}</span>\n  </div>\n  <button class=\"app-flash-dialog__button-close\" mat-icon-button mat-dialog-close>\n    <mat-icon class=\"app-mat-icon_size_8\">close</mat-icon>\n  </button>\n</div>\n\n<div class=\"app-flash-dialog\" *ngIf=\"!isResultAvailable\">\n\n  <div class=\"app-flash-dialog-chart\">\n\n    <app-chart-cell *ngFor=\"let combination of combinations; let index = index\"\n                    [combination]=\"combination\"\n                    (click)=\"onCombinationClick(index)\">\n\n    </app-chart-cell>\n\n  </div>\n\n  <div class=\"app-flash-dialog__stack-size\">\n    <span>{{'Stack Size' | translate}}</span>\n    <div>\n      <app-radio-button class=\"app-lessons__stackSize\"\n                        [items]=\"stackSizesShort\"\n                        [control]=\"stackSizeCtrl\">\n      </app-radio-button>\n    </div>\n    <div>\n      <app-radio-button class=\"app-lessons__stackSize\"\n                        [items]=\"stackSizesMedium\"\n                        [control]=\"stackSizeCtrl\">\n      </app-radio-button>\n    </div>\n    <div>\n      <app-radio-button class=\"app-lessons__stackSize\"\n                        [items]=\"stackSizesDeep\"\n                        [control]=\"stackSizeCtrl\">\n      </app-radio-button>\n    </div>\n  </div>\n\n</div>\n\n<div class=\"app-flash-dialog__result\" *ngIf=\"isResultAvailable\">\n\n  <div class=\"app-flash-dialog__result-hand\">\n    {{combinationTitle}}  {{stackSizeCtrl?.value?.id}}bb\n  </div>\n\n  <div class=\"app-flash-dialog-swiper hidden-ts-up\">\n\n    <swiper [config]=\"config\">\n      <div>\n\n        <ng-container *ngTemplateOutlet=\"reg\"></ng-container>\n\n      </div>\n\n      <div>\n        <ng-container *ngTemplateOutlet=\"fish\"></ng-container>\n      </div>\n    </swiper>\n\n  </div>\n\n  <div class=\"app-flash-dialog__result-wrap hidden-ts-down\">\n\n    <div class=\"app-flash-dialog__result-left\">\n\n      <ng-container *ngTemplateOutlet=\"reg\"></ng-container>\n\n    </div>\n\n    <div class=\"app-flash-dialog__result-right\">\n\n      <ng-container *ngTemplateOutlet=\"fish\"></ng-container>\n\n    </div>\n\n  </div>\n\n  <button mat-flat-button class=\"app-flash-dialog__change-button btn-white\"\n          (click)=\"changeHand()\">{{'Change hand' | translate}}</button>\n\n</div>\n\n<ng-template #reg>\n\n  <div class=\"app-flash-dialog__result-left\">\n\n    <div class=\"app-flash-dialog__3max-results\" *ngIf=\"prompter.reg.threeMax.length\">\n\n      <div class=\"app-flash-dialog__result-game-type\">\n        3-max(reg)\n      </div>\n\n      <ng-container *ngTemplateOutlet=\"answers; context: {gameType: prompter.reg.threeMax}\"></ng-container>\n\n    </div>\n\n    <div class=\"app-flash-dialog__3max-results\" *ngIf=\"prompter.reg.hu.length\">\n\n      <div class=\"app-flash-dialog__result-game-type\">\n        hu(reg)\n      </div>\n\n      <ng-container *ngTemplateOutlet=\"answers; context: {gameType: prompter.reg.hu}\"></ng-container>\n\n    </div>\n\n  </div>\n\n</ng-template>\n\n<ng-template #fish>\n\n  <div class=\"app-flash-dialog__result-right\">\n\n    <div class=\"app-flash-dialog__3max-results\" *ngIf=\"prompter.fish.threeMax.length\">\n\n      <div class=\"app-flash-dialog__result-game-type\">\n        3-max(fish)\n      </div>\n\n      <ng-container *ngTemplateOutlet=\"answers; context: {gameType: prompter.fish.threeMax}\"></ng-container>\n\n    </div>\n\n    <div class=\"app-flash-dialog__3max-results\" *ngIf=\"prompter.fish.hu.length\">\n\n      <div class=\"app-flash-dialog__result-game-type\">\n        hu(fish)\n      </div>\n\n      <ng-container *ngTemplateOutlet=\"answers; context: {gameType: prompter.fish.hu}\"></ng-container>\n\n    </div>\n\n  </div>\n\n</ng-template>\n\n<ng-template #answers let-gameType=\"gameType\">\n\n  <div class=\"app-flash-dialog__result-block\" *ngFor=\"let block of gameType\">\n\n    <div class=\"app-flash-dialog__result-block-row\" *ngFor=\"let row of block.rows; let i = index\">\n\n      <div class=\"app-flash-dialog__result-action app-flash-dialog__result-action-title_black\"\n           [ngClass]=\"{'app-flash-dialog__result-action_bordered': i === 0}\">\n        <ng-container *ngIf=\"i === 0 && block?.mainBlock?.parts\">\n          <div class=\"app-flash-dialog__result-action__zone\"\n               *ngFor=\"let part of block.mainBlock.parts\"\n               [ngStyle]=\"{backgroundColor: getColorByValue(part.answerType) }\"\n               [style.width]=\"part.weight + '%'\">\n\n            <span class=\"app-flash-dialog__result-action-factor\" *ngIf=\"part.factor\">x{{part.factor}}</span>\n\n          </div>\n        </ng-container>\n\n        <div class=\"app-flash-dialog__result-action-title\"\n             [ngClass]=\"{'app-flash-dialog__result-action-title_black': block?.mainBlock.parts && i === 0}\">\n          <span *ngIf=\"block.mainBlock.title && i === 0\">{{block.mainBlock.title}}</span>\n        </div>\n      </div>\n\n      <div class=\"app-flash-dialog__result-action\">\n        <div class=\"app-flash-dialog__result-action-title\">\n          {{row.title}}\n        </div>\n      </div>\n\n      <div class=\"app-flash-dialog__result-action app-flash-dialog__result-action_bordered\"\n           *ngFor=\"let action of row.actions\">\n\n\n        <div class=\"app-flash-dialog__result-action__zone\"\n             *ngFor=\"let part of action.parts\"\n             [ngStyle]=\"{backgroundColor: getColorByValue(part.answerType) }\"\n             [style.width]=\"part.weight + '%'\">\n\n          <span class=\"app-flash-dialog__result-action-factor\" *ngIf=\"part.factor\">x{{part.factor}}</span>\n\n        </div>\n\n        <div class=\"app-flash-dialog__result-action-title\"\n        [ngClass]=\"{'app-flash-dialog__result-action-title_black': !action.isEmpty}\">\n          {{action.title}}\n        </div>\n\n      </div>\n\n    </div>\n\n  </div>\n\n</ng-template>\n");

/***/ }),

/***/ "./node_modules/raw-loader/dist/cjs.js!./src/app/modules/charts/modules/packs/components/youtube-dialog/youtube-dialog.component.html":
/*!********************************************************************************************************************************************!*\
  !*** ./node_modules/raw-loader/dist/cjs.js!./src/app/modules/charts/modules/packs/components/youtube-dialog/youtube-dialog.component.html ***!
  \********************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("<youtube-player\n  #player\n  [videoId]=\"'aixPO7OLnH0'\"\n  (ready)=\"onReady()\"\n  (stateChange)=\"onStateChange($event)\"\n  width=\"100%\"\n></youtube-player>\n");

/***/ }),

/***/ "./src/app/modules/charts/modules/packs/components/chart-details/chart-details.component.scss":
/*!****************************************************************************************************!*\
  !*** ./src/app/modules/charts/modules/packs/components/chart-details/chart-details.component.scss ***!
  \****************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("@media (max-height: 590px) {\n  .hidden-height-down {\n    display: none !important;\n  }\n}\n\n@media (max-width: 319px) {\n  .hidden-ms-down {\n    display: none !important;\n  }\n}\n\n@media (min-width: 320px) {\n  .hidden-ms-up {\n    display: none !important;\n  }\n}\n\n@media (max-width: 359px) {\n  .hidden-mm-down {\n    display: none !important;\n  }\n}\n\n@media (min-width: 360px) {\n  .hidden-mm-up {\n    display: none !important;\n  }\n}\n\n@media (max-width: 479px) {\n  .hidden-ml-down {\n    display: none !important;\n  }\n}\n\n@media (min-width: 480px) {\n  .hidden-ml-up {\n    display: none !important;\n  }\n}\n\n@media (max-width: 599px) {\n  .hidden-ts-down {\n    display: none !important;\n  }\n}\n\n@media (min-width: 600px) {\n  .hidden-ts-up {\n    display: none !important;\n  }\n}\n\n@media (max-width: 719px) {\n  .hidden-tm-down {\n    display: none !important;\n  }\n}\n\n@media (min-width: 720px) {\n  .hidden-tm-up {\n    display: none !important;\n  }\n}\n\n@media (max-width: 959px) {\n  .hidden-tl-down {\n    display: none !important;\n  }\n}\n\n@media (min-width: 960px) {\n  .hidden-tl-up {\n    display: none !important;\n  }\n}\n\n@media (max-width: 1023px) {\n  .hidden-ds-down {\n    display: none !important;\n  }\n}\n\n@media (min-width: 1024px) {\n  .hidden-ds-up {\n    display: none !important;\n  }\n}\n\n@media (max-width: 1279px) {\n  .hidden-dm-down {\n    display: none !important;\n  }\n}\n\n@media (min-width: 1280px) {\n  .hidden-dm-up {\n    display: none !important;\n  }\n}\n\n@media (max-width: 1439px) {\n  .hidden-dl-down {\n    display: none !important;\n  }\n}\n\n@media (min-width: 1440px) {\n  .hidden-dl-up {\n    display: none !important;\n  }\n}\n\n.app-creating-lessons {\n  padding-bottom: 40px;\n}\n\n@media (min-width: 360px) {\n  .app-creating-lessons {\n    margin: 20px;\n  }\n}\n\n@media (min-width: 480px) {\n  .app-creating-lessons {\n    margin: 20px;\n  }\n}\n\n@media (min-width: 720px) {\n  .app-creating-lessons {\n    margin: 30px;\n  }\n}\n\n@media (min-width: 1024px) {\n  .app-creating-lessons {\n    margin: 40px;\n  }\n}\n\n@media (min-width: 1280px) {\n  .app-creating-lessons {\n    margin: 50px;\n  }\n}\n\n.app-creating-lessons__chart {\n  height: 40px;\n  cursor: pointer;\n  display: -webkit-box;\n  display: flex;\n  -webkit-box-align: center;\n          align-items: center;\n}\n\n.app-creating-lessons__button {\n  margin: 10px !important;\n}\n\n.app-admin__type-title {\n  margin: 16px;\n  font-size: 18px;\n}\n\n.app-creating-lessons__card {\n  min-width: 200px;\n}\n\n.app-admin__accordion {\n  max-width: 800px;\n}\n\n.app-chart-details__delete-button {\n  margin-right: 10px;\n}\n\n.app-chart-details__delete-button:hover {\n  cursor: pointer;\n  color: #FAA30D;\n}\n\n.app-chart-details__item {\n  display: -webkit-box;\n  display: flex;\n  -webkit-box-pack: justify;\n          justify-content: space-between;\n  cursor: pointer;\n}\n\n.app-chart-details__title {\n  display: -webkit-box;\n  display: flex;\n  max-width: 800px;\n  -webkit-box-pack: justify;\n          justify-content: space-between;\n}\n\n.app-chart-details__menu-title {\n  display: -webkit-box;\n  display: flex;\n  -webkit-box-align: center;\n          align-items: center;\n  padding: 0 7px;\n}\n\n.app-chart-details__menu-item {\n  display: -webkit-box;\n  display: flex;\n  -webkit-box-align: center;\n          align-items: center;\n  width: 25px;\n}\n\n.app-chart-details__leak {\n  padding: 20px 0;\n}\n\n.app-chart-details__pfr {\n  margin-left: 14px;\n  font-family: \"Graphik\";\n  font-weight: 600;\n  font-style: normal;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3Byb2plY3RzL3ByZWZsb3AtaGVyby9zcmMvc3R5bGVzL3ZhcmlhYmxlcy5zY3NzIiwic3JjL2FwcC9tb2R1bGVzL2NoYXJ0cy9tb2R1bGVzL3BhY2tzL2NvbXBvbmVudHMvY2hhcnQtZGV0YWlscy9jaGFydC1kZXRhaWxzLmNvbXBvbmVudC5zY3NzIiwiL2hvbWUvcHJvamVjdHMvcHJlZmxvcC1oZXJvL3NyYy9hcHAvbW9kdWxlcy9jaGFydHMvbW9kdWxlcy9wYWNrcy9jb21wb25lbnRzL2NoYXJ0LWRldGFpbHMvY2hhcnQtZGV0YWlscy5jb21wb25lbnQuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFrRkU7RUFERjtJQUVJLHdCQUFBO0VDaEZGO0FBQ0Y7O0FEMEZFO0VBT0E7SUFFSSx3QkFBQTtFQzlGSjtBQUNGOztBRDhFRTtFQW1CQTtJQUVJLHdCQUFBO0VDOUZKO0FBQ0Y7O0FEOEVFO0VBT0E7SUFFSSx3QkFBQTtFQ2xGSjtBQUNGOztBRGtFRTtFQW1CQTtJQUVJLHdCQUFBO0VDbEZKO0FBQ0Y7O0FEa0VFO0VBT0E7SUFFSSx3QkFBQTtFQ3RFSjtBQUNGOztBRHNERTtFQW1CQTtJQUVJLHdCQUFBO0VDdEVKO0FBQ0Y7O0FEc0RFO0VBT0E7SUFFSSx3QkFBQTtFQzFESjtBQUNGOztBRDBDRTtFQW1CQTtJQUVJLHdCQUFBO0VDMURKO0FBQ0Y7O0FEMENFO0VBT0E7SUFFSSx3QkFBQTtFQzlDSjtBQUNGOztBRDhCRTtFQW1CQTtJQUVJLHdCQUFBO0VDOUNKO0FBQ0Y7O0FEOEJFO0VBT0E7SUFFSSx3QkFBQTtFQ2xDSjtBQUNGOztBRGtCRTtFQW1CQTtJQUVJLHdCQUFBO0VDbENKO0FBQ0Y7O0FEa0JFO0VBT0E7SUFFSSx3QkFBQTtFQ3RCSjtBQUNGOztBRE1FO0VBbUJBO0lBRUksd0JBQUE7RUN0Qko7QUFDRjs7QURNRTtFQU9BO0lBRUksd0JBQUE7RUNWSjtBQUNGOztBRE5FO0VBbUJBO0lBRUksd0JBQUE7RUNWSjtBQUNGOztBRE5FO0VBT0E7SUFFSSx3QkFBQTtFQ0VKO0FBQ0Y7O0FEbEJFO0VBbUJBO0lBRUksd0JBQUE7RUNFSjtBQUNGOztBQzlHQTtFQUVFLG9CQUFBO0FEZ0hGOztBRDVCRTtFRXRGRjtJRmtISSxZQUFBO0VDSUY7QUFDRjs7QURqQ0U7RUV0RkY7SUZzSEksWUFBQTtFQ0tGO0FBQ0Y7O0FEdENFO0VFdEZGO0lGMEhJLFlBQUE7RUNNRjtBQUNGOztBRDNDRTtFRXRGRjtJRjhISSxZQUFBO0VDT0Y7QUFDRjs7QURoREU7RUV0RkY7SUZrSUksWUFBQTtFQ1FGO0FBQ0Y7O0FDdElBO0VBQ0UsWUFBQTtFQUNBLGVBQUE7RUFDQSxvQkFBQTtFQUFBLGFBQUE7RUFDQSx5QkFBQTtVQUFBLG1CQUFBO0FEeUlGOztBQ3RJQTtFQUNFLHVCQUFBO0FEeUlGOztBQ3RJQTtFQUNFLFlBQUE7RUFDQSxlQUFBO0FEeUlGOztBQ3RJQTtFQUNFLGdCQUFBO0FEeUlGOztBQ3JJQTtFQUNFLGdCQUFBO0FEd0lGOztBQ3JJQTtFQUNFLGtCQUFBO0FEd0lGOztBQ3JJQTtFQUNFLGVBQUE7RUFDQSxjRnZCTztBQytKVDs7QUNySUE7RUFDRSxvQkFBQTtFQUFBLGFBQUE7RUFDQSx5QkFBQTtVQUFBLDhCQUFBO0VBQ0EsZUFBQTtBRHdJRjs7QUNySUE7RUFDRSxvQkFBQTtFQUFBLGFBQUE7RUFDQSxnQkFBQTtFQUNBLHlCQUFBO1VBQUEsOEJBQUE7QUR3SUY7O0FDcklBO0VBQ0Usb0JBQUE7RUFBQSxhQUFBO0VBQ0EseUJBQUE7VUFBQSxtQkFBQTtFQUNBLGNBQUE7QUR3SUY7O0FDcklBO0VBQ0Usb0JBQUE7RUFBQSxhQUFBO0VBQ0EseUJBQUE7VUFBQSxtQkFBQTtFQUNBLFdBQUE7QUR3SUY7O0FDcklBO0VBQ0UsZUFBQTtBRHdJRjs7QUNySUE7RUFDRSxpQkFBQTtFRnZDQSxzQkFVYztFQVRkLGdCQVN5QjtFQVJ6QixrQkFROEI7QUN3S2hDIiwiZmlsZSI6InNyYy9hcHAvbW9kdWxlcy9jaGFydHMvbW9kdWxlcy9wYWNrcy9jb21wb25lbnRzL2NoYXJ0LWRldGFpbHMvY2hhcnQtZGV0YWlscy5jb21wb25lbnQuc2NzcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIGNvbG9yc1xuJGdyYXktMTogIzMwMzc0QTtcbiRncmF5LTI6ICM0ODRGNjI7XG4kZ3JheS0zOiAjNDg0RjYyO1xuXG4kZ3JlZW46ICMwMDk2ODg7XG4kZ3JlZW4tMjogIzQzQTA0NztcbiRncmVlbi0zOiAjMDBCNUE1O1xuXG4kd2hpdGU6ICNFRkYzRjY7XG4kd2hpdGUtMjogI0U3RUJFRTtcblxuJHJlZDogI0Q0MjY0NztcbiRyZWQtMjogI0ZGNkY2MDtcblxuJG9yYW5nZTogI0ZBQTMwRDtcblxuJGJsYWNrLTE6ICMyNjMyMzg7XG4kYmxhY2stMjogIzM3NDc0RjtcblxuJGNhcmQtY29sb3ItcmVkOiAjRUY1MzUwO1xuJGNhcmQtY29sb3ItYmxhY2s6ICM2MTYxNjE7XG4kY2FyZC1jb2xvci1ibHVlOiAjM0Y1MUI1O1xuJGNhcmQtY29sb3ItZ3JlZW46ICM0M0EwNDc7XG5cbi8vIHNoYWRvd1xuJHNoYWRvdy1ncmVlbjogIDAgMXB4IDNweCAwICRncmF5LTE7XG5cblxuLy8gZm9udHNcbkBtaXhpbiBmb250KCRmb250RmFtaWx5LCAkZm9udFdlaWdodCwgJGZvbnRTdHlsZSkge1xuICBmb250LWZhbWlseTogJGZvbnRGYW1pbHk7XG4gIGZvbnQtd2VpZ2h0OiAkZm9udFdlaWdodDtcbiAgZm9udC1zdHlsZTogJGZvbnRTdHlsZTtcbn1cblxuQG1peGluIGdyYXBoaWstYm9sZCgpIHtcbiAgQGluY2x1ZGUgZm9udCgnR3JhcGhpaycsIGJvbGQsIG5vcm1hbCk7XG59XG5cbkBtaXhpbiBncmFwaGlrLXNlbWlib2xkKCkge1xuICBAaW5jbHVkZSBmb250KCdHcmFwaGlrJywgNjAwLCBub3JtYWwpO1xufVxuXG5AbWl4aW4gZ3JhcGhpay1yZWd1bGFyKCkge1xuICBAaW5jbHVkZSBmb250KCdHcmFwaGlrJywgbm9ybWFsLCBub3JtYWwpO1xufVxuXG5AbWl4aW4gZ3JhcGhpay1zZW1pYm9sZC1pdGFsaWMoKSB7XG4gIEBpbmNsdWRlIGZvbnQoJ0dyYXBoaWsnLCA2MDAsIGl0YWxpYyk7XG59XG5cbkBtaXhpbiBncmFwaGlrLWxpZ2h0KCkge1xuICBAaW5jbHVkZSBmb250KCdHcmFwaGlrJywgNDAwLCBsaWdodCk7XG59XG5cbi8vc2NyZWVuIHNpemVzXG4kc2NyZWVuLW1zOiAzMjBweDtcbiRzY3JlZW4tbW06IDM2MHB4OyAvLyBmaXJzdFxuJHNjcmVlbi1tbDogNDgwcHg7IC8vICRzZWNvbmRcbiRzY3JlZW4tdHM6IDYwMHB4O1xuJHNjcmVlbi10bTogNzIwcHg7IC8vIHRoaXJkXG4kc2NyZWVuLXRsOiA5NjBweDtcbiRzY3JlZW4tZHM6IDEwMjRweDsgLy8gZm91cnRoXG4kc2NyZWVuLWRtOiAxMjgwcHg7IC8vIGZpZnRoXG4kc2NyZWVuLWRsOiAxNDQwcHg7XG5cblxuXG4kZ3JpZDogKFxuICAnbXMnOiAzMjBweCxcbiAgJ21tJzogMzYwcHgsXG4gICdtbCc6IDQ4MHB4LFxuICAndHMnOiA2MDBweCxcbiAgJ3RtJzogNzIwcHgsXG4gICd0bCc6IDk2MHB4LFxuICAnZHMnOiAxMDI0cHgsXG4gICdkbSc6IDEyODBweCxcbiAgJ2RsJzogMTQ0MHB4LFxuKTtcblxuLmhpZGRlbi1oZWlnaHQtZG93biB7XG4gIEBtZWRpYSAobWF4LWhlaWdodDogNTkwcHgpIHtcbiAgICBkaXNwbGF5OiBub25lICFpbXBvcnRhbnQ7XG4gIH1cbn1cblxuQG1peGluIGFib3ZlKCRicmVha3BvaW50cykge1xuICBAbWVkaWEgKG1pbi13aWR0aDogI3skYnJlYWtwb2ludHN9KSB7XG4gICAgQGNvbnRlbnQ7XG4gIH1cbn1cblxuQG1peGluIGJlbG93KCRicmVha3BvaW50cykge1xuICBAbWVkaWEgKG1heC13aWR0aDogI3skYnJlYWtwb2ludHN9KSB7XG4gICAgQGNvbnRlbnQ7XG4gIH1cbn1cblxuQGVhY2ggJGtleSwgJHZhbHVlIGluICRncmlkIHtcblxuICAuaGlkZGVuLSN7JGtleX0tZG93biB7XG4gICAgQGluY2x1ZGUgYmVsb3coI3skdmFsdWUgLSAxfSkge1xuICAgICAgZGlzcGxheTogbm9uZSAhaW1wb3J0YW50O1xuICAgIH1cbiAgfVxuXG4gIC5oaWRkZW4tI3ska2V5fS11cCB7XG4gICAgQGluY2x1ZGUgYWJvdmUoI3skdmFsdWV9KSB7XG4gICAgICBkaXNwbGF5OiBub25lICFpbXBvcnRhbnQ7XG4gICAgfVxuICB9XG59XG5cbkBtaXhpbiBhYm92ZVNjcmVlblNpemUoJHR5cGUsICRmaXJzdCwgJHNlY29uZCwgJHRoaXJkLCAkZm91cnRoLCAkZmlmdGgpIHtcbiAgQGluY2x1ZGUgYWJvdmUoJHNjcmVlbi1tbSkge1xuICAgICN7JHR5cGV9OiAkZmlyc3QgKyBweDtcbiAgfVxuXG4gIEBpbmNsdWRlIGFib3ZlKCRzY3JlZW4tbWwpIHtcbiAgICAjeyR0eXBlfTogJHNlY29uZCArIHB4O1xuICB9XG5cbiAgQGluY2x1ZGUgYWJvdmUoJHNjcmVlbi10bSkge1xuICAgICN7JHR5cGV9OiAkdGhpcmQgKyBweDtcbiAgfVxuXG4gIEBpbmNsdWRlIGFib3ZlKCRzY3JlZW4tZHMpIHtcbiAgICAjeyR0eXBlfTogJGZvdXJ0aCArIHB4O1xuICB9XG5cbiAgQGluY2x1ZGUgYWJvdmUoJHNjcmVlbi1kbSkge1xuICAgICN7JHR5cGV9OiAkZmlmdGggKyBweDtcbiAgfVxufVxuXG5AbWl4aW4gYWJvdmVTY3JlZW5TaXplV2l0aERpbWVuc2lvbigkdHlwZSwgJGZpcnN0LCAkc2Vjb25kLCAkdGhpcmQsICRmb3VydGgsICRmaWZ0aCwgJGRpbWVuc2lvbikge1xuICBAaW5jbHVkZSBhYm92ZSgkc2NyZWVuLW1tKSB7XG4gICAgI3skdHlwZX06ICRmaXJzdCArICRkaW1lbnNpb247XG4gIH1cblxuICBAaW5jbHVkZSBhYm92ZSgkc2NyZWVuLW1sKSB7XG4gICAgI3skdHlwZX06ICRzZWNvbmQgKyAkZGltZW5zaW9uO1xuICB9XG5cbiAgQGluY2x1ZGUgYWJvdmUoJHNjcmVlbi10bSkge1xuICAgICN7JHR5cGV9OiAkdGhpcmQgKyAkZGltZW5zaW9uO1xuICB9XG5cbiAgQGluY2x1ZGUgYWJvdmUoJHNjcmVlbi1kcykge1xuICAgICN7JHR5cGV9OiAkZm91cnRoICsgJGRpbWVuc2lvbjtcbiAgfVxuXG4gIEBpbmNsdWRlIGFib3ZlKCRzY3JlZW4tZG0pIHtcbiAgICAjeyR0eXBlfTogJGZpZnRoICsgJGRpbWVuc2lvbjtcbiAgfVxufVxuXG5AbWl4aW4gYmVsb3dTY3JlZW5TaXplKCR0eXBlLCAkZmlyc3QsICRzZWNvbmQsICR0aGlyZCwgJGZvdXJ0aCwgJGZpZnRoKSB7XG4gIEBpbmNsdWRlIGJlbG93KCRzY3JlZW4tbW0pIHtcbiAgICAjeyR0eXBlfTogJGZpcnN0ICsgcHg7XG4gIH1cblxuICBAaW5jbHVkZSBiZWxvdygkc2NyZWVuLW1sKSB7XG4gICAgI3skdHlwZX06ICRzZWNvbmQgKyBweDtcbiAgfVxuXG4gIEBpbmNsdWRlIGJlbG93KCRzY3JlZW4tdG0pIHtcbiAgICAjeyR0eXBlfTogJHRoaXJkICsgcHg7XG4gIH1cblxuICBAaW5jbHVkZSBiZWxvdygkc2NyZWVuLWRzKSB7XG4gICAgI3skdHlwZX06ICRmb3VydGggKyBweDtcbiAgfVxuXG4gIEBpbmNsdWRlIGJlbG93KCRzY3JlZW4tZG0pIHtcbiAgICAjeyR0eXBlfTogJGZpZnRoICsgcHg7XG4gIH1cbn1cblxuQG1peGluIGljb25TaXplU2NyZWVuU2l6ZSgkZmlyc3QsICRzZWNvbmQsICR0aGlyZCwgJGZvdXJ0aCwgJGZpZnRoKSB7XG4gIEBpbmNsdWRlIGFib3ZlKCRzY3JlZW4tbW0pIHtcbiAgICB3aWR0aDogJGZpcnN0ICsgcHggIWltcG9ydGFudDtcbiAgICBoZWlnaHQ6ICRmaXJzdCArIHB4ICFpbXBvcnRhbnQ7XG4gIH1cblxuICBAaW5jbHVkZSBhYm92ZSgkc2NyZWVuLW1sKSB7XG4gICAgd2lkdGg6ICRzZWNvbmQgKyBweCAhaW1wb3J0YW50O1xuICAgIGhlaWdodDogJHNlY29uZCArIHB4ICFpbXBvcnRhbnQ7XG4gIH1cblxuICBAaW5jbHVkZSBhYm92ZSgkc2NyZWVuLXRtKSB7XG4gICAgd2lkdGg6ICR0aGlyZCArIHB4ICFpbXBvcnRhbnQ7XG4gICAgaGVpZ2h0OiAkdGhpcmQgKyBweCAhaW1wb3J0YW50O1xuICB9XG5cbiAgQGluY2x1ZGUgYWJvdmUoJHNjcmVlbi1kcykge1xuICAgIHdpZHRoOiAkZm91cnRoICsgcHggIWltcG9ydGFudDtcbiAgICBoZWlnaHQ6ICRmb3VydGggKyBweCAhaW1wb3J0YW50O1xuICB9XG5cbiAgQGluY2x1ZGUgYWJvdmUoJHNjcmVlbi1kbSkge1xuICAgIHdpZHRoOiAkZmlmdGggKyBweCAhaW1wb3J0YW50O1xuICAgIGhlaWdodDogJGZpZnRoICsgcHggIWltcG9ydGFudDtcbiAgfVxufVxuXG5cbiIsIkBtZWRpYSAobWF4LWhlaWdodDogNTkwcHgpIHtcbiAgLmhpZGRlbi1oZWlnaHQtZG93biB7XG4gICAgZGlzcGxheTogbm9uZSAhaW1wb3J0YW50O1xuICB9XG59XG5cbkBtZWRpYSAobWF4LXdpZHRoOiAzMTlweCkge1xuICAuaGlkZGVuLW1zLWRvd24ge1xuICAgIGRpc3BsYXk6IG5vbmUgIWltcG9ydGFudDtcbiAgfVxufVxuXG5AbWVkaWEgKG1pbi13aWR0aDogMzIwcHgpIHtcbiAgLmhpZGRlbi1tcy11cCB7XG4gICAgZGlzcGxheTogbm9uZSAhaW1wb3J0YW50O1xuICB9XG59XG5cbkBtZWRpYSAobWF4LXdpZHRoOiAzNTlweCkge1xuICAuaGlkZGVuLW1tLWRvd24ge1xuICAgIGRpc3BsYXk6IG5vbmUgIWltcG9ydGFudDtcbiAgfVxufVxuXG5AbWVkaWEgKG1pbi13aWR0aDogMzYwcHgpIHtcbiAgLmhpZGRlbi1tbS11cCB7XG4gICAgZGlzcGxheTogbm9uZSAhaW1wb3J0YW50O1xuICB9XG59XG5cbkBtZWRpYSAobWF4LXdpZHRoOiA0NzlweCkge1xuICAuaGlkZGVuLW1sLWRvd24ge1xuICAgIGRpc3BsYXk6IG5vbmUgIWltcG9ydGFudDtcbiAgfVxufVxuXG5AbWVkaWEgKG1pbi13aWR0aDogNDgwcHgpIHtcbiAgLmhpZGRlbi1tbC11cCB7XG4gICAgZGlzcGxheTogbm9uZSAhaW1wb3J0YW50O1xuICB9XG59XG5cbkBtZWRpYSAobWF4LXdpZHRoOiA1OTlweCkge1xuICAuaGlkZGVuLXRzLWRvd24ge1xuICAgIGRpc3BsYXk6IG5vbmUgIWltcG9ydGFudDtcbiAgfVxufVxuXG5AbWVkaWEgKG1pbi13aWR0aDogNjAwcHgpIHtcbiAgLmhpZGRlbi10cy11cCB7XG4gICAgZGlzcGxheTogbm9uZSAhaW1wb3J0YW50O1xuICB9XG59XG5cbkBtZWRpYSAobWF4LXdpZHRoOiA3MTlweCkge1xuICAuaGlkZGVuLXRtLWRvd24ge1xuICAgIGRpc3BsYXk6IG5vbmUgIWltcG9ydGFudDtcbiAgfVxufVxuXG5AbWVkaWEgKG1pbi13aWR0aDogNzIwcHgpIHtcbiAgLmhpZGRlbi10bS11cCB7XG4gICAgZGlzcGxheTogbm9uZSAhaW1wb3J0YW50O1xuICB9XG59XG5cbkBtZWRpYSAobWF4LXdpZHRoOiA5NTlweCkge1xuICAuaGlkZGVuLXRsLWRvd24ge1xuICAgIGRpc3BsYXk6IG5vbmUgIWltcG9ydGFudDtcbiAgfVxufVxuXG5AbWVkaWEgKG1pbi13aWR0aDogOTYwcHgpIHtcbiAgLmhpZGRlbi10bC11cCB7XG4gICAgZGlzcGxheTogbm9uZSAhaW1wb3J0YW50O1xuICB9XG59XG5cbkBtZWRpYSAobWF4LXdpZHRoOiAxMDIzcHgpIHtcbiAgLmhpZGRlbi1kcy1kb3duIHtcbiAgICBkaXNwbGF5OiBub25lICFpbXBvcnRhbnQ7XG4gIH1cbn1cblxuQG1lZGlhIChtaW4td2lkdGg6IDEwMjRweCkge1xuICAuaGlkZGVuLWRzLXVwIHtcbiAgICBkaXNwbGF5OiBub25lICFpbXBvcnRhbnQ7XG4gIH1cbn1cblxuQG1lZGlhIChtYXgtd2lkdGg6IDEyNzlweCkge1xuICAuaGlkZGVuLWRtLWRvd24ge1xuICAgIGRpc3BsYXk6IG5vbmUgIWltcG9ydGFudDtcbiAgfVxufVxuXG5AbWVkaWEgKG1pbi13aWR0aDogMTI4MHB4KSB7XG4gIC5oaWRkZW4tZG0tdXAge1xuICAgIGRpc3BsYXk6IG5vbmUgIWltcG9ydGFudDtcbiAgfVxufVxuXG5AbWVkaWEgKG1heC13aWR0aDogMTQzOXB4KSB7XG4gIC5oaWRkZW4tZGwtZG93biB7XG4gICAgZGlzcGxheTogbm9uZSAhaW1wb3J0YW50O1xuICB9XG59XG5cbkBtZWRpYSAobWluLXdpZHRoOiAxNDQwcHgpIHtcbiAgLmhpZGRlbi1kbC11cCB7XG4gICAgZGlzcGxheTogbm9uZSAhaW1wb3J0YW50O1xuICB9XG59XG5cbi5hcHAtY3JlYXRpbmctbGVzc29ucyB7XG4gIHBhZGRpbmctYm90dG9tOiA0MHB4O1xufVxuQG1lZGlhIChtaW4td2lkdGg6IDM2MHB4KSB7XG4gIC5hcHAtY3JlYXRpbmctbGVzc29ucyB7XG4gICAgbWFyZ2luOiAyMHB4O1xuICB9XG59XG5AbWVkaWEgKG1pbi13aWR0aDogNDgwcHgpIHtcbiAgLmFwcC1jcmVhdGluZy1sZXNzb25zIHtcbiAgICBtYXJnaW46IDIwcHg7XG4gIH1cbn1cbkBtZWRpYSAobWluLXdpZHRoOiA3MjBweCkge1xuICAuYXBwLWNyZWF0aW5nLWxlc3NvbnMge1xuICAgIG1hcmdpbjogMzBweDtcbiAgfVxufVxuQG1lZGlhIChtaW4td2lkdGg6IDEwMjRweCkge1xuICAuYXBwLWNyZWF0aW5nLWxlc3NvbnMge1xuICAgIG1hcmdpbjogNDBweDtcbiAgfVxufVxuQG1lZGlhIChtaW4td2lkdGg6IDEyODBweCkge1xuICAuYXBwLWNyZWF0aW5nLWxlc3NvbnMge1xuICAgIG1hcmdpbjogNTBweDtcbiAgfVxufVxuXG4uYXBwLWNyZWF0aW5nLWxlc3NvbnNfX2NoYXJ0IHtcbiAgaGVpZ2h0OiA0MHB4O1xuICBjdXJzb3I6IHBvaW50ZXI7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG59XG5cbi5hcHAtY3JlYXRpbmctbGVzc29uc19fYnV0dG9uIHtcbiAgbWFyZ2luOiAxMHB4ICFpbXBvcnRhbnQ7XG59XG5cbi5hcHAtYWRtaW5fX3R5cGUtdGl0bGUge1xuICBtYXJnaW46IDE2cHg7XG4gIGZvbnQtc2l6ZTogMThweDtcbn1cblxuLmFwcC1jcmVhdGluZy1sZXNzb25zX19jYXJkIHtcbiAgbWluLXdpZHRoOiAyMDBweDtcbn1cblxuLmFwcC1hZG1pbl9fYWNjb3JkaW9uIHtcbiAgbWF4LXdpZHRoOiA4MDBweDtcbn1cblxuLmFwcC1jaGFydC1kZXRhaWxzX19kZWxldGUtYnV0dG9uIHtcbiAgbWFyZ2luLXJpZ2h0OiAxMHB4O1xufVxuXG4uYXBwLWNoYXJ0LWRldGFpbHNfX2RlbGV0ZS1idXR0b246aG92ZXIge1xuICBjdXJzb3I6IHBvaW50ZXI7XG4gIGNvbG9yOiAjRkFBMzBEO1xufVxuXG4uYXBwLWNoYXJ0LWRldGFpbHNfX2l0ZW0ge1xuICBkaXNwbGF5OiBmbGV4O1xuICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XG4gIGN1cnNvcjogcG9pbnRlcjtcbn1cblxuLmFwcC1jaGFydC1kZXRhaWxzX190aXRsZSB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIG1heC13aWR0aDogODAwcHg7XG4gIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2Vlbjtcbn1cblxuLmFwcC1jaGFydC1kZXRhaWxzX19tZW51LXRpdGxlIHtcbiAgZGlzcGxheTogZmxleDtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgcGFkZGluZzogMCA3cHg7XG59XG5cbi5hcHAtY2hhcnQtZGV0YWlsc19fbWVudS1pdGVtIHtcbiAgZGlzcGxheTogZmxleDtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgd2lkdGg6IDI1cHg7XG59XG5cbi5hcHAtY2hhcnQtZGV0YWlsc19fbGVhayB7XG4gIHBhZGRpbmc6IDIwcHggMDtcbn1cblxuLmFwcC1jaGFydC1kZXRhaWxzX19wZnIge1xuICBtYXJnaW4tbGVmdDogMTRweDtcbiAgZm9udC1mYW1pbHk6IFwiR3JhcGhpa1wiO1xuICBmb250LXdlaWdodDogNjAwO1xuICBmb250LXN0eWxlOiBub3JtYWw7XG59IiwiQGltcG9ydCAnLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3R5bGVzL3ZhcmlhYmxlcyc7XG5cbi5hcHAtY3JlYXRpbmctbGVzc29ucyB7XG4gIEBpbmNsdWRlIGFib3ZlU2NyZWVuU2l6ZShtYXJnaW4sIDIwLCAyMCwgMzAsIDQwLCA1MCk7XG4gIHBhZGRpbmctYm90dG9tOiA0MHB4O1xufVxuXG4uYXBwLWNyZWF0aW5nLWxlc3NvbnNfX2NoYXJ0IHtcbiAgaGVpZ2h0OiA0MHB4O1xuICBjdXJzb3I6IHBvaW50ZXI7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG59XG5cbi5hcHAtY3JlYXRpbmctbGVzc29uc19fYnV0dG9uIHtcbiAgbWFyZ2luOiAxMHB4ICFpbXBvcnRhbnQ7XG59XG5cbi5hcHAtYWRtaW5fX3R5cGUtdGl0bGUge1xuICBtYXJnaW46IDE2cHg7XG4gIGZvbnQtc2l6ZTogMThweDtcbn1cblxuLmFwcC1jcmVhdGluZy1sZXNzb25zX19jYXJkIHtcbiAgbWluLXdpZHRoOiAyMDBweDtcbn1cblxuXG4uYXBwLWFkbWluX19hY2NvcmRpb24ge1xuICBtYXgtd2lkdGg6IDgwMHB4O1xufVxuXG4uYXBwLWNoYXJ0LWRldGFpbHNfX2RlbGV0ZS1idXR0b24ge1xuICBtYXJnaW4tcmlnaHQ6IDEwcHg7XG59XG5cbi5hcHAtY2hhcnQtZGV0YWlsc19fZGVsZXRlLWJ1dHRvbjpob3ZlciB7XG4gIGN1cnNvcjogcG9pbnRlcjtcbiAgY29sb3I6ICRvcmFuZ2U7XG59XG5cbi5hcHAtY2hhcnQtZGV0YWlsc19faXRlbSB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjtcbiAgY3Vyc29yOiBwb2ludGVyO1xufVxuXG4uYXBwLWNoYXJ0LWRldGFpbHNfX3RpdGxlIHtcbiAgZGlzcGxheTogZmxleDtcbiAgbWF4LXdpZHRoOiA4MDBweDtcbiAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xufVxuXG4uYXBwLWNoYXJ0LWRldGFpbHNfX21lbnUtdGl0bGUge1xuICBkaXNwbGF5OiBmbGV4O1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBwYWRkaW5nOiAwIDdweDtcbn1cblxuLmFwcC1jaGFydC1kZXRhaWxzX19tZW51LWl0ZW0ge1xuICBkaXNwbGF5OiBmbGV4O1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICB3aWR0aDogMjVweDtcbn1cblxuLmFwcC1jaGFydC1kZXRhaWxzX19sZWFrIHtcbiAgcGFkZGluZzogMjBweCAwO1xufVxuXG4uYXBwLWNoYXJ0LWRldGFpbHNfX3BmciB7XG4gIG1hcmdpbi1sZWZ0OiAxNHB4O1xuICBAaW5jbHVkZSBncmFwaGlrLXNlbWlib2xkKCk7XG59XG4iXX0= */");

/***/ }),

/***/ "./src/app/modules/charts/modules/packs/components/chart-details/chart-details.component.ts":
/*!**************************************************************************************************!*\
  !*** ./src/app/modules/charts/modules/packs/components/chart-details/chart-details.component.ts ***!
  \**************************************************************************************************/
/*! exports provided: ChartDetailsComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ChartDetailsComponent", function() { return ChartDetailsComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _services_app_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../../services/app.service */ "./src/app/services/app.service.ts");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _services_user_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../../../../services/user.service */ "./src/app/services/user.service.ts");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm5/index.js");
/* harmony import */ var _shared_services_utils_service__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../../../../shared/services/utils.service */ "./src/app/shared/services/utils.service.ts");
/* harmony import */ var _services_default_data_service__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../../../../../services/default-data.service */ "./src/app/services/default-data.service.ts");
/* harmony import */ var _shared_services_snackbar_service__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../../../../../shared/services/snackbar.service */ "./src/app/shared/services/snackbar.service.ts");
/* harmony import */ var _shared_modals_confirm_dialog_confirm_dialog_component__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../../../../../shared/modals/confirm-dialog/confirm-dialog.component */ "./src/app/shared/modals/confirm-dialog/confirm-dialog.component.ts");
/* harmony import */ var _angular_material_dialog__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @angular/material/dialog */ "./node_modules/@angular/material/esm5/dialog.es5.js");
/* harmony import */ var _services_charts_service__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../../../../services/charts.service */ "./src/app/modules/charts/services/charts.service.ts");
/* harmony import */ var _flash_dialog_flash_dialog_component__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../flash-dialog/flash-dialog.component */ "./src/app/modules/charts/modules/packs/components/flash-dialog/flash-dialog.component.ts");
/* harmony import */ var _youtube_dialog_youtube_dialog_component__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../youtube-dialog/youtube-dialog.component */ "./src/app/modules/charts/modules/packs/components/youtube-dialog/youtube-dialog.component.ts");
/* harmony import */ var _creating_chapter_dialog_creating_chapter_dialog_component__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ../creating-chapter-dialog/creating-chapter-dialog.component */ "./src/app/modules/charts/modules/packs/components/creating-chapter-dialog/creating-chapter-dialog.component.ts");
















var ChartDetailsComponent = /** @class */ (function () {
    function ChartDetailsComponent(appService, route, router, userService, utilsService, dialog, defaultDataService, snackbarService, chartsService, changeDetectorRef) {
        this.appService = appService;
        this.route = route;
        this.router = router;
        this.userService = userService;
        this.utilsService = utilsService;
        this.dialog = dialog;
        this.defaultDataService = defaultDataService;
        this.snackbarService = snackbarService;
        this.chartsService = chartsService;
        this.changeDetectorRef = changeDetectorRef;
        this.isEditable = false;
        this.chapters = [];
    }
    Object.defineProperty(ChartDetailsComponent.prototype, "isAdmin", {
        get: function () {
            return this.userService.isAdmin();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChartDetailsComponent.prototype, "isTrial", {
        get: function () {
            return this.userService.isTrial();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ChartDetailsComponent.prototype, "isLeakFinderAvailable", {
        get: function () {
            return this.userService.getUser().email === 'rudenok.evgeni@gmail.com'
                || this.userService.getUser().email === 'den.korolenok@gmail.com'
                || this.userService.getUser().email === 'luckyplayerok@gmail.com'
                || this.userService.getUser().email === 'prology777@gmail.com'
                || this.userService.getUser().email === 'dimaosin23357@gmail.com'
                || this.userService.getUser().email === 'peahematop@gmail.com'
                || this.userService.getUser().email === 'jen.lesnoy@gmail.com'
                || this.userService.getUser().email === 'leshasavablr@gmail.com'
                || this.userService.getUser().email === 'jkulakovski@gmail.com'
                || this.userService.getUser().email === 'mitron870@gmail.com';
        },
        enumerable: true,
        configurable: true
    });
    ChartDetailsComponent.prototype.openFlashOptions = function () {
        this.dialog.open(_flash_dialog_flash_dialog_component__WEBPACK_IMPORTED_MODULE_13__["FlashDialogComponent"], {
            data: { packTitle: this.packTitle, packId: +this.packId },
            autoFocus: false,
            panelClass: 'app-full-screen'
        });
    };
    ChartDetailsComponent.prototype.openYoutubeDialog = function () {
        this.dialog.open(_youtube_dialog_youtube_dialog_component__WEBPACK_IMPORTED_MODULE_14__["YoutubeDialogComponent"], {
            autoFocus: false,
            panelClass: 'app-youtube-screen'
        });
    };
    ChartDetailsComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.appService.headerTitleTemplate = this.headerTitleTemplate;
        this.appService.headerActionsTemplate = this.headerActionsTemplate;
        this.packId = this.route.snapshot.paramMap.get('packId');
        this.route.data.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_5__["switchMap"])(function (data) {
            _this.packTitle = data.charts.title;
            _this.mixCharts = data.charts.mixCharts;
            _this.chartUuid = data.charts.uuid;
            _this.isEditable = data.charts.isEditable;
            var newArrHu = data.charts.charts.filter(function (chart) { return chart.gameType.playersCount === 2; });
            var newArr3max = data.charts.charts.filter(function (chart) { return chart.gameType.playersCount === 3; });
            return Object(rxjs__WEBPACK_IMPORTED_MODULE_6__["of"])({ arrHu: newArrHu, arr3max: newArr3max });
        })).subscribe(function (data) {
            _this.chartsHu = _this.utilsService.groupChartByAction(data.arrHu);
            _this.charts3max = _this.utilsService.groupChartByAction(data.arr3max);
        });
        this.chartsService.getChapters(this.packId).subscribe(function (chapters) {
            _this.chapters = chapters;
        });
    };
    ChartDetailsComponent.prototype.deleteLesson = function (event, lesson, chart, isHu) {
        var _this = this;
        event.stopPropagation();
        var dialogRef = this.dialog.open(_shared_modals_confirm_dialog_confirm_dialog_component__WEBPACK_IMPORTED_MODULE_10__["ConfirmDialogComponent"], {
            data: "Are you sure want to delete lesson?",
        });
        dialogRef.afterClosed().pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_5__["filter"])(function (value) { return value; }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_5__["switchMap"])(function () {
            return _this.chartsService.deleteLesson(+lesson.id);
        })).subscribe(function () {
            if (chart.charts.length === 1) {
                if (isHu) {
                    var index = _this.chartsHu.indexOf(chart);
                    _this.chartsHu.splice(index, 1);
                }
                else {
                    var index = _this.charts3max.indexOf(chart);
                    _this.charts3max.splice(index, 1);
                }
            }
            else {
                var index = chart.charts.indexOf(lesson);
                chart.charts.splice(index, 1);
            }
            _this.snackbarService.showMessage("Lesson deleted");
        });
    };
    ChartDetailsComponent.prototype.copyLesson = function (event, lesson) {
        var _this = this;
        event.stopPropagation();
        this.chartsService.getChartById(lesson.id).subscribe(function (data) {
            _this.chartsService.saveRanges(data.stackRanges);
            _this.router.navigate(['charts', _this.packId, 'new-lesson']);
        });
    };
    ChartDetailsComponent.prototype.deleteMixedLesson = function (event, mixedLesson, chapterIndex) {
        var _this = this;
        event.stopPropagation();
        var dialogRef = this.dialog.open(_shared_modals_confirm_dialog_confirm_dialog_component__WEBPACK_IMPORTED_MODULE_10__["ConfirmDialogComponent"], {
            data: "Are you sure want to delete mixed lesson?",
        });
        dialogRef.afterClosed().pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_5__["filter"])(function (value) { return value; }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_5__["switchMap"])(function () {
            return _this.chartsService.deleteMixedLesson(+mixedLesson.id);
        })).subscribe(function () {
            var index = _this.mixCharts.indexOf(mixedLesson);
            _this.chapters[chapterIndex].mixTasks.splice(index, 1);
            _this.changeDetectorRef.detectChanges();
            _this.snackbarService.showMessage("Lesson deleted");
        });
    };
    ChartDetailsComponent.prototype.openLesson = function (lesson) {
        if (this.isTrial && this.chartUuid === this.defaultDataService.defaultChartUuid
            && lesson.gameType.playersCount === 3 && lesson.position.id !== 2) {
            this.snackbarService.showMessage("Can't access with trial account");
        }
        else {
            this.router.navigate(['charts', this.packId, 'edit-lesson', lesson.id]);
        }
    };
    ChartDetailsComponent.prototype.openDialogChapterCreate = function () {
        var _this = this;
        var dialogRef = this.dialog.open(_creating_chapter_dialog_creating_chapter_dialog_component__WEBPACK_IMPORTED_MODULE_15__["CreatingChapterDialogComponent"], {
            data: this.chapters,
            autoFocus: false,
            disableClose: true
        });
        dialogRef.afterClosed().pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_5__["filter"])(function (value) { return value; }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_5__["switchMap"])(function (chapters) {
            _this.chapters = chapters;
            return _this.chartsService.saveChapters(chapters, _this.packId);
        })).subscribe(function () {
            _this.snackbarService.showMessage('Chapters saved');
        });
    };
    ChartDetailsComponent.prototype.openMixedLesson = function (id) {
        if (this.isEditable) {
            this.router.navigate(["charts/" + this.packId + "/edit-mixed-lesson/" + id.toString()]);
        }
    };
    ChartDetailsComponent.prototype.ngOnDestroy = function () {
        this.appService.headerTitleTemplate = null;
        this.appService.headerActionsTemplate = null;
    };
    ChartDetailsComponent.prototype.getPFRLabels = function (pfr) {
        var labels = [];
        if (!pfr)
            return labels;
        var positions = ['bb', 'sb', 'btn'];
        positions.forEach(function (pos) {
            var data = pfr[pos];
            if (data) {
                if (data.start && data.finish) {
                    if (data.start >= 40 && data.finish >= 40) {
                        labels.push('High');
                    }
                    else if (data.start >= 1 && data.start <= 25 && data.finish >= 1 && data.finish <= 25) {
                        labels.push('Low');
                    }
                }
            }
        });
        return labels;
    };
    ChartDetailsComponent.prototype.showPFR = function (pfr) {
        if (!pfr)
            return false;
        return this.getPFRLabels(pfr).length > 0;
    };
    ChartDetailsComponent.ctorParameters = function () { return [
        { type: _services_app_service__WEBPACK_IMPORTED_MODULE_2__["AppService"] },
        { type: _angular_router__WEBPACK_IMPORTED_MODULE_3__["ActivatedRoute"] },
        { type: _angular_router__WEBPACK_IMPORTED_MODULE_3__["Router"] },
        { type: _services_user_service__WEBPACK_IMPORTED_MODULE_4__["UserService"] },
        { type: _shared_services_utils_service__WEBPACK_IMPORTED_MODULE_7__["UtilsService"] },
        { type: _angular_material_dialog__WEBPACK_IMPORTED_MODULE_11__["MatDialog"] },
        { type: _services_default_data_service__WEBPACK_IMPORTED_MODULE_8__["DefaultDataService"] },
        { type: _shared_services_snackbar_service__WEBPACK_IMPORTED_MODULE_9__["SnackbarService"] },
        { type: _services_charts_service__WEBPACK_IMPORTED_MODULE_12__["ChartsService"] },
        { type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["ChangeDetectorRef"] }
    ]; };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"])('headerTitleTemplate', { static: true })
    ], ChartDetailsComponent.prototype, "headerTitleTemplate", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"])('headerActionsTemplate', { static: true })
    ], ChartDetailsComponent.prototype, "headerActionsTemplate", void 0);
    ChartDetailsComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-chart-details',
            template: tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(/*! raw-loader!./chart-details.component.html */ "./node_modules/raw-loader/dist/cjs.js!./src/app/modules/charts/modules/packs/components/chart-details/chart-details.component.html")).default,
            styles: [tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(/*! ./chart-details.component.scss */ "./src/app/modules/charts/modules/packs/components/chart-details/chart-details.component.scss")).default]
        })
    ], ChartDetailsComponent);
    return ChartDetailsComponent;
}());



/***/ }),

/***/ "./src/app/modules/charts/modules/packs/components/creating-lesson/creating-lesson.component.scss":
/*!********************************************************************************************************!*\
  !*** ./src/app/modules/charts/modules/packs/components/creating-lesson/creating-lesson.component.scss ***!
  \********************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("@media (max-height: 590px) {\n  .hidden-height-down {\n    display: none !important;\n  }\n}\n\n@media (max-width: 319px) {\n  .hidden-ms-down {\n    display: none !important;\n  }\n}\n\n@media (min-width: 320px) {\n  .hidden-ms-up {\n    display: none !important;\n  }\n}\n\n@media (max-width: 359px) {\n  .hidden-mm-down {\n    display: none !important;\n  }\n}\n\n@media (min-width: 360px) {\n  .hidden-mm-up {\n    display: none !important;\n  }\n}\n\n@media (max-width: 479px) {\n  .hidden-ml-down {\n    display: none !important;\n  }\n}\n\n@media (min-width: 480px) {\n  .hidden-ml-up {\n    display: none !important;\n  }\n}\n\n@media (max-width: 599px) {\n  .hidden-ts-down {\n    display: none !important;\n  }\n}\n\n@media (min-width: 600px) {\n  .hidden-ts-up {\n    display: none !important;\n  }\n}\n\n@media (max-width: 719px) {\n  .hidden-tm-down {\n    display: none !important;\n  }\n}\n\n@media (min-width: 720px) {\n  .hidden-tm-up {\n    display: none !important;\n  }\n}\n\n@media (max-width: 959px) {\n  .hidden-tl-down {\n    display: none !important;\n  }\n}\n\n@media (min-width: 960px) {\n  .hidden-tl-up {\n    display: none !important;\n  }\n}\n\n@media (max-width: 1023px) {\n  .hidden-ds-down {\n    display: none !important;\n  }\n}\n\n@media (min-width: 1024px) {\n  .hidden-ds-up {\n    display: none !important;\n  }\n}\n\n@media (max-width: 1279px) {\n  .hidden-dm-down {\n    display: none !important;\n  }\n}\n\n@media (min-width: 1280px) {\n  .hidden-dm-up {\n    display: none !important;\n  }\n}\n\n@media (max-width: 1439px) {\n  .hidden-dl-down {\n    display: none !important;\n  }\n}\n\n@media (min-width: 1440px) {\n  .hidden-dl-up {\n    display: none !important;\n  }\n}\n\n.app-creating-lessons__container {\n  padding: 0 16px;\n}\n\n.app-creating-lessons-form {\n  padding: 20px 0;\n  width: 50%;\n}\n\n.app-creating-lessons-form__row {\n  display: -webkit-box;\n  display: flex;\n  gap: 6px;\n  padding-bottom: 8px;\n}\n\n.app-creating-lessons-form__row-2 {\n  display: -webkit-box;\n  display: flex;\n  gap: 6px;\n  padding-left: 12px;\n}\n\n.app-creating-lessons-form-title {\n  font-size: 18px;\n  font-family: \"Graphik\";\n  font-weight: 600;\n  font-style: normal;\n}\n\n.app-creating-lessons-form-label {\n  font-size: 16px;\n  padding: 8px 0;\n  color: #009688;\n}\n\n.app-creating-lessons-form__field_input.mat-form-field {\n  width: 90px;\n}\n\n.app-creating-lessons__description {\n  max-width: 800px;\n  text-align: justify;\n  margin-bottom: 20px;\n  font-family: sans-serif;\n}\n\n@media (min-width: 360px) {\n  .app-creating-lessons__description {\n    width: 325px;\n  }\n}\n\n@media (min-width: 480px) {\n  .app-creating-lessons__description {\n    width: 325px;\n  }\n}\n\n@media (min-width: 720px) {\n  .app-creating-lessons__description {\n    width: 650px;\n  }\n}\n\n@media (min-width: 1024px) {\n  .app-creating-lessons__description {\n    width: 800px;\n  }\n}\n\n@media (min-width: 1280px) {\n  .app-creating-lessons__description {\n    width: 800px;\n  }\n}\n\n.app-creating-lessons__description-button {\n  margin-left: 20px !important;\n}\n\n.app-creating-lessons-form__field.mat-form-field {\n  display: -webkit-box;\n  display: flex;\n  -webkit-box-flex: 1;\n          flex: 1;\n}\n\n.app-creating-lessons-tabs {\n  padding: 30px 0;\n}\n\n.app-creating-lesson__iso-button {\n  margin: 20px 0 0 40px;\n}\n\n.app-creating-lesson__actions {\n  display: -webkit-box;\n  display: flex;\n  -webkit-box-align: center;\n          align-items: center;\n  padding: 20px 0;\n}\n\n.app-creating-lesson__hands_filter {\n  display: -webkit-box;\n  display: flex;\n  -webkit-box-orient: vertical;\n  -webkit-box-direction: normal;\n          flex-direction: column;\n  margin-left: 30px;\n}\n\n.app-creating-lesson__filter-value {\n  height: 30px;\n  display: -webkit-box;\n  display: flex;\n  -webkit-box-align: center;\n          align-items: center;\n  -webkit-box-pack: center;\n          justify-content: center;\n  font-family: \"Graphik\";\n  font-weight: normal;\n  font-style: normal;\n}\n\n.app-creating-lesson__filter-value_bordered {\n  border-bottom: 1px solid white;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3Byb2plY3RzL3ByZWZsb3AtaGVyby9zcmMvc3R5bGVzL3ZhcmlhYmxlcy5zY3NzIiwic3JjL2FwcC9tb2R1bGVzL2NoYXJ0cy9tb2R1bGVzL3BhY2tzL2NvbXBvbmVudHMvY3JlYXRpbmctbGVzc29uL2NyZWF0aW5nLWxlc3Nvbi5jb21wb25lbnQuc2NzcyIsIi9ob21lL3Byb2plY3RzL3ByZWZsb3AtaGVyby9zcmMvYXBwL21vZHVsZXMvY2hhcnRzL21vZHVsZXMvcGFja3MvY29tcG9uZW50cy9jcmVhdGluZy1sZXNzb24vY3JlYXRpbmctbGVzc29uLmNvbXBvbmVudC5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQWtGRTtFQURGO0lBRUksd0JBQUE7RUNoRkY7QUFDRjs7QUQwRkU7RUFPQTtJQUVJLHdCQUFBO0VDOUZKO0FBQ0Y7O0FEOEVFO0VBbUJBO0lBRUksd0JBQUE7RUM5Rko7QUFDRjs7QUQ4RUU7RUFPQTtJQUVJLHdCQUFBO0VDbEZKO0FBQ0Y7O0FEa0VFO0VBbUJBO0lBRUksd0JBQUE7RUNsRko7QUFDRjs7QURrRUU7RUFPQTtJQUVJLHdCQUFBO0VDdEVKO0FBQ0Y7O0FEc0RFO0VBbUJBO0lBRUksd0JBQUE7RUN0RUo7QUFDRjs7QURzREU7RUFPQTtJQUVJLHdCQUFBO0VDMURKO0FBQ0Y7O0FEMENFO0VBbUJBO0lBRUksd0JBQUE7RUMxREo7QUFDRjs7QUQwQ0U7RUFPQTtJQUVJLHdCQUFBO0VDOUNKO0FBQ0Y7O0FEOEJFO0VBbUJBO0lBRUksd0JBQUE7RUM5Q0o7QUFDRjs7QUQ4QkU7RUFPQTtJQUVJLHdCQUFBO0VDbENKO0FBQ0Y7O0FEa0JFO0VBbUJBO0lBRUksd0JBQUE7RUNsQ0o7QUFDRjs7QURrQkU7RUFPQTtJQUVJLHdCQUFBO0VDdEJKO0FBQ0Y7O0FETUU7RUFtQkE7SUFFSSx3QkFBQTtFQ3RCSjtBQUNGOztBRE1FO0VBT0E7SUFFSSx3QkFBQTtFQ1ZKO0FBQ0Y7O0FETkU7RUFtQkE7SUFFSSx3QkFBQTtFQ1ZKO0FBQ0Y7O0FETkU7RUFPQTtJQUVJLHdCQUFBO0VDRUo7QUFDRjs7QURsQkU7RUFtQkE7SUFFSSx3QkFBQTtFQ0VKO0FBQ0Y7O0FDOUdBO0VBQ0UsZUFBQTtBRGlIRjs7QUM5R0E7RUFDRSxlQUFBO0VBQ0EsVUFBQTtBRGlIRjs7QUM5R0E7RUFDRSxvQkFBQTtFQUFBLGFBQUE7RUFDQSxRQUFBO0VBQ0EsbUJBQUE7QURpSEY7O0FDOUdBO0VBQ0Usb0JBQUE7RUFBQSxhQUFBO0VBQ0EsUUFBQTtFQUNBLGtCQUFBO0FEaUhGOztBQzlHQTtFQUNFLGVBQUE7RUZPQSxzQkFVYztFQVRkLGdCQVN5QjtFQVJ6QixrQkFROEI7QUNtR2hDOztBQ2hIQTtFQUNFLGVBQUE7RUFDQSxjQUFBO0VBQ0EsY0YxQk07QUM2SVI7O0FDOUdFO0VBQ0UsV0FBQTtBRGlISjs7QUM1R0E7RUFDRSxnQkFBQTtFQUNBLG1CQUFBO0VBQ0EsbUJBQUE7RUFDQSx1QkFBQTtBRCtHRjs7QURyRUU7RUU5Q0Y7SUZnR0ksWUFBQTtFQ3VCRjtBQUNGOztBRDFFRTtFRTlDRjtJRm9HSSxZQUFBO0VDd0JGO0FBQ0Y7O0FEL0VFO0VFOUNGO0lGd0dJLFlBQUE7RUN5QkY7QUFDRjs7QURwRkU7RUU5Q0Y7SUY0R0ksWUFBQTtFQzBCRjtBQUNGOztBRHpGRTtFRTlDRjtJRmdISSxZQUFBO0VDMkJGO0FBQ0Y7O0FDcElBO0VBQ0UsNEJBQUE7QUR1SUY7O0FDbElFO0VBQ0Usb0JBQUE7RUFBQSxhQUFBO0VBQ0EsbUJBQUE7VUFBQSxPQUFBO0FEcUlKOztBQzdIQTtFQUNFLGVBQUE7QUQrSEY7O0FDNUhBO0VBQ0UscUJBQUE7QUQrSEY7O0FDNUhBO0VBQ0Usb0JBQUE7RUFBQSxhQUFBO0VBQ0EseUJBQUE7VUFBQSxtQkFBQTtFQUNBLGVBQUE7QUQrSEY7O0FDNUhBO0VBQ0Usb0JBQUE7RUFBQSxhQUFBO0VBQ0EsNEJBQUE7RUFBQSw2QkFBQTtVQUFBLHNCQUFBO0VBQ0EsaUJBQUE7QUQrSEY7O0FDNUhBO0VBQ0UsWUFBQTtFQUNBLG9CQUFBO0VBQUEsYUFBQTtFQUNBLHlCQUFBO1VBQUEsbUJBQUE7RUFDQSx3QkFBQTtVQUFBLHVCQUFBO0VGM0RBLHNCQWNjO0VBYmQsbUJBYXlCO0VBWnpCLGtCQVlpQztBQytLbkM7O0FDOUhBO0VBQ0UsOEJBQUE7QURpSUYiLCJmaWxlIjoic3JjL2FwcC9tb2R1bGVzL2NoYXJ0cy9tb2R1bGVzL3BhY2tzL2NvbXBvbmVudHMvY3JlYXRpbmctbGVzc29uL2NyZWF0aW5nLWxlc3Nvbi5jb21wb25lbnQuc2NzcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIGNvbG9yc1xuJGdyYXktMTogIzMwMzc0QTtcbiRncmF5LTI6ICM0ODRGNjI7XG4kZ3JheS0zOiAjNDg0RjYyO1xuXG4kZ3JlZW46ICMwMDk2ODg7XG4kZ3JlZW4tMjogIzQzQTA0NztcbiRncmVlbi0zOiAjMDBCNUE1O1xuXG4kd2hpdGU6ICNFRkYzRjY7XG4kd2hpdGUtMjogI0U3RUJFRTtcblxuJHJlZDogI0Q0MjY0NztcbiRyZWQtMjogI0ZGNkY2MDtcblxuJG9yYW5nZTogI0ZBQTMwRDtcblxuJGJsYWNrLTE6ICMyNjMyMzg7XG4kYmxhY2stMjogIzM3NDc0RjtcblxuJGNhcmQtY29sb3ItcmVkOiAjRUY1MzUwO1xuJGNhcmQtY29sb3ItYmxhY2s6ICM2MTYxNjE7XG4kY2FyZC1jb2xvci1ibHVlOiAjM0Y1MUI1O1xuJGNhcmQtY29sb3ItZ3JlZW46ICM0M0EwNDc7XG5cbi8vIHNoYWRvd1xuJHNoYWRvdy1ncmVlbjogIDAgMXB4IDNweCAwICRncmF5LTE7XG5cblxuLy8gZm9udHNcbkBtaXhpbiBmb250KCRmb250RmFtaWx5LCAkZm9udFdlaWdodCwgJGZvbnRTdHlsZSkge1xuICBmb250LWZhbWlseTogJGZvbnRGYW1pbHk7XG4gIGZvbnQtd2VpZ2h0OiAkZm9udFdlaWdodDtcbiAgZm9udC1zdHlsZTogJGZvbnRTdHlsZTtcbn1cblxuQG1peGluIGdyYXBoaWstYm9sZCgpIHtcbiAgQGluY2x1ZGUgZm9udCgnR3JhcGhpaycsIGJvbGQsIG5vcm1hbCk7XG59XG5cbkBtaXhpbiBncmFwaGlrLXNlbWlib2xkKCkge1xuICBAaW5jbHVkZSBmb250KCdHcmFwaGlrJywgNjAwLCBub3JtYWwpO1xufVxuXG5AbWl4aW4gZ3JhcGhpay1yZWd1bGFyKCkge1xuICBAaW5jbHVkZSBmb250KCdHcmFwaGlrJywgbm9ybWFsLCBub3JtYWwpO1xufVxuXG5AbWl4aW4gZ3JhcGhpay1zZW1pYm9sZC1pdGFsaWMoKSB7XG4gIEBpbmNsdWRlIGZvbnQoJ0dyYXBoaWsnLCA2MDAsIGl0YWxpYyk7XG59XG5cbkBtaXhpbiBncmFwaGlrLWxpZ2h0KCkge1xuICBAaW5jbHVkZSBmb250KCdHcmFwaGlrJywgNDAwLCBsaWdodCk7XG59XG5cbi8vc2NyZWVuIHNpemVzXG4kc2NyZWVuLW1zOiAzMjBweDtcbiRzY3JlZW4tbW06IDM2MHB4OyAvLyBmaXJzdFxuJHNjcmVlbi1tbDogNDgwcHg7IC8vICRzZWNvbmRcbiRzY3JlZW4tdHM6IDYwMHB4O1xuJHNjcmVlbi10bTogNzIwcHg7IC8vIHRoaXJkXG4kc2NyZWVuLXRsOiA5NjBweDtcbiRzY3JlZW4tZHM6IDEwMjRweDsgLy8gZm91cnRoXG4kc2NyZWVuLWRtOiAxMjgwcHg7IC8vIGZpZnRoXG4kc2NyZWVuLWRsOiAxNDQwcHg7XG5cblxuXG4kZ3JpZDogKFxuICAnbXMnOiAzMjBweCxcbiAgJ21tJzogMzYwcHgsXG4gICdtbCc6IDQ4MHB4LFxuICAndHMnOiA2MDBweCxcbiAgJ3RtJzogNzIwcHgsXG4gICd0bCc6IDk2MHB4LFxuICAnZHMnOiAxMDI0cHgsXG4gICdkbSc6IDEyODBweCxcbiAgJ2RsJzogMTQ0MHB4LFxuKTtcblxuLmhpZGRlbi1oZWlnaHQtZG93biB7XG4gIEBtZWRpYSAobWF4LWhlaWdodDogNTkwcHgpIHtcbiAgICBkaXNwbGF5OiBub25lICFpbXBvcnRhbnQ7XG4gIH1cbn1cblxuQG1peGluIGFib3ZlKCRicmVha3BvaW50cykge1xuICBAbWVkaWEgKG1pbi13aWR0aDogI3skYnJlYWtwb2ludHN9KSB7XG4gICAgQGNvbnRlbnQ7XG4gIH1cbn1cblxuQG1peGluIGJlbG93KCRicmVha3BvaW50cykge1xuICBAbWVkaWEgKG1heC13aWR0aDogI3skYnJlYWtwb2ludHN9KSB7XG4gICAgQGNvbnRlbnQ7XG4gIH1cbn1cblxuQGVhY2ggJGtleSwgJHZhbHVlIGluICRncmlkIHtcblxuICAuaGlkZGVuLSN7JGtleX0tZG93biB7XG4gICAgQGluY2x1ZGUgYmVsb3coI3skdmFsdWUgLSAxfSkge1xuICAgICAgZGlzcGxheTogbm9uZSAhaW1wb3J0YW50O1xuICAgIH1cbiAgfVxuXG4gIC5oaWRkZW4tI3ska2V5fS11cCB7XG4gICAgQGluY2x1ZGUgYWJvdmUoI3skdmFsdWV9KSB7XG4gICAgICBkaXNwbGF5OiBub25lICFpbXBvcnRhbnQ7XG4gICAgfVxuICB9XG59XG5cbkBtaXhpbiBhYm92ZVNjcmVlblNpemUoJHR5cGUsICRmaXJzdCwgJHNlY29uZCwgJHRoaXJkLCAkZm91cnRoLCAkZmlmdGgpIHtcbiAgQGluY2x1ZGUgYWJvdmUoJHNjcmVlbi1tbSkge1xuICAgICN7JHR5cGV9OiAkZmlyc3QgKyBweDtcbiAgfVxuXG4gIEBpbmNsdWRlIGFib3ZlKCRzY3JlZW4tbWwpIHtcbiAgICAjeyR0eXBlfTogJHNlY29uZCArIHB4O1xuICB9XG5cbiAgQGluY2x1ZGUgYWJvdmUoJHNjcmVlbi10bSkge1xuICAgICN7JHR5cGV9OiAkdGhpcmQgKyBweDtcbiAgfVxuXG4gIEBpbmNsdWRlIGFib3ZlKCRzY3JlZW4tZHMpIHtcbiAgICAjeyR0eXBlfTogJGZvdXJ0aCArIHB4O1xuICB9XG5cbiAgQGluY2x1ZGUgYWJvdmUoJHNjcmVlbi1kbSkge1xuICAgICN7JHR5cGV9OiAkZmlmdGggKyBweDtcbiAgfVxufVxuXG5AbWl4aW4gYWJvdmVTY3JlZW5TaXplV2l0aERpbWVuc2lvbigkdHlwZSwgJGZpcnN0LCAkc2Vjb25kLCAkdGhpcmQsICRmb3VydGgsICRmaWZ0aCwgJGRpbWVuc2lvbikge1xuICBAaW5jbHVkZSBhYm92ZSgkc2NyZWVuLW1tKSB7XG4gICAgI3skdHlwZX06ICRmaXJzdCArICRkaW1lbnNpb247XG4gIH1cblxuICBAaW5jbHVkZSBhYm92ZSgkc2NyZWVuLW1sKSB7XG4gICAgI3skdHlwZX06ICRzZWNvbmQgKyAkZGltZW5zaW9uO1xuICB9XG5cbiAgQGluY2x1ZGUgYWJvdmUoJHNjcmVlbi10bSkge1xuICAgICN7JHR5cGV9OiAkdGhpcmQgKyAkZGltZW5zaW9uO1xuICB9XG5cbiAgQGluY2x1ZGUgYWJvdmUoJHNjcmVlbi1kcykge1xuICAgICN7JHR5cGV9OiAkZm91cnRoICsgJGRpbWVuc2lvbjtcbiAgfVxuXG4gIEBpbmNsdWRlIGFib3ZlKCRzY3JlZW4tZG0pIHtcbiAgICAjeyR0eXBlfTogJGZpZnRoICsgJGRpbWVuc2lvbjtcbiAgfVxufVxuXG5AbWl4aW4gYmVsb3dTY3JlZW5TaXplKCR0eXBlLCAkZmlyc3QsICRzZWNvbmQsICR0aGlyZCwgJGZvdXJ0aCwgJGZpZnRoKSB7XG4gIEBpbmNsdWRlIGJlbG93KCRzY3JlZW4tbW0pIHtcbiAgICAjeyR0eXBlfTogJGZpcnN0ICsgcHg7XG4gIH1cblxuICBAaW5jbHVkZSBiZWxvdygkc2NyZWVuLW1sKSB7XG4gICAgI3skdHlwZX06ICRzZWNvbmQgKyBweDtcbiAgfVxuXG4gIEBpbmNsdWRlIGJlbG93KCRzY3JlZW4tdG0pIHtcbiAgICAjeyR0eXBlfTogJHRoaXJkICsgcHg7XG4gIH1cblxuICBAaW5jbHVkZSBiZWxvdygkc2NyZWVuLWRzKSB7XG4gICAgI3skdHlwZX06ICRmb3VydGggKyBweDtcbiAgfVxuXG4gIEBpbmNsdWRlIGJlbG93KCRzY3JlZW4tZG0pIHtcbiAgICAjeyR0eXBlfTogJGZpZnRoICsgcHg7XG4gIH1cbn1cblxuQG1peGluIGljb25TaXplU2NyZWVuU2l6ZSgkZmlyc3QsICRzZWNvbmQsICR0aGlyZCwgJGZvdXJ0aCwgJGZpZnRoKSB7XG4gIEBpbmNsdWRlIGFib3ZlKCRzY3JlZW4tbW0pIHtcbiAgICB3aWR0aDogJGZpcnN0ICsgcHggIWltcG9ydGFudDtcbiAgICBoZWlnaHQ6ICRmaXJzdCArIHB4ICFpbXBvcnRhbnQ7XG4gIH1cblxuICBAaW5jbHVkZSBhYm92ZSgkc2NyZWVuLW1sKSB7XG4gICAgd2lkdGg6ICRzZWNvbmQgKyBweCAhaW1wb3J0YW50O1xuICAgIGhlaWdodDogJHNlY29uZCArIHB4ICFpbXBvcnRhbnQ7XG4gIH1cblxuICBAaW5jbHVkZSBhYm92ZSgkc2NyZWVuLXRtKSB7XG4gICAgd2lkdGg6ICR0aGlyZCArIHB4ICFpbXBvcnRhbnQ7XG4gICAgaGVpZ2h0OiAkdGhpcmQgKyBweCAhaW1wb3J0YW50O1xuICB9XG5cbiAgQGluY2x1ZGUgYWJvdmUoJHNjcmVlbi1kcykge1xuICAgIHdpZHRoOiAkZm91cnRoICsgcHggIWltcG9ydGFudDtcbiAgICBoZWlnaHQ6ICRmb3VydGggKyBweCAhaW1wb3J0YW50O1xuICB9XG5cbiAgQGluY2x1ZGUgYWJvdmUoJHNjcmVlbi1kbSkge1xuICAgIHdpZHRoOiAkZmlmdGggKyBweCAhaW1wb3J0YW50O1xuICAgIGhlaWdodDogJGZpZnRoICsgcHggIWltcG9ydGFudDtcbiAgfVxufVxuXG5cbiIsIkBtZWRpYSAobWF4LWhlaWdodDogNTkwcHgpIHtcbiAgLmhpZGRlbi1oZWlnaHQtZG93biB7XG4gICAgZGlzcGxheTogbm9uZSAhaW1wb3J0YW50O1xuICB9XG59XG5cbkBtZWRpYSAobWF4LXdpZHRoOiAzMTlweCkge1xuICAuaGlkZGVuLW1zLWRvd24ge1xuICAgIGRpc3BsYXk6IG5vbmUgIWltcG9ydGFudDtcbiAgfVxufVxuXG5AbWVkaWEgKG1pbi13aWR0aDogMzIwcHgpIHtcbiAgLmhpZGRlbi1tcy11cCB7XG4gICAgZGlzcGxheTogbm9uZSAhaW1wb3J0YW50O1xuICB9XG59XG5cbkBtZWRpYSAobWF4LXdpZHRoOiAzNTlweCkge1xuICAuaGlkZGVuLW1tLWRvd24ge1xuICAgIGRpc3BsYXk6IG5vbmUgIWltcG9ydGFudDtcbiAgfVxufVxuXG5AbWVkaWEgKG1pbi13aWR0aDogMzYwcHgpIHtcbiAgLmhpZGRlbi1tbS11cCB7XG4gICAgZGlzcGxheTogbm9uZSAhaW1wb3J0YW50O1xuICB9XG59XG5cbkBtZWRpYSAobWF4LXdpZHRoOiA0NzlweCkge1xuICAuaGlkZGVuLW1sLWRvd24ge1xuICAgIGRpc3BsYXk6IG5vbmUgIWltcG9ydGFudDtcbiAgfVxufVxuXG5AbWVkaWEgKG1pbi13aWR0aDogNDgwcHgpIHtcbiAgLmhpZGRlbi1tbC11cCB7XG4gICAgZGlzcGxheTogbm9uZSAhaW1wb3J0YW50O1xuICB9XG59XG5cbkBtZWRpYSAobWF4LXdpZHRoOiA1OTlweCkge1xuICAuaGlkZGVuLXRzLWRvd24ge1xuICAgIGRpc3BsYXk6IG5vbmUgIWltcG9ydGFudDtcbiAgfVxufVxuXG5AbWVkaWEgKG1pbi13aWR0aDogNjAwcHgpIHtcbiAgLmhpZGRlbi10cy11cCB7XG4gICAgZGlzcGxheTogbm9uZSAhaW1wb3J0YW50O1xuICB9XG59XG5cbkBtZWRpYSAobWF4LXdpZHRoOiA3MTlweCkge1xuICAuaGlkZGVuLXRtLWRvd24ge1xuICAgIGRpc3BsYXk6IG5vbmUgIWltcG9ydGFudDtcbiAgfVxufVxuXG5AbWVkaWEgKG1pbi13aWR0aDogNzIwcHgpIHtcbiAgLmhpZGRlbi10bS11cCB7XG4gICAgZGlzcGxheTogbm9uZSAhaW1wb3J0YW50O1xuICB9XG59XG5cbkBtZWRpYSAobWF4LXdpZHRoOiA5NTlweCkge1xuICAuaGlkZGVuLXRsLWRvd24ge1xuICAgIGRpc3BsYXk6IG5vbmUgIWltcG9ydGFudDtcbiAgfVxufVxuXG5AbWVkaWEgKG1pbi13aWR0aDogOTYwcHgpIHtcbiAgLmhpZGRlbi10bC11cCB7XG4gICAgZGlzcGxheTogbm9uZSAhaW1wb3J0YW50O1xuICB9XG59XG5cbkBtZWRpYSAobWF4LXdpZHRoOiAxMDIzcHgpIHtcbiAgLmhpZGRlbi1kcy1kb3duIHtcbiAgICBkaXNwbGF5OiBub25lICFpbXBvcnRhbnQ7XG4gIH1cbn1cblxuQG1lZGlhIChtaW4td2lkdGg6IDEwMjRweCkge1xuICAuaGlkZGVuLWRzLXVwIHtcbiAgICBkaXNwbGF5OiBub25lICFpbXBvcnRhbnQ7XG4gIH1cbn1cblxuQG1lZGlhIChtYXgtd2lkdGg6IDEyNzlweCkge1xuICAuaGlkZGVuLWRtLWRvd24ge1xuICAgIGRpc3BsYXk6IG5vbmUgIWltcG9ydGFudDtcbiAgfVxufVxuXG5AbWVkaWEgKG1pbi13aWR0aDogMTI4MHB4KSB7XG4gIC5oaWRkZW4tZG0tdXAge1xuICAgIGRpc3BsYXk6IG5vbmUgIWltcG9ydGFudDtcbiAgfVxufVxuXG5AbWVkaWEgKG1heC13aWR0aDogMTQzOXB4KSB7XG4gIC5oaWRkZW4tZGwtZG93biB7XG4gICAgZGlzcGxheTogbm9uZSAhaW1wb3J0YW50O1xuICB9XG59XG5cbkBtZWRpYSAobWluLXdpZHRoOiAxNDQwcHgpIHtcbiAgLmhpZGRlbi1kbC11cCB7XG4gICAgZGlzcGxheTogbm9uZSAhaW1wb3J0YW50O1xuICB9XG59XG5cbi5hcHAtY3JlYXRpbmctbGVzc29uc19fY29udGFpbmVyIHtcbiAgcGFkZGluZzogMCAxNnB4O1xufVxuXG4uYXBwLWNyZWF0aW5nLWxlc3NvbnMtZm9ybSB7XG4gIHBhZGRpbmc6IDIwcHggMDtcbiAgd2lkdGg6IDUwJTtcbn1cblxuLmFwcC1jcmVhdGluZy1sZXNzb25zLWZvcm1fX3JvdyB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGdhcDogNnB4O1xuICBwYWRkaW5nLWJvdHRvbTogOHB4O1xufVxuXG4uYXBwLWNyZWF0aW5nLWxlc3NvbnMtZm9ybV9fcm93LTIge1xuICBkaXNwbGF5OiBmbGV4O1xuICBnYXA6IDZweDtcbiAgcGFkZGluZy1sZWZ0OiAxMnB4O1xufVxuXG4uYXBwLWNyZWF0aW5nLWxlc3NvbnMtZm9ybS10aXRsZSB7XG4gIGZvbnQtc2l6ZTogMThweDtcbiAgZm9udC1mYW1pbHk6IFwiR3JhcGhpa1wiO1xuICBmb250LXdlaWdodDogNjAwO1xuICBmb250LXN0eWxlOiBub3JtYWw7XG59XG5cbi5hcHAtY3JlYXRpbmctbGVzc29ucy1mb3JtLWxhYmVsIHtcbiAgZm9udC1zaXplOiAxNnB4O1xuICBwYWRkaW5nOiA4cHggMDtcbiAgY29sb3I6ICMwMDk2ODg7XG59XG5cbi5hcHAtY3JlYXRpbmctbGVzc29ucy1mb3JtX19maWVsZF9pbnB1dC5tYXQtZm9ybS1maWVsZCB7XG4gIHdpZHRoOiA5MHB4O1xufVxuXG4uYXBwLWNyZWF0aW5nLWxlc3NvbnNfX2Rlc2NyaXB0aW9uIHtcbiAgbWF4LXdpZHRoOiA4MDBweDtcbiAgdGV4dC1hbGlnbjoganVzdGlmeTtcbiAgbWFyZ2luLWJvdHRvbTogMjBweDtcbiAgZm9udC1mYW1pbHk6IHNhbnMtc2VyaWY7XG59XG5AbWVkaWEgKG1pbi13aWR0aDogMzYwcHgpIHtcbiAgLmFwcC1jcmVhdGluZy1sZXNzb25zX19kZXNjcmlwdGlvbiB7XG4gICAgd2lkdGg6IDMyNXB4O1xuICB9XG59XG5AbWVkaWEgKG1pbi13aWR0aDogNDgwcHgpIHtcbiAgLmFwcC1jcmVhdGluZy1sZXNzb25zX19kZXNjcmlwdGlvbiB7XG4gICAgd2lkdGg6IDMyNXB4O1xuICB9XG59XG5AbWVkaWEgKG1pbi13aWR0aDogNzIwcHgpIHtcbiAgLmFwcC1jcmVhdGluZy1sZXNzb25zX19kZXNjcmlwdGlvbiB7XG4gICAgd2lkdGg6IDY1MHB4O1xuICB9XG59XG5AbWVkaWEgKG1pbi13aWR0aDogMTAyNHB4KSB7XG4gIC5hcHAtY3JlYXRpbmctbGVzc29uc19fZGVzY3JpcHRpb24ge1xuICAgIHdpZHRoOiA4MDBweDtcbiAgfVxufVxuQG1lZGlhIChtaW4td2lkdGg6IDEyODBweCkge1xuICAuYXBwLWNyZWF0aW5nLWxlc3NvbnNfX2Rlc2NyaXB0aW9uIHtcbiAgICB3aWR0aDogODAwcHg7XG4gIH1cbn1cblxuLmFwcC1jcmVhdGluZy1sZXNzb25zX19kZXNjcmlwdGlvbi1idXR0b24ge1xuICBtYXJnaW4tbGVmdDogMjBweCAhaW1wb3J0YW50O1xufVxuXG4uYXBwLWNyZWF0aW5nLWxlc3NvbnMtZm9ybV9fZmllbGQubWF0LWZvcm0tZmllbGQge1xuICBkaXNwbGF5OiBmbGV4O1xuICBmbGV4OiAxO1xufVxuLmFwcC1jcmVhdGluZy1sZXNzb25zLXRhYnMge1xuICBwYWRkaW5nOiAzMHB4IDA7XG59XG5cbi5hcHAtY3JlYXRpbmctbGVzc29uX19pc28tYnV0dG9uIHtcbiAgbWFyZ2luOiAyMHB4IDAgMCA0MHB4O1xufVxuXG4uYXBwLWNyZWF0aW5nLWxlc3Nvbl9fYWN0aW9ucyB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIHBhZGRpbmc6IDIwcHggMDtcbn1cblxuLmFwcC1jcmVhdGluZy1sZXNzb25fX2hhbmRzX2ZpbHRlciB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gIG1hcmdpbi1sZWZ0OiAzMHB4O1xufVxuXG4uYXBwLWNyZWF0aW5nLWxlc3Nvbl9fZmlsdGVyLXZhbHVlIHtcbiAgaGVpZ2h0OiAzMHB4O1xuICBkaXNwbGF5OiBmbGV4O1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgZm9udC1mYW1pbHk6IFwiR3JhcGhpa1wiO1xuICBmb250LXdlaWdodDogbm9ybWFsO1xuICBmb250LXN0eWxlOiBub3JtYWw7XG59XG5cbi5hcHAtY3JlYXRpbmctbGVzc29uX19maWx0ZXItdmFsdWVfYm9yZGVyZWQge1xuICBib3JkZXItYm90dG9tOiAxcHggc29saWQgd2hpdGU7XG59IiwiQGltcG9ydCBcIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3N0eWxlcy92YXJpYWJsZXNcIjtcblxuLmFwcC1jcmVhdGluZy1sZXNzb25zX19jb250YWluZXIge1xuICBwYWRkaW5nOiAwIDE2cHg7XG59XG5cbi5hcHAtY3JlYXRpbmctbGVzc29ucy1mb3JtIHtcbiAgcGFkZGluZzogMjBweCAwO1xuICB3aWR0aDogNTAlO1xufVxuXG4uYXBwLWNyZWF0aW5nLWxlc3NvbnMtZm9ybV9fcm93IHtcbiAgZGlzcGxheTogZmxleDtcbiAgZ2FwOiA2cHg7XG4gIHBhZGRpbmctYm90dG9tOiA4cHg7XG59XG5cbi5hcHAtY3JlYXRpbmctbGVzc29ucy1mb3JtX19yb3ctMiB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGdhcDogNnB4O1xuICBwYWRkaW5nLWxlZnQ6IDEycHg7XG59XG5cbi5hcHAtY3JlYXRpbmctbGVzc29ucy1mb3JtLXRpdGxlIHtcbiAgZm9udC1zaXplOiAxOHB4O1xuICBAaW5jbHVkZSBncmFwaGlrLXNlbWlib2xkKCk7XG59XG5cbi5hcHAtY3JlYXRpbmctbGVzc29ucy1mb3JtLWxhYmVsIHtcbiAgZm9udC1zaXplOiAxNnB4O1xuICBwYWRkaW5nOiA4cHggMDtcbiAgY29sb3I6ICRncmVlbjtcbn1cblxuLmFwcC1jcmVhdGluZy1sZXNzb25zLWZvcm1fX2ZpZWxkX2lucHV0IHtcblxuICAmLm1hdC1mb3JtLWZpZWxkIHtcbiAgICB3aWR0aDogOTBweDtcbiAgfVxufVxuXG5cbi5hcHAtY3JlYXRpbmctbGVzc29uc19fZGVzY3JpcHRpb24ge1xuICBtYXgtd2lkdGg6IDgwMHB4O1xuICB0ZXh0LWFsaWduOiBqdXN0aWZ5O1xuICBtYXJnaW4tYm90dG9tOiAyMHB4O1xuICBmb250LWZhbWlseTogc2Fucy1zZXJpZjtcbiAgQGluY2x1ZGUgYWJvdmVTY3JlZW5TaXplV2l0aERpbWVuc2lvbih3aWR0aCwgMzI1LCAzMjUsIDY1MCwgODAwLCA4MDAsIHB4KTtcbn1cblxuLmFwcC1jcmVhdGluZy1sZXNzb25zX19kZXNjcmlwdGlvbi1idXR0b24ge1xuICBtYXJnaW4tbGVmdDogMjBweCAhaW1wb3J0YW50O1xufVxuXG4uYXBwLWNyZWF0aW5nLWxlc3NvbnMtZm9ybV9fZmllbGQge1xuXG4gICYubWF0LWZvcm0tZmllbGQge1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgZmxleDogMTtcblxuICAgICY6bm90KDpmaXJzdC1jaGlsZCkge1xuICAgICAgLy9tYXJnaW4tdG9wOiA4cHg7XG4gICAgfVxuICB9XG59XG5cbi5hcHAtY3JlYXRpbmctbGVzc29ucy10YWJzIHtcbiAgcGFkZGluZzogMzBweCAwO1xufVxuXG4uYXBwLWNyZWF0aW5nLWxlc3Nvbl9faXNvLWJ1dHRvbiB7XG4gIG1hcmdpbjogMjBweCAwIDAgNDBweDtcbn1cblxuLmFwcC1jcmVhdGluZy1sZXNzb25fX2FjdGlvbnMge1xuICBkaXNwbGF5OiBmbGV4O1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBwYWRkaW5nOiAyMHB4IDA7XG59XG5cbi5hcHAtY3JlYXRpbmctbGVzc29uX19oYW5kc19maWx0ZXIge1xuICBkaXNwbGF5OiBmbGV4O1xuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICBtYXJnaW4tbGVmdDogMzBweDtcbn1cblxuLmFwcC1jcmVhdGluZy1sZXNzb25fX2ZpbHRlci12YWx1ZSB7XG4gIGhlaWdodDogMzBweDtcbiAgZGlzcGxheTogZmxleDtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gIEBpbmNsdWRlIGdyYXBoaWstcmVndWxhcigpO1xufVxuXG4uYXBwLWNyZWF0aW5nLWxlc3Nvbl9fZmlsdGVyLXZhbHVlX2JvcmRlcmVkIHtcbiAgYm9yZGVyLWJvdHRvbTogMXB4IHNvbGlkIHdoaXRlO1xufVxuIl19 */");

/***/ }),

/***/ "./src/app/modules/charts/modules/packs/components/creating-lesson/creating-lesson.component.ts":
/*!******************************************************************************************************!*\
  !*** ./src/app/modules/charts/modules/packs/components/creating-lesson/creating-lesson.component.ts ***!
  \******************************************************************************************************/
/*! exports provided: CreatingLessonComponent, defaultCompareFn, trackById */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CreatingLessonComponent", function() { return CreatingLessonComponent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "defaultCompareFn", function() { return defaultCompareFn; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "trackById", function() { return trackById; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _angular_material_dialog__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/material/dialog */ "./node_modules/@angular/material/esm5/dialog.es5.js");
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/_esm5/index.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _services_app_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../../../../services/app.service */ "./src/app/services/app.service.ts");
/* harmony import */ var _services_charts_service__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../../services/charts.service */ "./src/app/modules/charts/services/charts.service.ts");
/* harmony import */ var _services_default_data_service__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../../../../../services/default-data.service */ "./src/app/services/default-data.service.ts");
/* harmony import */ var _modals_ranges_setting_ranges_setting_component__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../../../modals/ranges-setting/ranges-setting.component */ "./src/app/modules/charts/modals/ranges-setting/ranges-setting.component.ts");
/* harmony import */ var _services_user_service__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../../../../../services/user.service */ "./src/app/services/user.service.ts");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _shared_services_snackbar_service__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../../../../../../shared/services/snackbar.service */ "./src/app/shared/services/snackbar.service.ts");
/* harmony import */ var _modals_second_action_creating_dialog_second_action_creating_dialog_component__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../../../../modals/second-action-creating-dialog/second-action-creating-dialog.component */ "./src/app/modules/charts/modals/second-action-creating-dialog/second-action-creating-dialog.component.ts");
/* harmony import */ var _shared_modals_game_mode_hands_range_dialog_game_mode_hands_range_dialog_component__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../../../../../../shared/modals/game-mode-hands-range-dialog/game-mode-hands-range-dialog.component */ "./src/app/shared/modals/game-mode-hands-range-dialog/game-mode-hands-range-dialog.component.ts");



// material

// rxjs


// services



// components






var CreatingLessonComponent = /** @class */ (function () {
    function CreatingLessonComponent(appService, adminService, dialog, userService, snackbarService, router, route, defaultDataService, changeDetectorRef) {
        this.appService = appService;
        this.adminService = adminService;
        this.dialog = dialog;
        this.userService = userService;
        this.snackbarService = snackbarService;
        this.router = router;
        this.route = route;
        this.defaultDataService = defaultDataService;
        this.changeDetectorRef = changeDetectorRef;
        this.stackRanges = [];
        // compare functions
        this.compareGameTypesFn = defaultCompareFn;
        this.comparePositionsFn = defaultCompareFn;
        this.compareActionsFn = defaultCompareFn;
        this.compareOpponentsFn = defaultCompareFn;
        // track functions
        this.trackGameTypesFn = trackById;
        this.trackPositionsFn = trackById;
        this.trackActionsFn = trackById;
        this.currentAction = '';
        this.destroy$ = new rxjs__WEBPACK_IMPORTED_MODULE_4__["Subject"]();
        this.isDescriptionShown = false;
        this.description = '';
    }
    CreatingLessonComponent.prototype.ngOnInit = function () {
        this.appService.headerTitleTemplate = this.headerTitleTemplate;
        this.appService.headerActionsTemplate = this.headerActionsTemplate;
        this.initFormGroup();
        this.initDataSources();
        var savedRanges = this.adminService.getSavedRanges();
        if (savedRanges) {
            this.stackRanges = savedRanges;
            this.adminService.clearSavedRanges();
        }
    };
    CreatingLessonComponent.prototype.showDescription = function () {
        this.isDescriptionShown = !this.isDescriptionShown;
    };
    CreatingLessonComponent.prototype.openRangesSettingDialog = function () {
        var _this = this;
        if (!this.stackRanges.length) {
            this.stackRanges = this.getDefaultRanges();
        }
        var dialogRef = this.dialog.open(_modals_ranges_setting_ranges_setting_component__WEBPACK_IMPORTED_MODULE_9__["RangesSettingComponent"], {
            data: this.stackRanges,
            autoFocus: false,
            disableClose: true
        });
        dialogRef.afterClosed().pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_5__["filter"])(function (value) { return value; })).subscribe(function (ranges) {
            _this.stackRanges = ranges;
            _this.changeDetectorRef.detectChanges();
        });
    };
    CreatingLessonComponent.prototype.openAddSecondActionDialog = function (range) {
        var _this = this;
        var dialogRef = this.dialog.open(_modals_second_action_creating_dialog_second_action_creating_dialog_component__WEBPACK_IMPORTED_MODULE_13__["SecondActionCreatingDialogComponent"], {
            data: { isAllAvailable: range.charts.findIndex(function (chart) { return chart.secondAction === 0; }) === -1,
                isIsoAllAvailable: range.charts.findIndex(function (chart) { return chart.secondAction === 3; }) === -1 },
            autoFocus: false,
        });
        dialogRef.afterClosed().pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_5__["filter"])(function (value) { return value; })).subscribe(function (data) {
            switch (data.action.toLowerCase()) {
                case 'all-in':
                    range.charts.push({
                        secondAction: 0,
                        combinations: _this.defaultDataService.getEmptyChart(),
                        answers: _this.adminService.getDefaultVsAll()
                    });
                    break;
                case 'iso all-in':
                    range.charts.push({
                        secondAction: 3,
                        combinations: _this.defaultDataService.getEmptyChart(),
                        answers: _this.adminService.getDefaultVsAll()
                    });
                    break;
                case '3-bet':
                    range.charts.push({
                        secondActionFactor: data.factor,
                        secondAction: 1,
                        combinations: _this.defaultDataService.getEmptyChart(),
                        answers: _this.adminService.getDefaultVs3bet()
                    });
                    break;
                case 'iso':
                    range.charts.push({
                        secondActionFactor: data.factor,
                        secondAction: 2,
                        combinations: _this.defaultDataService.getEmptyChart(),
                        answers: _this.adminService.getDefaultVs3bet()
                    });
                    break;
            }
            _this.changeDetectorRef.detectChanges();
        });
    };
    CreatingLessonComponent.prototype.getSecondActionTitle = function (factor, secondAction) {
        var prefix = 'VS ' + this.defaultDataService.getSecondActionTitleById(secondAction);
        return factor ? prefix + ' x' + factor.toString() : prefix;
    };
    CreatingLessonComponent.prototype.onSubmitButtonClick = function () {
        var _this = this;
        this.fillEmptyCharts();
        this.isState = true;
        var newPlayersCount = this.formGroup.get('gameTypesCtrl').value.title === 'hu' ? 2 : 3;
        var newPositionTitle = this.formGroup.get('positionsCtrl').value.title;
        var newPosition = this.formGroup.get('positionsCtrl').value.id;
        var newAction = this.formGroup.get('actionsCtrl').value ? this.formGroup.get('actionsCtrl').value.id : null;
        var actionTitle = this.formGroup.get('actionsCtrl').value ? this.formGroup.get('actionsCtrl').value.title : '';
        var newTitle = this.formGroup.get('gameTypesCtrl').value.title + ' ' + newPositionTitle + ' ' + actionTitle
            + '[vs ' + this.formGroup.get('opponentsCtrl').value.type + ']';
        this.stackRanges[this.stackRanges.length - 1].rangeMax = 99;
        this.stackRanges[0].rangeMin = 1;
        var newOpponentsType = +this.formGroup.get('opponentsCtrl').value.id;
        var packId = this.route.snapshot.paramMap.get('packId');
        var sbStartPfr = this.formGroup.get('sbStartPfrCtrl').value || 0;
        var sbFinishPfr = this.formGroup.get('sbFinishPfrCtrl').value || 0;
        var bbStartPfr = this.formGroup.get('bbStartPfrCtrl').value || 0;
        var bbFinishPfr = this.formGroup.get('bbFinishPfrCtrl').value || 0;
        var btnStartPfr = this.formGroup.get('btnStartPfrCtrl').value || 0;
        var btnFinishPfr = this.formGroup.get('btnFinishPfrCtrl').value || 0;
        var newPfr = {
            sb: { start: sbStartPfr, finish: sbFinishPfr },
            bb: { start: bbStartPfr, finish: bbFinishPfr },
            btn: { start: btnStartPfr, finish: btnFinishPfr },
        };
        var newLesson = {
            title: newTitle, playersCount: newPlayersCount, position: newPosition,
            action: newAction, stackRanges: this.stackRanges, opponentsType: newOpponentsType,
            userId: this.userService.getUser().id, description: this.description, descriptionEn: this.description,
            groupId: +packId,
            pfr: newPfr,
        };
        this.adminService.createLesson(newLesson).subscribe(function () {
            _this.isState = false;
            _this.snackbarService.showMessage('New lesson created');
            _this.router.navigate(['charts', packId]);
        });
    };
    CreatingLessonComponent.prototype.fillEmptyCharts = function () {
        var e_1, _a, e_2, _b;
        try {
            for (var _c = tslib__WEBPACK_IMPORTED_MODULE_0__["__values"](this.stackRanges), _d = _c.next(); !_d.done; _d = _c.next()) {
                var range = _d.value;
                try {
                    for (var _e = (e_2 = void 0, tslib__WEBPACK_IMPORTED_MODULE_0__["__values"](range.charts)), _f = _e.next(); !_f.done; _f = _e.next()) {
                        var chart = _f.value;
                        for (var j = 0; j < chart.combinations.length; j++) {
                            if (chart.combinations[j].length < 5) {
                                chart.combinations[j] = this.fillCombinationAsFold(chart.combinations[j]);
                            }
                        }
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
            }
            finally { if (e_1) throw e_1.error; }
        }
    };
    CreatingLessonComponent.prototype.fillCombinationAsFold = function (combination) {
        var parts = combination.split(',');
        if (!parts[1]) {
            parts[1] = 'n';
            parts[2] = 'f';
        }
        return parts.join(',');
    };
    CreatingLessonComponent.prototype.initFormGroup = function () {
        var gameTypesCtrl = new _angular_forms__WEBPACK_IMPORTED_MODULE_2__["FormControl"](null, _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required);
        var positionsCtrl = new _angular_forms__WEBPACK_IMPORTED_MODULE_2__["FormControl"]({ value: null, disabled: true }, _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required);
        var actionsCtrl = new _angular_forms__WEBPACK_IMPORTED_MODULE_2__["FormControl"]({ value: null, disabled: true }, _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required);
        var opponentsCtrl = new _angular_forms__WEBPACK_IMPORTED_MODULE_2__["FormControl"]({ value: null, disabled: true }, _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required);
        var sbStartPfrCtrl = new _angular_forms__WEBPACK_IMPORTED_MODULE_2__["FormControl"](null);
        var sbFinishPfrCtrl = new _angular_forms__WEBPACK_IMPORTED_MODULE_2__["FormControl"](null);
        var bbStartPfrCtrl = new _angular_forms__WEBPACK_IMPORTED_MODULE_2__["FormControl"](null);
        var bbFinishPfrCtrl = new _angular_forms__WEBPACK_IMPORTED_MODULE_2__["FormControl"](null);
        var btnStartPfrCtrl = new _angular_forms__WEBPACK_IMPORTED_MODULE_2__["FormControl"](null);
        var btnFinishPfrCtrl = new _angular_forms__WEBPACK_IMPORTED_MODULE_2__["FormControl"](null);
        this.formGroup = new _angular_forms__WEBPACK_IMPORTED_MODULE_2__["FormGroup"]({
            gameTypesCtrl: gameTypesCtrl,
            positionsCtrl: positionsCtrl,
            actionsCtrl: actionsCtrl,
            opponentsCtrl: opponentsCtrl,
            sbStartPfrCtrl: sbStartPfrCtrl,
            sbFinishPfrCtrl: sbFinishPfrCtrl,
            bbStartPfrCtrl: bbStartPfrCtrl,
            bbFinishPfrCtrl: bbFinishPfrCtrl,
            btnStartPfrCtrl: btnStartPfrCtrl,
            btnFinishPfrCtrl: btnFinishPfrCtrl,
        });
    };
    CreatingLessonComponent.prototype.initDataSources = function () {
        // game types
        var _this = this;
        var gameTypesCtrl = this.formGroup.get('gameTypesCtrl');
        var selectedGameType$ = gameTypesCtrl.valueChanges;
        this.gameTypes$ = this.adminService.getGameTypes().pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_5__["tap"])(function (gameTypes) {
            gameTypes.sort(function (gameType1, gameType2) { return gameType1.title.localeCompare(gameType2.title); });
        }));
        // positions
        var positionsCtrl = this.formGroup.get('positionsCtrl');
        var opponentsCtrl = this.formGroup.get('opponentsCtrl');
        var selectedPositions$ = positionsCtrl.valueChanges;
        this.positions$ = selectedGameType$.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_5__["switchMap"])(function (gameType) {
            return _this.adminService.getPositions(gameType);
        }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_5__["map"])(function (positions) {
            return positions;
        }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_5__["tap"])(function (positions) {
            positions.sort(function (position1, position2) { return position1.title.localeCompare(position2.title); });
        }));
        this.opponentTypes$ = selectedGameType$.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_5__["switchMap"])(function (gameType) {
            return _this.adminService.getOpponentsTypes(gameType);
        }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_5__["map"])(function (opponents) {
            return opponents;
        }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_5__["tap"])(function (opponents) {
            opponents.sort(function (opponent1, opponent2) { return opponent1.type.localeCompare(opponent2.type); });
        }));
        // actions
        var actionsCtrl = this.formGroup.get('actionsCtrl');
        actionsCtrl.valueChanges.subscribe(function (newValue) {
            if (newValue !== null) {
                _this.currentAction = positionsCtrl.value.title + ' ' + newValue.title;
            }
        });
        this.actions$ = Object(rxjs__WEBPACK_IMPORTED_MODULE_4__["combineLatest"])(selectedGameType$, selectedPositions$).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_5__["switchMap"])(function (_a) {
            var _b = tslib__WEBPACK_IMPORTED_MODULE_0__["__read"](_a, 2), gameType = _b[0], position = _b[1];
            return gameType && position
                ? _this.adminService.getActions(gameType, position)
                : Object(rxjs__WEBPACK_IMPORTED_MODULE_4__["of"])([]);
        }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_5__["map"])(function (actions) {
            return actions;
        }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_5__["tap"])(function (actions) {
            if (!actions.length) {
                actionsCtrl.disable();
            }
            actions.sort(function (action1, action2) { return action1.title.localeCompare(action2.title); });
        }));
        selectedGameType$.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_5__["tap"])(function (gameType) {
            positionsCtrl.setValue(null);
            actionsCtrl.setValue(null);
            opponentsCtrl.setValue(null);
            if (gameType) {
                positionsCtrl.enable();
                opponentsCtrl.enable();
            }
            else {
                positionsCtrl.disable();
                opponentsCtrl.disable();
            }
        }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_5__["takeUntil"])(this.destroy$)).subscribe();
        selectedPositions$.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_5__["tap"])(function (position) {
            actionsCtrl.setValue(null);
            if (position) {
                actionsCtrl.enable();
            }
            else {
                actionsCtrl.setValue(null);
                actionsCtrl.disable();
            }
        }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_5__["takeUntil"])(this.destroy$)).subscribe();
        // pfr
        this.pfr$ = Object(rxjs__WEBPACK_IMPORTED_MODULE_4__["combineLatest"])(selectedGameType$, selectedPositions$).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_5__["map"])(function (_a) {
            var _b = tslib__WEBPACK_IMPORTED_MODULE_0__["__read"](_a, 2), gameType = _b[0], position = _b[1];
            if (gameType && position) {
                var chartGameType = _this.defaultDataService.chartGameTypes.find(function (gt) { return gt.id === gameType.id; });
                if (!chartGameType)
                    return [];
                var relevantChartPositions = _this.defaultDataService.chartPositions;
                if (gameType.title.toLowerCase() === 'hu') {
                    relevantChartPositions = _this.defaultDataService.chartPositions.slice(0, 2);
                }
                var filteredPositions = relevantChartPositions.filter(function (p) { return p.title.toLowerCase() !== position.title.toLowerCase(); });
                return filteredPositions.map(function (p) { return ({
                    position: p.title,
                    start: '0',
                    finish: '0'
                }); });
            }
        }));
    };
    CreatingLessonComponent.prototype.onSecondActionDeleted = function (range, index) {
        range.charts.splice(index, 1);
    };
    CreatingLessonComponent.prototype.generateRangeLabel = function (min, max) {
        var label = '';
        if (min) {
            label += min.toString();
        }
        if (max) {
            label += ' - ' + max.toString();
        }
        return label;
    };
    CreatingLessonComponent.prototype.getDefaultRanges = function () {
        return [
            {
                rangeMin: 1,
                rangeMax: 9,
                charts: [{
                        secondAction: null,
                        combinations: this.defaultDataService.getEmptyChart(),
                        answers: this.adminService.getDefaultAnswers(),
                    }],
                easy: 1,
                normal: 1,
                hard: 1,
            },
            {
                rangeMin: 10,
                rangeMax: 19,
                charts: [{
                        secondAction: null,
                        combinations: this.defaultDataService.getEmptyChart(),
                        answers: this.adminService.getDefaultAnswers(),
                    }],
                easy: 1,
                normal: 1,
                hard: 1,
            },
            {
                rangeMin: 20,
                rangeMax: 99,
                charts: [{
                        secondAction: null,
                        combinations: this.defaultDataService.getEmptyChart(),
                        answers: this.adminService.getDefaultAnswers(),
                    }],
                easy: 1,
                normal: 1,
                hard: 1,
            }
        ];
    };
    CreatingLessonComponent.prototype.openHandsFilter = function (range, chosenTitle, id, mode) {
        var dialogRef = this.dialog.open(_shared_modals_game_mode_hands_range_dialog_game_mode_hands_range_dialog_component__WEBPACK_IMPORTED_MODULE_14__["GameModeHandsRangeDialogComponent"], {
            data: {
                currentHandsRangeId: id,
                title: chosenTitle
            },
            autoFocus: false,
        });
        dialogRef.afterClosed().pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_5__["filter"])(function (value) { return value; })).subscribe(function (newId) {
            switch (mode) {
                case 0:
                    range.easy = newId;
                    break;
                case 1:
                    range.normal = newId;
                    break;
                case 2:
                    range.hard = newId;
                    break;
            }
        });
    };
    CreatingLessonComponent.prototype.ngOnDestroy = function () {
        this.destroy$.next();
        this.destroy$.unsubscribe();
        this.appService.headerTitleTemplate = null;
        this.appService.headerActionsTemplate = null;
    };
    CreatingLessonComponent.ctorParameters = function () { return [
        { type: _services_app_service__WEBPACK_IMPORTED_MODULE_6__["AppService"] },
        { type: _services_charts_service__WEBPACK_IMPORTED_MODULE_7__["ChartsService"] },
        { type: _angular_material_dialog__WEBPACK_IMPORTED_MODULE_3__["MatDialog"] },
        { type: _services_user_service__WEBPACK_IMPORTED_MODULE_10__["UserService"] },
        { type: _shared_services_snackbar_service__WEBPACK_IMPORTED_MODULE_12__["SnackbarService"] },
        { type: _angular_router__WEBPACK_IMPORTED_MODULE_11__["Router"] },
        { type: _angular_router__WEBPACK_IMPORTED_MODULE_11__["ActivatedRoute"] },
        { type: _services_default_data_service__WEBPACK_IMPORTED_MODULE_8__["DefaultDataService"] },
        { type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["ChangeDetectorRef"] }
    ]; };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"])('headerTitleTemplate', { static: true })
    ], CreatingLessonComponent.prototype, "headerTitleTemplate", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"])('headerActionsTemplate', { static: true })
    ], CreatingLessonComponent.prototype, "headerActionsTemplate", void 0);
    CreatingLessonComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-creating-lesson',
            template: tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(/*! raw-loader!./creating-lesson.component.html */ "./node_modules/raw-loader/dist/cjs.js!./src/app/modules/charts/modules/packs/components/creating-lesson/creating-lesson.component.html")).default,
            changeDetection: _angular_core__WEBPACK_IMPORTED_MODULE_1__["ChangeDetectionStrategy"].OnPush,
            styles: [tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(/*! ./creating-lesson.component.scss */ "./src/app/modules/charts/modules/packs/components/creating-lesson/creating-lesson.component.scss")).default]
        })
    ], CreatingLessonComponent);
    return CreatingLessonComponent;
}());

function defaultCompareFn(compared1, compared2) {
    return compared1 && compared2 ? compared1.id === compared2.id : compared1 === compared2;
}
function trackById(index, _a) {
    var id = _a.id;
    return id;
}


/***/ }),

/***/ "./src/app/modules/charts/modules/packs/components/creating-mixed-lesson/creating-mixed-lesson.component.scss":
/*!********************************************************************************************************************!*\
  !*** ./src/app/modules/charts/modules/packs/components/creating-mixed-lesson/creating-mixed-lesson.component.scss ***!
  \********************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = (".app-creating-lessons__container {\n  padding: 0 16px;\n}\n\n.app-creating-lessons-form {\n  padding: 30px 0 10px 0;\n  -webkit-box-orient: vertical;\n  -webkit-box-direction: normal;\n          flex-direction: column;\n  display: -webkit-box;\n  display: flex;\n  width: 350px;\n}\n\n.app-creating-lessons-form__field {\n  margin-top: 8px;\n}\n\n.app-creating-lessons-form__field.mat-form-field {\n  display: -webkit-box;\n  display: flex;\n  -webkit-box-flex: 1;\n          flex: 1;\n}\n\n.app-creating-lessons-form__custom-range {\n  margin-bottom: 8px;\n}\n\n.app-creating-lessons-stars-form__field {\n  display: -webkit-box;\n  display: flex;\n}\n\n.app-creating-lessons-stars-form__field.mat-form-field {\n  display: -webkit-box;\n  display: flex;\n  -webkit-box-flex: 1;\n          flex: 1;\n  padding: 0 10px !important;\n}\n\n.app-creating-lessons-form__field_mt-10 {\n  margin-top: 10px;\n}\n\n.app-creating-lessons-form__field_mt-16 {\n  margin-top: 16px;\n}\n\n.app-edit-mixed-lesson__list {\n  margin-bottom: 20px;\n}\n\n.app-edit-mixed-lesson__list-item {\n  margin: 8px 0;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3Byb2plY3RzL3ByZWZsb3AtaGVyby9zcmMvc3R5bGVzL2FwcC1jcmVhdGluZy1taXhlZC1sZXNzb24vYXBwLWNyZWF0aW5nLW1peGVkLWxlc3Nvbi5zY3NzIiwic3JjL2FwcC9tb2R1bGVzL2NoYXJ0cy9tb2R1bGVzL3BhY2tzL2NvbXBvbmVudHMvY3JlYXRpbmctbWl4ZWQtbGVzc29uL2NyZWF0aW5nLW1peGVkLWxlc3Nvbi5jb21wb25lbnQuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUNFLGVBQUE7QUNDRjs7QURFQTtFQUNFLHNCQUFBO0VBQ0EsNEJBQUE7RUFBQSw2QkFBQTtVQUFBLHNCQUFBO0VBQ0Esb0JBQUE7RUFBQSxhQUFBO0VBQ0EsWUFBQTtBQ0NGOztBREVBO0VBQ0UsZUFBQTtBQ0NGOztBRENFO0VBQ0Usb0JBQUE7RUFBQSxhQUFBO0VBQ0EsbUJBQUE7VUFBQSxPQUFBO0FDQ0o7O0FET0E7RUFDRSxrQkFBQTtBQ0xGOztBRFFBO0VBRUUsb0JBQUE7RUFBQSxhQUFBO0FDTkY7O0FEUUU7RUFDRSxvQkFBQTtFQUFBLGFBQUE7RUFDQSxtQkFBQTtVQUFBLE9BQUE7RUFDQSwwQkFBQTtBQ05KOztBRGNBO0VBQ0UsZ0JBQUE7QUNaRjs7QURlQTtFQUNFLGdCQUFBO0FDWkY7O0FEZUE7RUFDRSxtQkFBQTtBQ1pGOztBRGVBO0VBQ0UsYUFBQTtBQ1pGIiwiZmlsZSI6InNyYy9hcHAvbW9kdWxlcy9jaGFydHMvbW9kdWxlcy9wYWNrcy9jb21wb25lbnRzL2NyZWF0aW5nLW1peGVkLWxlc3Nvbi9jcmVhdGluZy1taXhlZC1sZXNzb24uY29tcG9uZW50LnNjc3MiLCJzb3VyY2VzQ29udGVudCI6WyIuYXBwLWNyZWF0aW5nLWxlc3NvbnNfX2NvbnRhaW5lciB7XG4gIHBhZGRpbmc6IDAgMTZweDtcbn1cblxuLmFwcC1jcmVhdGluZy1sZXNzb25zLWZvcm0ge1xuICBwYWRkaW5nOiAzMHB4IDAgMTBweCAwO1xuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICBkaXNwbGF5OiBmbGV4O1xuICB3aWR0aDogMzUwcHg7XG59XG5cbi5hcHAtY3JlYXRpbmctbGVzc29ucy1mb3JtX19maWVsZCB7XG4gIG1hcmdpbi10b3A6IDhweDtcblxuICAmLm1hdC1mb3JtLWZpZWxkIHtcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIGZsZXg6IDE7XG5cbiAgICAmOm5vdCg6Zmlyc3QtY2hpbGQpIHtcbiAgICAgIC8vbWFyZ2luLXRvcDogOHB4O1xuICAgIH1cbiAgfVxufVxuXG4uYXBwLWNyZWF0aW5nLWxlc3NvbnMtZm9ybV9fY3VzdG9tLXJhbmdlIHtcbiAgbWFyZ2luLWJvdHRvbTogOHB4O1xufVxuXG4uYXBwLWNyZWF0aW5nLWxlc3NvbnMtc3RhcnMtZm9ybV9fZmllbGQge1xuXG4gIGRpc3BsYXk6IGZsZXg7XG5cbiAgJi5tYXQtZm9ybS1maWVsZCB7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBmbGV4OiAxO1xuICAgIHBhZGRpbmc6IDAgMTBweCAhaW1wb3J0YW50O1xuXG4gICAgJjpub3QoOmZpcnN0LWNoaWxkKSB7XG4gICAgICAvL21hcmdpbi10b3A6IDhweDtcbiAgICB9XG4gIH1cbn1cblxuLmFwcC1jcmVhdGluZy1sZXNzb25zLWZvcm1fX2ZpZWxkX210LTEwIHtcbiAgbWFyZ2luLXRvcDogMTBweDtcbn1cblxuLmFwcC1jcmVhdGluZy1sZXNzb25zLWZvcm1fX2ZpZWxkX210LTE2IHtcbiAgbWFyZ2luLXRvcDogMTZweDtcbn1cblxuLmFwcC1lZGl0LW1peGVkLWxlc3Nvbl9fbGlzdCB7XG4gIG1hcmdpbi1ib3R0b206IDIwcHg7XG59XG5cbi5hcHAtZWRpdC1taXhlZC1sZXNzb25fX2xpc3QtaXRlbSB7XG4gIG1hcmdpbjogOHB4IDA7XG59XG4iLCIuYXBwLWNyZWF0aW5nLWxlc3NvbnNfX2NvbnRhaW5lciB7XG4gIHBhZGRpbmc6IDAgMTZweDtcbn1cblxuLmFwcC1jcmVhdGluZy1sZXNzb25zLWZvcm0ge1xuICBwYWRkaW5nOiAzMHB4IDAgMTBweCAwO1xuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICBkaXNwbGF5OiBmbGV4O1xuICB3aWR0aDogMzUwcHg7XG59XG5cbi5hcHAtY3JlYXRpbmctbGVzc29ucy1mb3JtX19maWVsZCB7XG4gIG1hcmdpbi10b3A6IDhweDtcbn1cbi5hcHAtY3JlYXRpbmctbGVzc29ucy1mb3JtX19maWVsZC5tYXQtZm9ybS1maWVsZCB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGZsZXg6IDE7XG59XG4uYXBwLWNyZWF0aW5nLWxlc3NvbnMtZm9ybV9fY3VzdG9tLXJhbmdlIHtcbiAgbWFyZ2luLWJvdHRvbTogOHB4O1xufVxuXG4uYXBwLWNyZWF0aW5nLWxlc3NvbnMtc3RhcnMtZm9ybV9fZmllbGQge1xuICBkaXNwbGF5OiBmbGV4O1xufVxuLmFwcC1jcmVhdGluZy1sZXNzb25zLXN0YXJzLWZvcm1fX2ZpZWxkLm1hdC1mb3JtLWZpZWxkIHtcbiAgZGlzcGxheTogZmxleDtcbiAgZmxleDogMTtcbiAgcGFkZGluZzogMCAxMHB4ICFpbXBvcnRhbnQ7XG59XG4uYXBwLWNyZWF0aW5nLWxlc3NvbnMtZm9ybV9fZmllbGRfbXQtMTAge1xuICBtYXJnaW4tdG9wOiAxMHB4O1xufVxuXG4uYXBwLWNyZWF0aW5nLWxlc3NvbnMtZm9ybV9fZmllbGRfbXQtMTYge1xuICBtYXJnaW4tdG9wOiAxNnB4O1xufVxuXG4uYXBwLWVkaXQtbWl4ZWQtbGVzc29uX19saXN0IHtcbiAgbWFyZ2luLWJvdHRvbTogMjBweDtcbn1cblxuLmFwcC1lZGl0LW1peGVkLWxlc3Nvbl9fbGlzdC1pdGVtIHtcbiAgbWFyZ2luOiA4cHggMDtcbn0iXX0= */");

/***/ }),

/***/ "./src/app/modules/charts/modules/packs/components/creating-mixed-lesson/creating-mixed-lesson.component.ts":
/*!******************************************************************************************************************!*\
  !*** ./src/app/modules/charts/modules/packs/components/creating-mixed-lesson/creating-mixed-lesson.component.ts ***!
  \******************************************************************************************************************/
/*! exports provided: CreatingMixedLessonComponent, defaultCompareFn, trackById, compareIndex */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CreatingMixedLessonComponent", function() { return CreatingMixedLessonComponent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "defaultCompareFn", function() { return defaultCompareFn; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "trackById", function() { return trackById; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "compareIndex", function() { return compareIndex; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _services_app_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../../../../services/app.service */ "./src/app/services/app.service.ts");
/* harmony import */ var _services_charts_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../../services/charts.service */ "./src/app/modules/charts/services/charts.service.ts");
/* harmony import */ var _services_user_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../../../../services/user.service */ "./src/app/services/user.service.ts");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _shared_services_snackbar_service__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../../../../../shared/services/snackbar.service */ "./src/app/shared/services/snackbar.service.ts");
/* harmony import */ var _training_services_lesson_service__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../../../../training/services/lesson.service */ "./src/app/modules/training/services/lesson.service.ts");
/* harmony import */ var _services_default_data_service__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../../../../../services/default-data.service */ "./src/app/services/default-data.service.ts");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");












var CreatingMixedLessonComponent = /** @class */ (function () {
    function CreatingMixedLessonComponent(appService, adminService, userService, route, snackbarService, router, lessonService, defaultDataService, location) {
        this.appService = appService;
        this.adminService = adminService;
        this.userService = userService;
        this.route = route;
        this.snackbarService = snackbarService;
        this.router = router;
        this.lessonService = lessonService;
        this.defaultDataService = defaultDataService;
        this.location = location;
        // compare functions
        this.compareLessonsFn = defaultCompareFn;
        // track functions
        this.trackLessonsFn = trackById;
        this.customRangeMin = [];
        this.customRangeMax = [];
        this.compareIndex = compareIndex;
        this.trackChartGroupFn = trackById;
        this.packId = this.route.snapshot.paramMap.get('packId');
        this.user = this.userService.getUser();
    }
    CreatingMixedLessonComponent.prototype.ngOnInit = function () {
        this.appService.headerTitleTemplate = this.headerTitleTemplate;
        this.gameModes = this.defaultDataService.getGameModes();
        this.initFormGroup();
        this.generateCustomRange();
    };
    CreatingMixedLessonComponent.prototype.ngOnDestroy = function () {
        this.appService.headerTitleTemplate = null;
    };
    CreatingMixedLessonComponent.prototype.onSubmitButtonClick = function () {
        var _this = this;
        var newTitle = this.formGroup.get('titleCtrl').value;
        var lessons = this.formGroup.get('lessonsCtrl').value.map(function (lesson) { return lesson.id; });
        var chapter = this.formGroup.get('chapterCtrl').value.id;
        var countHands = this.formGroup.get('countHandsCtrl').value;
        var star1 = this.formGroup.get('star1Ctrl').value;
        var star2 = this.formGroup.get('star2Ctrl').value;
        var star3 = this.formGroup.get('star3Ctrl').value;
        var newLesson = {
            title: newTitle,
            taskIds: lessons,
            chapterId: chapter,
            groupId: +this.packId,
            stackMin: +this.customRangeMinCtrl.value,
            stackMax: +this.customRangeMaxCtrl.value,
            mode: this.gameModeCtrl.value.title,
            countHands: countHands,
            star1: star1,
            star2: star2,
            star3: star3,
        };
        this.adminService.createMixedLesson(newLesson).subscribe(function () {
            _this.snackbarService.showMessage('New lesson created');
            // this.router.navigate(['charts']);
            _this.location.back();
        });
    };
    CreatingMixedLessonComponent.prototype.initFormGroup = function () {
        var titleCtrl = new _angular_forms__WEBPACK_IMPORTED_MODULE_2__["FormControl"](null, _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required);
        var lessonsCtrl = new _angular_forms__WEBPACK_IMPORTED_MODULE_2__["FormControl"](null, _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required);
        var chapterCtrl = new _angular_forms__WEBPACK_IMPORTED_MODULE_2__["FormControl"](null, _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required);
        this.gameModeCtrl = new _angular_forms__WEBPACK_IMPORTED_MODULE_2__["FormControl"](this.gameModes[0], _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required);
        this.customRangeMinCtrl = new _angular_forms__WEBPACK_IMPORTED_MODULE_2__["FormControl"](1, _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required);
        this.customRangeMaxCtrl = new _angular_forms__WEBPACK_IMPORTED_MODULE_2__["FormControl"](25, _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required);
        var countHandsCtrl = new _angular_forms__WEBPACK_IMPORTED_MODULE_2__["FormControl"](null, _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required);
        var star1Ctrl = new _angular_forms__WEBPACK_IMPORTED_MODULE_2__["FormControl"](null, _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required);
        var star2Ctrl = new _angular_forms__WEBPACK_IMPORTED_MODULE_2__["FormControl"](null, _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required);
        var star3Ctrl = new _angular_forms__WEBPACK_IMPORTED_MODULE_2__["FormControl"](null, _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required);
        this.formGroup = new _angular_forms__WEBPACK_IMPORTED_MODULE_2__["FormGroup"]({
            titleCtrl: titleCtrl,
            lessonsCtrl: lessonsCtrl,
            chapterCtrl: chapterCtrl,
            countHandsCtrl: countHandsCtrl,
            star1Ctrl: star1Ctrl,
            star2Ctrl: star2Ctrl,
            star3Ctrl: star3Ctrl,
        });
        this.lessons$ = this.adminService.getChartGroup(+this.packId, this.user.id).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_3__["map"])(function (data) { return data.charts; }));
        this.chapters$ = this.adminService.getChapters(this.packId);
        countHandsCtrl.valueChanges.subscribe(function () {
            star1Ctrl.setValidators(_angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].max(countHandsCtrl.value));
            star1Ctrl.updateValueAndValidity();
        });
        star1Ctrl.valueChanges.subscribe(function () {
            star2Ctrl.setValidators([_angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].max(countHandsCtrl.value), _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].min(star1Ctrl.value + 1)]);
            star2Ctrl.updateValueAndValidity();
        });
        star2Ctrl.valueChanges.subscribe(function () {
            star3Ctrl.setValidators([_angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].max(countHandsCtrl.value), _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].min(star2Ctrl.value + 1)]);
            star3Ctrl.updateValueAndValidity();
        });
    };
    CreatingMixedLessonComponent.prototype.generateCustomRange = function () {
        this.customRangeMin = this.findRange(1, 25);
        this.customRangeMax = this.findRange(2, 25);
        this.customRangeMinCtrl = new _angular_forms__WEBPACK_IMPORTED_MODULE_2__["FormControl"](this.customRangeMin[0], _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required);
        this.customRangeMaxCtrl = new _angular_forms__WEBPACK_IMPORTED_MODULE_2__["FormControl"](this.customRangeMax[this.customRangeMax.length - 1], _angular_forms__WEBPACK_IMPORTED_MODULE_2__["Validators"].required);
    };
    CreatingMixedLessonComponent.prototype.findRange = function (start, end) {
        return Array.from(Array(1 + end - start).keys()).map(function (v) { return start + v; });
    };
    CreatingMixedLessonComponent.prototype.onChangedMinRange = function (event) {
        this.customRangeMinCtrl.setValue(event);
    };
    CreatingMixedLessonComponent.prototype.onChangedMaxRange = function (event) {
        this.customRangeMaxCtrl.setValue(event);
    };
    CreatingMixedLessonComponent.ctorParameters = function () { return [
        { type: _services_app_service__WEBPACK_IMPORTED_MODULE_4__["AppService"] },
        { type: _services_charts_service__WEBPACK_IMPORTED_MODULE_5__["ChartsService"] },
        { type: _services_user_service__WEBPACK_IMPORTED_MODULE_6__["UserService"] },
        { type: _angular_router__WEBPACK_IMPORTED_MODULE_7__["ActivatedRoute"] },
        { type: _shared_services_snackbar_service__WEBPACK_IMPORTED_MODULE_8__["SnackbarService"] },
        { type: _angular_router__WEBPACK_IMPORTED_MODULE_7__["Router"] },
        { type: _training_services_lesson_service__WEBPACK_IMPORTED_MODULE_9__["LessonService"] },
        { type: _services_default_data_service__WEBPACK_IMPORTED_MODULE_10__["DefaultDataService"] },
        { type: _angular_common__WEBPACK_IMPORTED_MODULE_11__["Location"] }
    ]; };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"])('headerTitleTemplate', { static: true })
    ], CreatingMixedLessonComponent.prototype, "headerTitleTemplate", void 0);
    CreatingMixedLessonComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-creating-mixed-lesson',
            template: tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(/*! raw-loader!./creating-mixed-lesson.component.html */ "./node_modules/raw-loader/dist/cjs.js!./src/app/modules/charts/modules/packs/components/creating-mixed-lesson/creating-mixed-lesson.component.html")).default,
            styles: [tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(/*! ./creating-mixed-lesson.component.scss */ "./src/app/modules/charts/modules/packs/components/creating-mixed-lesson/creating-mixed-lesson.component.scss")).default]
        })
    ], CreatingMixedLessonComponent);
    return CreatingMixedLessonComponent;
}());

function defaultCompareFn(compared1, compared2) {
    return compared1 && compared2 ? compared1.id === compared2.id : compared1 === compared2;
}
function trackById(index, _a) {
    var id = _a.id;
    return id;
}
function compareIndex(c1, c2) {
    return c1 && c2 ? c1 === c2 : c1 === c2;
}


/***/ }),

/***/ "./src/app/modules/charts/modules/packs/components/edit-lesson/edit-lesson.component.scss":
/*!************************************************************************************************!*\
  !*** ./src/app/modules/charts/modules/packs/components/edit-lesson/edit-lesson.component.scss ***!
  \************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("@media (max-height: 590px) {\n  .hidden-height-down {\n    display: none !important;\n  }\n}\n\n@media (max-width: 319px) {\n  .hidden-ms-down {\n    display: none !important;\n  }\n}\n\n@media (min-width: 320px) {\n  .hidden-ms-up {\n    display: none !important;\n  }\n}\n\n@media (max-width: 359px) {\n  .hidden-mm-down {\n    display: none !important;\n  }\n}\n\n@media (min-width: 360px) {\n  .hidden-mm-up {\n    display: none !important;\n  }\n}\n\n@media (max-width: 479px) {\n  .hidden-ml-down {\n    display: none !important;\n  }\n}\n\n@media (min-width: 480px) {\n  .hidden-ml-up {\n    display: none !important;\n  }\n}\n\n@media (max-width: 599px) {\n  .hidden-ts-down {\n    display: none !important;\n  }\n}\n\n@media (min-width: 600px) {\n  .hidden-ts-up {\n    display: none !important;\n  }\n}\n\n@media (max-width: 719px) {\n  .hidden-tm-down {\n    display: none !important;\n  }\n}\n\n@media (min-width: 720px) {\n  .hidden-tm-up {\n    display: none !important;\n  }\n}\n\n@media (max-width: 959px) {\n  .hidden-tl-down {\n    display: none !important;\n  }\n}\n\n@media (min-width: 960px) {\n  .hidden-tl-up {\n    display: none !important;\n  }\n}\n\n@media (max-width: 1023px) {\n  .hidden-ds-down {\n    display: none !important;\n  }\n}\n\n@media (min-width: 1024px) {\n  .hidden-ds-up {\n    display: none !important;\n  }\n}\n\n@media (max-width: 1279px) {\n  .hidden-dm-down {\n    display: none !important;\n  }\n}\n\n@media (min-width: 1280px) {\n  .hidden-dm-up {\n    display: none !important;\n  }\n}\n\n@media (max-width: 1439px) {\n  .hidden-dl-down {\n    display: none !important;\n  }\n}\n\n@media (min-width: 1440px) {\n  .hidden-dl-up {\n    display: none !important;\n  }\n}\n\n.app-edit-lesson {\n  padding: 16px;\n}\n\n.app-creating-lesson__iso-button {\n  margin: 20px 0 0 40px;\n}\n\n.app-edit-lesson__description-button {\n  margin-left: 20px !important;\n}\n\n.app-edit-lesson__description {\n  max-width: 800px;\n  text-align: justify;\n  margin-bottom: 20px;\n  font-family: sans-serif;\n}\n\n@media (min-width: 360px) {\n  .app-edit-lesson__description {\n    width: 325px;\n  }\n}\n\n@media (min-width: 480px) {\n  .app-edit-lesson__description {\n    width: 325px;\n  }\n}\n\n@media (min-width: 720px) {\n  .app-edit-lesson__description {\n    width: 650px;\n  }\n}\n\n@media (min-width: 1024px) {\n  .app-edit-lesson__description {\n    width: 800px;\n  }\n}\n\n@media (min-width: 1280px) {\n  .app-edit-lesson__description {\n    width: 800px;\n  }\n}\n\n.app-edit-lesson__description_cursive {\n  font-style: italic;\n}\n\n.app-creating-lesson__actions {\n  display: -webkit-box;\n  display: flex;\n  -webkit-box-align: center;\n          align-items: center;\n  padding: 20px 0;\n}\n\n.app-creating-lesson__hands_filter {\n  display: -webkit-box;\n  display: flex;\n  -webkit-box-orient: vertical;\n  -webkit-box-direction: normal;\n          flex-direction: column;\n  margin-left: 30px;\n}\n\n.app-creating-lesson__filter-value {\n  height: 30px;\n  display: -webkit-box;\n  display: flex;\n  -webkit-box-align: center;\n          align-items: center;\n  -webkit-box-pack: center;\n          justify-content: center;\n  font-family: \"Graphik\";\n  font-weight: normal;\n  font-style: normal;\n}\n\n.app-edit-lessons-form__row {\n  display: -webkit-box;\n  display: flex;\n  padding-bottom: 8px;\n  -webkit-box-orient: vertical;\n  -webkit-box-direction: normal;\n          flex-direction: column;\n  padding-top: 10px;\n}\n\n.app-edit-lessons-form__row-2 {\n  display: -webkit-box;\n  display: flex;\n  gap: 6px;\n  padding-left: 12px;\n}\n\n.app-edit-lessons-form-title {\n  font-size: 18px;\n  font-family: \"Graphik\";\n  font-weight: 600;\n  font-style: normal;\n}\n\n.app-edit-lessons-form-label {\n  font-size: 16px;\n  padding: 8px 0;\n  color: #009688;\n}\n\n.app-edit-lessons-form__field_input.mat-form-field {\n  width: 90px;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3Byb2plY3RzL3ByZWZsb3AtaGVyby9zcmMvc3R5bGVzL3ZhcmlhYmxlcy5zY3NzIiwic3JjL2FwcC9tb2R1bGVzL2NoYXJ0cy9tb2R1bGVzL3BhY2tzL2NvbXBvbmVudHMvZWRpdC1sZXNzb24vZWRpdC1sZXNzb24uY29tcG9uZW50LnNjc3MiLCIvaG9tZS9wcm9qZWN0cy9wcmVmbG9wLWhlcm8vc3JjL2FwcC9tb2R1bGVzL2NoYXJ0cy9tb2R1bGVzL3BhY2tzL2NvbXBvbmVudHMvZWRpdC1sZXNzb24vZWRpdC1sZXNzb24uY29tcG9uZW50LnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBa0ZFO0VBREY7SUFFSSx3QkFBQTtFQ2hGRjtBQUNGOztBRDBGRTtFQU9BO0lBRUksd0JBQUE7RUM5Rko7QUFDRjs7QUQ4RUU7RUFtQkE7SUFFSSx3QkFBQTtFQzlGSjtBQUNGOztBRDhFRTtFQU9BO0lBRUksd0JBQUE7RUNsRko7QUFDRjs7QURrRUU7RUFtQkE7SUFFSSx3QkFBQTtFQ2xGSjtBQUNGOztBRGtFRTtFQU9BO0lBRUksd0JBQUE7RUN0RUo7QUFDRjs7QURzREU7RUFtQkE7SUFFSSx3QkFBQTtFQ3RFSjtBQUNGOztBRHNERTtFQU9BO0lBRUksd0JBQUE7RUMxREo7QUFDRjs7QUQwQ0U7RUFtQkE7SUFFSSx3QkFBQTtFQzFESjtBQUNGOztBRDBDRTtFQU9BO0lBRUksd0JBQUE7RUM5Q0o7QUFDRjs7QUQ4QkU7RUFtQkE7SUFFSSx3QkFBQTtFQzlDSjtBQUNGOztBRDhCRTtFQU9BO0lBRUksd0JBQUE7RUNsQ0o7QUFDRjs7QURrQkU7RUFtQkE7SUFFSSx3QkFBQTtFQ2xDSjtBQUNGOztBRGtCRTtFQU9BO0lBRUksd0JBQUE7RUN0Qko7QUFDRjs7QURNRTtFQW1CQTtJQUVJLHdCQUFBO0VDdEJKO0FBQ0Y7O0FETUU7RUFPQTtJQUVJLHdCQUFBO0VDVko7QUFDRjs7QURORTtFQW1CQTtJQUVJLHdCQUFBO0VDVko7QUFDRjs7QURORTtFQU9BO0lBRUksd0JBQUE7RUNFSjtBQUNGOztBRGxCRTtFQW1CQTtJQUVJLHdCQUFBO0VDRUo7QUFDRjs7QUM5R0E7RUFDRSxhQUFBO0FEaUhGOztBQzlHQTtFQUNFLHFCQUFBO0FEaUhGOztBQzlHQTtFQUNFLDRCQUFBO0FEaUhGOztBQzlHQTtFQUNFLGdCQUFBO0VBQ0EsbUJBQUE7RUFDQSxtQkFBQTtFQUNBLHVCQUFBO0FEaUhGOztBRDNDRTtFRTFFRjtJRjRISSxZQUFBO0VDSEY7QUFDRjs7QURoREU7RUUxRUY7SUZnSUksWUFBQTtFQ0ZGO0FBQ0Y7O0FEckRFO0VFMUVGO0lGb0lJLFlBQUE7RUNERjtBQUNGOztBRDFERTtFRTFFRjtJRndJSSxZQUFBO0VDQUY7QUFDRjs7QUQvREU7RUUxRUY7SUY0SUksWUFBQTtFQ0NGO0FBQ0Y7O0FDdElBO0VBQ0Usa0JBQUE7QUR5SUY7O0FDdElBO0VBQ0Usb0JBQUE7RUFBQSxhQUFBO0VBQ0EseUJBQUE7VUFBQSxtQkFBQTtFQUNBLGVBQUE7QUR5SUY7O0FDdElBO0VBQ0Usb0JBQUE7RUFBQSxhQUFBO0VBQ0EsNEJBQUE7RUFBQSw2QkFBQTtVQUFBLHNCQUFBO0VBQ0EsaUJBQUE7QUR5SUY7O0FDdElBO0VBQ0UsWUFBQTtFQUNBLG9CQUFBO0VBQUEsYUFBQTtFQUNBLHlCQUFBO1VBQUEsbUJBQUE7RUFDQSx3QkFBQTtVQUFBLHVCQUFBO0VGWEEsc0JBY2M7RUFiZCxtQkFheUI7RUFaekIsa0JBWWlDO0FDeUluQzs7QUN4SUE7RUFDRSxvQkFBQTtFQUFBLGFBQUE7RUFDQSxtQkFBQTtFQUNBLDRCQUFBO0VBQUEsNkJBQUE7VUFBQSxzQkFBQTtFQUNBLGlCQUFBO0FEMklGOztBQ3hJQTtFQUNFLG9CQUFBO0VBQUEsYUFBQTtFQUNBLFFBQUE7RUFDQSxrQkFBQTtBRDJJRjs7QUN4SUE7RUFDRSxlQUFBO0VGN0JBLHNCQVVjO0VBVGQsZ0JBU3lCO0VBUnpCLGtCQVE4QjtBQ2lLaEM7O0FDMUlBO0VBQ0UsZUFBQTtFQUNBLGNBQUE7RUFDQSxjRjlETTtBQzJNUjs7QUN4SUU7RUFDRSxXQUFBO0FEMklKIiwiZmlsZSI6InNyYy9hcHAvbW9kdWxlcy9jaGFydHMvbW9kdWxlcy9wYWNrcy9jb21wb25lbnRzL2VkaXQtbGVzc29uL2VkaXQtbGVzc29uLmNvbXBvbmVudC5zY3NzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gY29sb3JzXG4kZ3JheS0xOiAjMzAzNzRBO1xuJGdyYXktMjogIzQ4NEY2MjtcbiRncmF5LTM6ICM0ODRGNjI7XG5cbiRncmVlbjogIzAwOTY4ODtcbiRncmVlbi0yOiAjNDNBMDQ3O1xuJGdyZWVuLTM6ICMwMEI1QTU7XG5cbiR3aGl0ZTogI0VGRjNGNjtcbiR3aGl0ZS0yOiAjRTdFQkVFO1xuXG4kcmVkOiAjRDQyNjQ3O1xuJHJlZC0yOiAjRkY2RjYwO1xuXG4kb3JhbmdlOiAjRkFBMzBEO1xuXG4kYmxhY2stMTogIzI2MzIzODtcbiRibGFjay0yOiAjMzc0NzRGO1xuXG4kY2FyZC1jb2xvci1yZWQ6ICNFRjUzNTA7XG4kY2FyZC1jb2xvci1ibGFjazogIzYxNjE2MTtcbiRjYXJkLWNvbG9yLWJsdWU6ICMzRjUxQjU7XG4kY2FyZC1jb2xvci1ncmVlbjogIzQzQTA0NztcblxuLy8gc2hhZG93XG4kc2hhZG93LWdyZWVuOiAgMCAxcHggM3B4IDAgJGdyYXktMTtcblxuXG4vLyBmb250c1xuQG1peGluIGZvbnQoJGZvbnRGYW1pbHksICRmb250V2VpZ2h0LCAkZm9udFN0eWxlKSB7XG4gIGZvbnQtZmFtaWx5OiAkZm9udEZhbWlseTtcbiAgZm9udC13ZWlnaHQ6ICRmb250V2VpZ2h0O1xuICBmb250LXN0eWxlOiAkZm9udFN0eWxlO1xufVxuXG5AbWl4aW4gZ3JhcGhpay1ib2xkKCkge1xuICBAaW5jbHVkZSBmb250KCdHcmFwaGlrJywgYm9sZCwgbm9ybWFsKTtcbn1cblxuQG1peGluIGdyYXBoaWstc2VtaWJvbGQoKSB7XG4gIEBpbmNsdWRlIGZvbnQoJ0dyYXBoaWsnLCA2MDAsIG5vcm1hbCk7XG59XG5cbkBtaXhpbiBncmFwaGlrLXJlZ3VsYXIoKSB7XG4gIEBpbmNsdWRlIGZvbnQoJ0dyYXBoaWsnLCBub3JtYWwsIG5vcm1hbCk7XG59XG5cbkBtaXhpbiBncmFwaGlrLXNlbWlib2xkLWl0YWxpYygpIHtcbiAgQGluY2x1ZGUgZm9udCgnR3JhcGhpaycsIDYwMCwgaXRhbGljKTtcbn1cblxuQG1peGluIGdyYXBoaWstbGlnaHQoKSB7XG4gIEBpbmNsdWRlIGZvbnQoJ0dyYXBoaWsnLCA0MDAsIGxpZ2h0KTtcbn1cblxuLy9zY3JlZW4gc2l6ZXNcbiRzY3JlZW4tbXM6IDMyMHB4O1xuJHNjcmVlbi1tbTogMzYwcHg7IC8vIGZpcnN0XG4kc2NyZWVuLW1sOiA0ODBweDsgLy8gJHNlY29uZFxuJHNjcmVlbi10czogNjAwcHg7XG4kc2NyZWVuLXRtOiA3MjBweDsgLy8gdGhpcmRcbiRzY3JlZW4tdGw6IDk2MHB4O1xuJHNjcmVlbi1kczogMTAyNHB4OyAvLyBmb3VydGhcbiRzY3JlZW4tZG06IDEyODBweDsgLy8gZmlmdGhcbiRzY3JlZW4tZGw6IDE0NDBweDtcblxuXG5cbiRncmlkOiAoXG4gICdtcyc6IDMyMHB4LFxuICAnbW0nOiAzNjBweCxcbiAgJ21sJzogNDgwcHgsXG4gICd0cyc6IDYwMHB4LFxuICAndG0nOiA3MjBweCxcbiAgJ3RsJzogOTYwcHgsXG4gICdkcyc6IDEwMjRweCxcbiAgJ2RtJzogMTI4MHB4LFxuICAnZGwnOiAxNDQwcHgsXG4pO1xuXG4uaGlkZGVuLWhlaWdodC1kb3duIHtcbiAgQG1lZGlhIChtYXgtaGVpZ2h0OiA1OTBweCkge1xuICAgIGRpc3BsYXk6IG5vbmUgIWltcG9ydGFudDtcbiAgfVxufVxuXG5AbWl4aW4gYWJvdmUoJGJyZWFrcG9pbnRzKSB7XG4gIEBtZWRpYSAobWluLXdpZHRoOiAjeyRicmVha3BvaW50c30pIHtcbiAgICBAY29udGVudDtcbiAgfVxufVxuXG5AbWl4aW4gYmVsb3coJGJyZWFrcG9pbnRzKSB7XG4gIEBtZWRpYSAobWF4LXdpZHRoOiAjeyRicmVha3BvaW50c30pIHtcbiAgICBAY29udGVudDtcbiAgfVxufVxuXG5AZWFjaCAka2V5LCAkdmFsdWUgaW4gJGdyaWQge1xuXG4gIC5oaWRkZW4tI3ska2V5fS1kb3duIHtcbiAgICBAaW5jbHVkZSBiZWxvdygjeyR2YWx1ZSAtIDF9KSB7XG4gICAgICBkaXNwbGF5OiBub25lICFpbXBvcnRhbnQ7XG4gICAgfVxuICB9XG5cbiAgLmhpZGRlbi0jeyRrZXl9LXVwIHtcbiAgICBAaW5jbHVkZSBhYm92ZSgjeyR2YWx1ZX0pIHtcbiAgICAgIGRpc3BsYXk6IG5vbmUgIWltcG9ydGFudDtcbiAgICB9XG4gIH1cbn1cblxuQG1peGluIGFib3ZlU2NyZWVuU2l6ZSgkdHlwZSwgJGZpcnN0LCAkc2Vjb25kLCAkdGhpcmQsICRmb3VydGgsICRmaWZ0aCkge1xuICBAaW5jbHVkZSBhYm92ZSgkc2NyZWVuLW1tKSB7XG4gICAgI3skdHlwZX06ICRmaXJzdCArIHB4O1xuICB9XG5cbiAgQGluY2x1ZGUgYWJvdmUoJHNjcmVlbi1tbCkge1xuICAgICN7JHR5cGV9OiAkc2Vjb25kICsgcHg7XG4gIH1cblxuICBAaW5jbHVkZSBhYm92ZSgkc2NyZWVuLXRtKSB7XG4gICAgI3skdHlwZX06ICR0aGlyZCArIHB4O1xuICB9XG5cbiAgQGluY2x1ZGUgYWJvdmUoJHNjcmVlbi1kcykge1xuICAgICN7JHR5cGV9OiAkZm91cnRoICsgcHg7XG4gIH1cblxuICBAaW5jbHVkZSBhYm92ZSgkc2NyZWVuLWRtKSB7XG4gICAgI3skdHlwZX06ICRmaWZ0aCArIHB4O1xuICB9XG59XG5cbkBtaXhpbiBhYm92ZVNjcmVlblNpemVXaXRoRGltZW5zaW9uKCR0eXBlLCAkZmlyc3QsICRzZWNvbmQsICR0aGlyZCwgJGZvdXJ0aCwgJGZpZnRoLCAkZGltZW5zaW9uKSB7XG4gIEBpbmNsdWRlIGFib3ZlKCRzY3JlZW4tbW0pIHtcbiAgICAjeyR0eXBlfTogJGZpcnN0ICsgJGRpbWVuc2lvbjtcbiAgfVxuXG4gIEBpbmNsdWRlIGFib3ZlKCRzY3JlZW4tbWwpIHtcbiAgICAjeyR0eXBlfTogJHNlY29uZCArICRkaW1lbnNpb247XG4gIH1cblxuICBAaW5jbHVkZSBhYm92ZSgkc2NyZWVuLXRtKSB7XG4gICAgI3skdHlwZX06ICR0aGlyZCArICRkaW1lbnNpb247XG4gIH1cblxuICBAaW5jbHVkZSBhYm92ZSgkc2NyZWVuLWRzKSB7XG4gICAgI3skdHlwZX06ICRmb3VydGggKyAkZGltZW5zaW9uO1xuICB9XG5cbiAgQGluY2x1ZGUgYWJvdmUoJHNjcmVlbi1kbSkge1xuICAgICN7JHR5cGV9OiAkZmlmdGggKyAkZGltZW5zaW9uO1xuICB9XG59XG5cbkBtaXhpbiBiZWxvd1NjcmVlblNpemUoJHR5cGUsICRmaXJzdCwgJHNlY29uZCwgJHRoaXJkLCAkZm91cnRoLCAkZmlmdGgpIHtcbiAgQGluY2x1ZGUgYmVsb3coJHNjcmVlbi1tbSkge1xuICAgICN7JHR5cGV9OiAkZmlyc3QgKyBweDtcbiAgfVxuXG4gIEBpbmNsdWRlIGJlbG93KCRzY3JlZW4tbWwpIHtcbiAgICAjeyR0eXBlfTogJHNlY29uZCArIHB4O1xuICB9XG5cbiAgQGluY2x1ZGUgYmVsb3coJHNjcmVlbi10bSkge1xuICAgICN7JHR5cGV9OiAkdGhpcmQgKyBweDtcbiAgfVxuXG4gIEBpbmNsdWRlIGJlbG93KCRzY3JlZW4tZHMpIHtcbiAgICAjeyR0eXBlfTogJGZvdXJ0aCArIHB4O1xuICB9XG5cbiAgQGluY2x1ZGUgYmVsb3coJHNjcmVlbi1kbSkge1xuICAgICN7JHR5cGV9OiAkZmlmdGggKyBweDtcbiAgfVxufVxuXG5AbWl4aW4gaWNvblNpemVTY3JlZW5TaXplKCRmaXJzdCwgJHNlY29uZCwgJHRoaXJkLCAkZm91cnRoLCAkZmlmdGgpIHtcbiAgQGluY2x1ZGUgYWJvdmUoJHNjcmVlbi1tbSkge1xuICAgIHdpZHRoOiAkZmlyc3QgKyBweCAhaW1wb3J0YW50O1xuICAgIGhlaWdodDogJGZpcnN0ICsgcHggIWltcG9ydGFudDtcbiAgfVxuXG4gIEBpbmNsdWRlIGFib3ZlKCRzY3JlZW4tbWwpIHtcbiAgICB3aWR0aDogJHNlY29uZCArIHB4ICFpbXBvcnRhbnQ7XG4gICAgaGVpZ2h0OiAkc2Vjb25kICsgcHggIWltcG9ydGFudDtcbiAgfVxuXG4gIEBpbmNsdWRlIGFib3ZlKCRzY3JlZW4tdG0pIHtcbiAgICB3aWR0aDogJHRoaXJkICsgcHggIWltcG9ydGFudDtcbiAgICBoZWlnaHQ6ICR0aGlyZCArIHB4ICFpbXBvcnRhbnQ7XG4gIH1cblxuICBAaW5jbHVkZSBhYm92ZSgkc2NyZWVuLWRzKSB7XG4gICAgd2lkdGg6ICRmb3VydGggKyBweCAhaW1wb3J0YW50O1xuICAgIGhlaWdodDogJGZvdXJ0aCArIHB4ICFpbXBvcnRhbnQ7XG4gIH1cblxuICBAaW5jbHVkZSBhYm92ZSgkc2NyZWVuLWRtKSB7XG4gICAgd2lkdGg6ICRmaWZ0aCArIHB4ICFpbXBvcnRhbnQ7XG4gICAgaGVpZ2h0OiAkZmlmdGggKyBweCAhaW1wb3J0YW50O1xuICB9XG59XG5cblxuIiwiQG1lZGlhIChtYXgtaGVpZ2h0OiA1OTBweCkge1xuICAuaGlkZGVuLWhlaWdodC1kb3duIHtcbiAgICBkaXNwbGF5OiBub25lICFpbXBvcnRhbnQ7XG4gIH1cbn1cblxuQG1lZGlhIChtYXgtd2lkdGg6IDMxOXB4KSB7XG4gIC5oaWRkZW4tbXMtZG93biB7XG4gICAgZGlzcGxheTogbm9uZSAhaW1wb3J0YW50O1xuICB9XG59XG5cbkBtZWRpYSAobWluLXdpZHRoOiAzMjBweCkge1xuICAuaGlkZGVuLW1zLXVwIHtcbiAgICBkaXNwbGF5OiBub25lICFpbXBvcnRhbnQ7XG4gIH1cbn1cblxuQG1lZGlhIChtYXgtd2lkdGg6IDM1OXB4KSB7XG4gIC5oaWRkZW4tbW0tZG93biB7XG4gICAgZGlzcGxheTogbm9uZSAhaW1wb3J0YW50O1xuICB9XG59XG5cbkBtZWRpYSAobWluLXdpZHRoOiAzNjBweCkge1xuICAuaGlkZGVuLW1tLXVwIHtcbiAgICBkaXNwbGF5OiBub25lICFpbXBvcnRhbnQ7XG4gIH1cbn1cblxuQG1lZGlhIChtYXgtd2lkdGg6IDQ3OXB4KSB7XG4gIC5oaWRkZW4tbWwtZG93biB7XG4gICAgZGlzcGxheTogbm9uZSAhaW1wb3J0YW50O1xuICB9XG59XG5cbkBtZWRpYSAobWluLXdpZHRoOiA0ODBweCkge1xuICAuaGlkZGVuLW1sLXVwIHtcbiAgICBkaXNwbGF5OiBub25lICFpbXBvcnRhbnQ7XG4gIH1cbn1cblxuQG1lZGlhIChtYXgtd2lkdGg6IDU5OXB4KSB7XG4gIC5oaWRkZW4tdHMtZG93biB7XG4gICAgZGlzcGxheTogbm9uZSAhaW1wb3J0YW50O1xuICB9XG59XG5cbkBtZWRpYSAobWluLXdpZHRoOiA2MDBweCkge1xuICAuaGlkZGVuLXRzLXVwIHtcbiAgICBkaXNwbGF5OiBub25lICFpbXBvcnRhbnQ7XG4gIH1cbn1cblxuQG1lZGlhIChtYXgtd2lkdGg6IDcxOXB4KSB7XG4gIC5oaWRkZW4tdG0tZG93biB7XG4gICAgZGlzcGxheTogbm9uZSAhaW1wb3J0YW50O1xuICB9XG59XG5cbkBtZWRpYSAobWluLXdpZHRoOiA3MjBweCkge1xuICAuaGlkZGVuLXRtLXVwIHtcbiAgICBkaXNwbGF5OiBub25lICFpbXBvcnRhbnQ7XG4gIH1cbn1cblxuQG1lZGlhIChtYXgtd2lkdGg6IDk1OXB4KSB7XG4gIC5oaWRkZW4tdGwtZG93biB7XG4gICAgZGlzcGxheTogbm9uZSAhaW1wb3J0YW50O1xuICB9XG59XG5cbkBtZWRpYSAobWluLXdpZHRoOiA5NjBweCkge1xuICAuaGlkZGVuLXRsLXVwIHtcbiAgICBkaXNwbGF5OiBub25lICFpbXBvcnRhbnQ7XG4gIH1cbn1cblxuQG1lZGlhIChtYXgtd2lkdGg6IDEwMjNweCkge1xuICAuaGlkZGVuLWRzLWRvd24ge1xuICAgIGRpc3BsYXk6IG5vbmUgIWltcG9ydGFudDtcbiAgfVxufVxuXG5AbWVkaWEgKG1pbi13aWR0aDogMTAyNHB4KSB7XG4gIC5oaWRkZW4tZHMtdXAge1xuICAgIGRpc3BsYXk6IG5vbmUgIWltcG9ydGFudDtcbiAgfVxufVxuXG5AbWVkaWEgKG1heC13aWR0aDogMTI3OXB4KSB7XG4gIC5oaWRkZW4tZG0tZG93biB7XG4gICAgZGlzcGxheTogbm9uZSAhaW1wb3J0YW50O1xuICB9XG59XG5cbkBtZWRpYSAobWluLXdpZHRoOiAxMjgwcHgpIHtcbiAgLmhpZGRlbi1kbS11cCB7XG4gICAgZGlzcGxheTogbm9uZSAhaW1wb3J0YW50O1xuICB9XG59XG5cbkBtZWRpYSAobWF4LXdpZHRoOiAxNDM5cHgpIHtcbiAgLmhpZGRlbi1kbC1kb3duIHtcbiAgICBkaXNwbGF5OiBub25lICFpbXBvcnRhbnQ7XG4gIH1cbn1cblxuQG1lZGlhIChtaW4td2lkdGg6IDE0NDBweCkge1xuICAuaGlkZGVuLWRsLXVwIHtcbiAgICBkaXNwbGF5OiBub25lICFpbXBvcnRhbnQ7XG4gIH1cbn1cblxuLmFwcC1lZGl0LWxlc3NvbiB7XG4gIHBhZGRpbmc6IDE2cHg7XG59XG5cbi5hcHAtY3JlYXRpbmctbGVzc29uX19pc28tYnV0dG9uIHtcbiAgbWFyZ2luOiAyMHB4IDAgMCA0MHB4O1xufVxuXG4uYXBwLWVkaXQtbGVzc29uX19kZXNjcmlwdGlvbi1idXR0b24ge1xuICBtYXJnaW4tbGVmdDogMjBweCAhaW1wb3J0YW50O1xufVxuXG4uYXBwLWVkaXQtbGVzc29uX19kZXNjcmlwdGlvbiB7XG4gIG1heC13aWR0aDogODAwcHg7XG4gIHRleHQtYWxpZ246IGp1c3RpZnk7XG4gIG1hcmdpbi1ib3R0b206IDIwcHg7XG4gIGZvbnQtZmFtaWx5OiBzYW5zLXNlcmlmO1xufVxuQG1lZGlhIChtaW4td2lkdGg6IDM2MHB4KSB7XG4gIC5hcHAtZWRpdC1sZXNzb25fX2Rlc2NyaXB0aW9uIHtcbiAgICB3aWR0aDogMzI1cHg7XG4gIH1cbn1cbkBtZWRpYSAobWluLXdpZHRoOiA0ODBweCkge1xuICAuYXBwLWVkaXQtbGVzc29uX19kZXNjcmlwdGlvbiB7XG4gICAgd2lkdGg6IDMyNXB4O1xuICB9XG59XG5AbWVkaWEgKG1pbi13aWR0aDogNzIwcHgpIHtcbiAgLmFwcC1lZGl0LWxlc3Nvbl9fZGVzY3JpcHRpb24ge1xuICAgIHdpZHRoOiA2NTBweDtcbiAgfVxufVxuQG1lZGlhIChtaW4td2lkdGg6IDEwMjRweCkge1xuICAuYXBwLWVkaXQtbGVzc29uX19kZXNjcmlwdGlvbiB7XG4gICAgd2lkdGg6IDgwMHB4O1xuICB9XG59XG5AbWVkaWEgKG1pbi13aWR0aDogMTI4MHB4KSB7XG4gIC5hcHAtZWRpdC1sZXNzb25fX2Rlc2NyaXB0aW9uIHtcbiAgICB3aWR0aDogODAwcHg7XG4gIH1cbn1cblxuLmFwcC1lZGl0LWxlc3Nvbl9fZGVzY3JpcHRpb25fY3Vyc2l2ZSB7XG4gIGZvbnQtc3R5bGU6IGl0YWxpYztcbn1cblxuLmFwcC1jcmVhdGluZy1sZXNzb25fX2FjdGlvbnMge1xuICBkaXNwbGF5OiBmbGV4O1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBwYWRkaW5nOiAyMHB4IDA7XG59XG5cbi5hcHAtY3JlYXRpbmctbGVzc29uX19oYW5kc19maWx0ZXIge1xuICBkaXNwbGF5OiBmbGV4O1xuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICBtYXJnaW4tbGVmdDogMzBweDtcbn1cblxuLmFwcC1jcmVhdGluZy1sZXNzb25fX2ZpbHRlci12YWx1ZSB7XG4gIGhlaWdodDogMzBweDtcbiAgZGlzcGxheTogZmxleDtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gIGZvbnQtZmFtaWx5OiBcIkdyYXBoaWtcIjtcbiAgZm9udC13ZWlnaHQ6IG5vcm1hbDtcbiAgZm9udC1zdHlsZTogbm9ybWFsO1xufVxuXG4uYXBwLWVkaXQtbGVzc29ucy1mb3JtX19yb3cge1xuICBkaXNwbGF5OiBmbGV4O1xuICBwYWRkaW5nLWJvdHRvbTogOHB4O1xuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICBwYWRkaW5nLXRvcDogMTBweDtcbn1cblxuLmFwcC1lZGl0LWxlc3NvbnMtZm9ybV9fcm93LTIge1xuICBkaXNwbGF5OiBmbGV4O1xuICBnYXA6IDZweDtcbiAgcGFkZGluZy1sZWZ0OiAxMnB4O1xufVxuXG4uYXBwLWVkaXQtbGVzc29ucy1mb3JtLXRpdGxlIHtcbiAgZm9udC1zaXplOiAxOHB4O1xuICBmb250LWZhbWlseTogXCJHcmFwaGlrXCI7XG4gIGZvbnQtd2VpZ2h0OiA2MDA7XG4gIGZvbnQtc3R5bGU6IG5vcm1hbDtcbn1cblxuLmFwcC1lZGl0LWxlc3NvbnMtZm9ybS1sYWJlbCB7XG4gIGZvbnQtc2l6ZTogMTZweDtcbiAgcGFkZGluZzogOHB4IDA7XG4gIGNvbG9yOiAjMDA5Njg4O1xufVxuXG4uYXBwLWVkaXQtbGVzc29ucy1mb3JtX19maWVsZF9pbnB1dC5tYXQtZm9ybS1maWVsZCB7XG4gIHdpZHRoOiA5MHB4O1xufSIsIkBpbXBvcnQgXCIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zdHlsZXMvdmFyaWFibGVzXCI7XG5cbi5hcHAtZWRpdC1sZXNzb24ge1xuICBwYWRkaW5nOiAxNnB4O1xufVxuXG4uYXBwLWNyZWF0aW5nLWxlc3Nvbl9faXNvLWJ1dHRvbiB7XG4gIG1hcmdpbjogMjBweCAwIDAgNDBweDtcbn1cblxuLmFwcC1lZGl0LWxlc3Nvbl9fZGVzY3JpcHRpb24tYnV0dG9uIHtcbiAgbWFyZ2luLWxlZnQ6IDIwcHggIWltcG9ydGFudDtcbn1cblxuLmFwcC1lZGl0LWxlc3Nvbl9fZGVzY3JpcHRpb24ge1xuICBtYXgtd2lkdGg6IDgwMHB4O1xuICB0ZXh0LWFsaWduOiBqdXN0aWZ5O1xuICBtYXJnaW4tYm90dG9tOiAyMHB4O1xuICBmb250LWZhbWlseTogc2Fucy1zZXJpZjtcbiAgQGluY2x1ZGUgYWJvdmVTY3JlZW5TaXplV2l0aERpbWVuc2lvbih3aWR0aCwgMzI1LCAzMjUsIDY1MCwgODAwLCA4MDAsIHB4KTtcbn1cblxuLmFwcC1lZGl0LWxlc3Nvbl9fZGVzY3JpcHRpb25fY3Vyc2l2ZSB7XG4gIGZvbnQtc3R5bGU6IGl0YWxpYztcbn1cblxuLmFwcC1jcmVhdGluZy1sZXNzb25fX2FjdGlvbnMge1xuICBkaXNwbGF5OiBmbGV4O1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBwYWRkaW5nOiAyMHB4IDA7XG59XG5cbi5hcHAtY3JlYXRpbmctbGVzc29uX19oYW5kc19maWx0ZXIge1xuICBkaXNwbGF5OiBmbGV4O1xuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICBtYXJnaW4tbGVmdDogMzBweDtcbn1cblxuLmFwcC1jcmVhdGluZy1sZXNzb25fX2ZpbHRlci12YWx1ZSB7XG4gIGhlaWdodDogMzBweDtcbiAgZGlzcGxheTogZmxleDtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gIEBpbmNsdWRlIGdyYXBoaWstcmVndWxhcigpO1xufVxuXG4uYXBwLWVkaXQtbGVzc29ucy1mb3JtX19yb3cge1xuICBkaXNwbGF5OiBmbGV4O1xuICBwYWRkaW5nLWJvdHRvbTogOHB4O1xuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICBwYWRkaW5nLXRvcDogMTBweDtcbn1cblxuLmFwcC1lZGl0LWxlc3NvbnMtZm9ybV9fcm93LTIge1xuICBkaXNwbGF5OiBmbGV4O1xuICBnYXA6IDZweDtcbiAgcGFkZGluZy1sZWZ0OiAxMnB4O1xufVxuXG4uYXBwLWVkaXQtbGVzc29ucy1mb3JtLXRpdGxlIHtcbiAgZm9udC1zaXplOiAxOHB4O1xuICBAaW5jbHVkZSBncmFwaGlrLXNlbWlib2xkKCk7XG59XG5cbi5hcHAtZWRpdC1sZXNzb25zLWZvcm0tbGFiZWwge1xuICBmb250LXNpemU6IDE2cHg7XG4gIHBhZGRpbmc6IDhweCAwO1xuICBjb2xvcjogJGdyZWVuO1xufVxuXG4uYXBwLWVkaXQtbGVzc29ucy1mb3JtX19maWVsZF9pbnB1dCB7XG5cbiAgJi5tYXQtZm9ybS1maWVsZCB7XG4gICAgd2lkdGg6IDkwcHg7XG4gIH1cbn1cblxuXG5cbiJdfQ== */");

/***/ }),

/***/ "./src/app/modules/charts/modules/packs/components/edit-lesson/edit-lesson.component.ts":
/*!**********************************************************************************************!*\
  !*** ./src/app/modules/charts/modules/packs/components/edit-lesson/edit-lesson.component.ts ***!
  \**********************************************************************************************/
/*! exports provided: EditLessonComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "EditLessonComponent", function() { return EditLessonComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _services_app_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../../../services/app.service */ "./src/app/services/app.service.ts");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _services_charts_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../../services/charts.service */ "./src/app/modules/charts/services/charts.service.ts");
/* harmony import */ var _modals_ranges_setting_ranges_setting_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../../modals/ranges-setting/ranges-setting.component */ "./src/app/modules/charts/modals/ranges-setting/ranges-setting.component.ts");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _angular_material_dialog__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/material/dialog */ "./node_modules/@angular/material/esm5/dialog.es5.js");
/* harmony import */ var _services_user_service__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../../../../../services/user.service */ "./src/app/services/user.service.ts");
/* harmony import */ var _shared_services_snackbar_service__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../../../../../shared/services/snackbar.service */ "./src/app/shared/services/snackbar.service.ts");
/* harmony import */ var _modals_second_action_creating_dialog_second_action_creating_dialog_component__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../../../modals/second-action-creating-dialog/second-action-creating-dialog.component */ "./src/app/modules/charts/modals/second-action-creating-dialog/second-action-creating-dialog.component.ts");
/* harmony import */ var _services_default_data_service__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../../../../../../services/default-data.service */ "./src/app/services/default-data.service.ts");
/* harmony import */ var _shared_modals_game_mode_hands_range_dialog_game_mode_hands_range_dialog_component__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../../../../../../shared/modals/game-mode-hands-range-dialog/game-mode-hands-range-dialog.component */ "./src/app/shared/modals/game-mode-hands-range-dialog/game-mode-hands-range-dialog.component.ts");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");














var EditLessonComponent = /** @class */ (function () {
    function EditLessonComponent(appService, route, adminService, dialog, userService, defaultDataService, snackbarService, router, changeDetectorRef) {
        this.appService = appService;
        this.route = route;
        this.adminService = adminService;
        this.dialog = dialog;
        this.userService = userService;
        this.defaultDataService = defaultDataService;
        this.snackbarService = snackbarService;
        this.router = router;
        this.changeDetectorRef = changeDetectorRef;
        this.isRussianLanguage = false;
        this.isDescriptionShown = false;
    }
    EditLessonComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.isRussianLanguage = this.userService.getUser().language === 'ru';
        this.route.data
            .subscribe(function (data) {
            _this.chart = data.chart;
            _this.initFormGroup();
            _this.appService.headerTitleTemplate = _this.headerTitleTemplate;
            _this.appService.headerActionsTemplate = _this.headerActionsTemplate;
        });
    };
    EditLessonComponent.prototype.initFormGroup = function () {
        var _this = this;
        if (this.chart.gameType && this.chart.position) {
            var chartGameType = this.defaultDataService.chartGameTypes.find(function (gt) { return gt.id === _this.chart.gameType.id; });
            if (!chartGameType)
                return [];
            var relevantChartPositions = this.defaultDataService.chartPositions;
            if (this.chart.gameType.title.toLowerCase() === 'hu') {
                relevantChartPositions = this.defaultDataService.chartPositions.slice(0, 2);
            }
            var filteredPositions = relevantChartPositions.filter(function (p) { return p.title.toLowerCase() !== _this.chart.position.title.toLowerCase(); });
            this.pfrlist = filteredPositions.map(function (p) { return ({
                position: p.title,
                start: '0',
                finish: '0'
            }); });
        }
        var sbStartPfrCtrl = new _angular_forms__WEBPACK_IMPORTED_MODULE_13__["FormControl"](this.chart.pfr ? this.chart.pfr.sb.start : 0);
        var sbFinishPfrCtrl = new _angular_forms__WEBPACK_IMPORTED_MODULE_13__["FormControl"](this.chart.pfr ? this.chart.pfr.sb.finish : 0);
        var bbStartPfrCtrl = new _angular_forms__WEBPACK_IMPORTED_MODULE_13__["FormControl"](this.chart.pfr ? this.chart.pfr.bb.start : 0);
        var bbFinishPfrCtrl = new _angular_forms__WEBPACK_IMPORTED_MODULE_13__["FormControl"](this.chart.pfr ? this.chart.pfr.bb.finish : 0);
        var btnStartPfrCtrl = new _angular_forms__WEBPACK_IMPORTED_MODULE_13__["FormControl"](this.chart.pfr ? this.chart.pfr.btn.start : 0);
        var btnFinishPfrCtrl = new _angular_forms__WEBPACK_IMPORTED_MODULE_13__["FormControl"](this.chart.pfr ? this.chart.pfr.btn.finish : 0);
        this.pfrFormGroup = new _angular_forms__WEBPACK_IMPORTED_MODULE_13__["FormGroup"]({
            sbStartPfrCtrl: sbStartPfrCtrl,
            sbFinishPfrCtrl: sbFinishPfrCtrl,
            bbStartPfrCtrl: bbStartPfrCtrl,
            bbFinishPfrCtrl: bbFinishPfrCtrl,
            btnStartPfrCtrl: btnStartPfrCtrl,
            btnFinishPfrCtrl: btnFinishPfrCtrl,
        });
    };
    EditLessonComponent.prototype.showDescription = function () {
        this.isDescriptionShown = !this.isDescriptionShown;
    };
    EditLessonComponent.prototype.ngOnDestroy = function () {
        this.appService.headerTitleTemplate = null;
        this.appService.headerActionsTemplate = null;
    };
    EditLessonComponent.prototype.onSaveButtonClick = function () {
        var _this = this;
        this.fillEmptyCharts();
        this.isState = true;
        var newPlayersCount = this.chart.gameType.playersCount;
        var newPosition = this.chart.position.id;
        var newAction = this.chart.action ? this.chart.action.id : null;
        var newTitle = this.chart.title;
        var newOpponentsType = this.chart.opponentsType;
        var packId = this.route.snapshot.paramMap.get('packId');
        this.chart.stackRanges[this.chart.stackRanges.length - 1].rangeMax = 99;
        this.chart.stackRanges[0].rangeMin = 1;
        var sbStartPfr = this.pfrFormGroup.get('sbStartPfrCtrl').value || 0;
        var sbFinishPfr = this.pfrFormGroup.get('sbFinishPfrCtrl').value || 0;
        var bbStartPfr = this.pfrFormGroup.get('bbStartPfrCtrl').value || 0;
        var bbFinishPfr = this.pfrFormGroup.get('bbFinishPfrCtrl').value || 0;
        var btnStartPfr = this.pfrFormGroup.get('btnStartPfrCtrl').value || 0;
        var btnFinishPfr = this.pfrFormGroup.get('btnFinishPfrCtrl').value || 0;
        var newPfr = {
            sb: { start: sbStartPfr, finish: sbFinishPfr },
            bb: { start: bbStartPfr, finish: bbFinishPfr },
            btn: { start: btnStartPfr, finish: btnFinishPfr },
        };
        var newLesson = { id: this.chart.id, title: newTitle, playersCount: newPlayersCount, position: newPosition,
            action: newAction, stackRanges: this.chart.stackRanges, opponentsType: newOpponentsType.id,
            userId: this.userService.getUser().id, description: this.chart.description, descriptionEn: this.chart.descriptionEn
                ? this.chart.descriptionEn : this.chart.description, groupId: +packId, pfr: newPfr,
        };
        this.adminService.createLesson(newLesson).subscribe(function () {
            _this.isState = false;
            _this.snackbarService.showMessage('Lesson edited');
            _this.router.navigate(['charts', packId]);
        });
    };
    EditLessonComponent.prototype.fillEmptyCharts = function () {
        var e_1, _a, e_2, _b;
        try {
            for (var _c = tslib__WEBPACK_IMPORTED_MODULE_0__["__values"](this.chart.stackRanges), _d = _c.next(); !_d.done; _d = _c.next()) {
                var range = _d.value;
                try {
                    for (var _e = (e_2 = void 0, tslib__WEBPACK_IMPORTED_MODULE_0__["__values"](range.charts)), _f = _e.next(); !_f.done; _f = _e.next()) {
                        var chart = _f.value;
                        for (var j = 0; j < chart.combinations.length; j++) {
                            if (chart.combinations[j].length < 5) {
                                chart.combinations[j] = this.fillCombinationAsFold(chart.combinations[j]);
                            }
                        }
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
            }
            finally { if (e_1) throw e_1.error; }
        }
    };
    EditLessonComponent.prototype.fillCombinationAsFold = function (combination) {
        var parts = combination.split(',');
        if (!parts[1]) {
            parts[1] = 'n';
            parts[2] = 'f';
        }
        return parts.join(',');
    };
    EditLessonComponent.prototype.getSecondActionTitle = function (factor, secondAction) {
        var prefix = 'VS ' + this.defaultDataService.getSecondActionTitleById(secondAction);
        return factor ? prefix + ' x' + factor.toString() : prefix;
    };
    EditLessonComponent.prototype.openRangesSettingDialog = function () {
        var _this = this;
        var dialogRef = this.dialog.open(_modals_ranges_setting_ranges_setting_component__WEBPACK_IMPORTED_MODULE_5__["RangesSettingComponent"], {
            data: this.chart.stackRanges,
            autoFocus: false,
            disableClose: true
        });
        dialogRef.afterClosed().pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_6__["filter"])(function (value) { return value; })).subscribe(function (ranges) {
            _this.chart.stackRanges = ranges;
            _this.changeDetectorRef.detectChanges();
        });
    };
    EditLessonComponent.prototype.onSecondActionDeleted = function (range, index) {
        range.charts.splice(index, 1);
    };
    EditLessonComponent.prototype.openAddSecondActionDialog = function (range) {
        var _this = this;
        var dialogRef = this.dialog.open(_modals_second_action_creating_dialog_second_action_creating_dialog_component__WEBPACK_IMPORTED_MODULE_10__["SecondActionCreatingDialogComponent"], {
            data: { isAllAvailable: range.charts.findIndex(function (chart) { return chart.secondAction === 0; }) === -1,
                isIsoAllAvailable: range.charts.findIndex(function (chart) { return chart.secondAction === 3; }) === -1 },
            autoFocus: false,
        });
        dialogRef.afterClosed().pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_6__["filter"])(function (value) { return value; })).subscribe(function (data) {
            switch (data.action.toLowerCase()) {
                case 'all-in':
                    range.charts.push({
                        secondAction: 0,
                        combinations: _this.defaultDataService.getEmptyChart(),
                        answers: _this.adminService.getDefaultVsAll()
                    });
                    break;
                case 'iso all-in':
                    range.charts.push({
                        secondAction: 3,
                        combinations: _this.defaultDataService.getEmptyChart(),
                        answers: _this.adminService.getDefaultVsAll()
                    });
                    break;
                case '3-bet':
                    range.charts.push({
                        secondActionFactor: data.factor,
                        secondAction: 1,
                        combinations: _this.defaultDataService.getEmptyChart(),
                        answers: _this.adminService.getDefaultVs3bet()
                    });
                    break;
                case 'iso':
                    range.charts.push({
                        secondActionFactor: data.factor,
                        secondAction: 2,
                        combinations: _this.defaultDataService.getEmptyChart(),
                        answers: _this.adminService.getDefaultVs3bet()
                    });
                    break;
            }
            _this.changeDetectorRef.detectChanges();
        });
    };
    EditLessonComponent.prototype.openHandsFilter = function (range, chosenTitle, id, mode) {
        var dialogRef = this.dialog.open(_shared_modals_game_mode_hands_range_dialog_game_mode_hands_range_dialog_component__WEBPACK_IMPORTED_MODULE_12__["GameModeHandsRangeDialogComponent"], {
            data: {
                currentHandsRangeId: id,
                title: chosenTitle
            },
            autoFocus: false,
        });
        dialogRef.afterClosed().pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_6__["filter"])(function (value) { return value; })).subscribe(function (newId) {
            switch (mode) {
                case 0:
                    range.easy = newId;
                    break;
                case 1:
                    range.normal = newId;
                    break;
                case 2:
                    range.hard = newId;
                    break;
            }
        });
    };
    EditLessonComponent.ctorParameters = function () { return [
        { type: _services_app_service__WEBPACK_IMPORTED_MODULE_2__["AppService"] },
        { type: _angular_router__WEBPACK_IMPORTED_MODULE_3__["ActivatedRoute"] },
        { type: _services_charts_service__WEBPACK_IMPORTED_MODULE_4__["ChartsService"] },
        { type: _angular_material_dialog__WEBPACK_IMPORTED_MODULE_7__["MatDialog"] },
        { type: _services_user_service__WEBPACK_IMPORTED_MODULE_8__["UserService"] },
        { type: _services_default_data_service__WEBPACK_IMPORTED_MODULE_11__["DefaultDataService"] },
        { type: _shared_services_snackbar_service__WEBPACK_IMPORTED_MODULE_9__["SnackbarService"] },
        { type: _angular_router__WEBPACK_IMPORTED_MODULE_3__["Router"] },
        { type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["ChangeDetectorRef"] }
    ]; };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"])('headerTitleTemplate', { static: true })
    ], EditLessonComponent.prototype, "headerTitleTemplate", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"])('headerActionsTemplate', { static: true })
    ], EditLessonComponent.prototype, "headerActionsTemplate", void 0);
    EditLessonComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-edit-lesson',
            template: tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(/*! raw-loader!./edit-lesson.component.html */ "./node_modules/raw-loader/dist/cjs.js!./src/app/modules/charts/modules/packs/components/edit-lesson/edit-lesson.component.html")).default,
            changeDetection: _angular_core__WEBPACK_IMPORTED_MODULE_1__["ChangeDetectionStrategy"].OnPush,
            styles: [tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(/*! ./edit-lesson.component.scss */ "./src/app/modules/charts/modules/packs/components/edit-lesson/edit-lesson.component.scss")).default]
        })
    ], EditLessonComponent);
    return EditLessonComponent;
}());



/***/ }),

/***/ "./src/app/modules/charts/modules/packs/components/edit-mixed-lesson/edit-mixed-lesson.component.scss":
/*!************************************************************************************************************!*\
  !*** ./src/app/modules/charts/modules/packs/components/edit-mixed-lesson/edit-mixed-lesson.component.scss ***!
  \************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = (".app-creating-lessons__container {\n  padding: 0 16px;\n}\n\n.app-creating-lessons-form {\n  padding: 30px 0 10px 0;\n  -webkit-box-orient: vertical;\n  -webkit-box-direction: normal;\n          flex-direction: column;\n  display: -webkit-box;\n  display: flex;\n  width: 350px;\n}\n\n.app-creating-lessons-form__field {\n  margin-top: 8px;\n}\n\n.app-creating-lessons-form__field.mat-form-field {\n  display: -webkit-box;\n  display: flex;\n  -webkit-box-flex: 1;\n          flex: 1;\n}\n\n.app-creating-lessons-form__custom-range {\n  margin-bottom: 8px;\n}\n\n.app-creating-lessons-stars-form__field {\n  display: -webkit-box;\n  display: flex;\n}\n\n.app-creating-lessons-stars-form__field.mat-form-field {\n  display: -webkit-box;\n  display: flex;\n  -webkit-box-flex: 1;\n          flex: 1;\n  padding: 0 10px !important;\n}\n\n.app-creating-lessons-form__field_mt-10 {\n  margin-top: 10px;\n}\n\n.app-creating-lessons-form__field_mt-16 {\n  margin-top: 16px;\n}\n\n.app-edit-mixed-lesson__list {\n  margin-bottom: 20px;\n}\n\n.app-edit-mixed-lesson__list-item {\n  margin: 8px 0;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3Byb2plY3RzL3ByZWZsb3AtaGVyby9zcmMvc3R5bGVzL2FwcC1jcmVhdGluZy1taXhlZC1sZXNzb24vYXBwLWNyZWF0aW5nLW1peGVkLWxlc3Nvbi5zY3NzIiwic3JjL2FwcC9tb2R1bGVzL2NoYXJ0cy9tb2R1bGVzL3BhY2tzL2NvbXBvbmVudHMvZWRpdC1taXhlZC1sZXNzb24vZWRpdC1taXhlZC1sZXNzb24uY29tcG9uZW50LnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFDRSxlQUFBO0FDQ0Y7O0FERUE7RUFDRSxzQkFBQTtFQUNBLDRCQUFBO0VBQUEsNkJBQUE7VUFBQSxzQkFBQTtFQUNBLG9CQUFBO0VBQUEsYUFBQTtFQUNBLFlBQUE7QUNDRjs7QURFQTtFQUNFLGVBQUE7QUNDRjs7QURDRTtFQUNFLG9CQUFBO0VBQUEsYUFBQTtFQUNBLG1CQUFBO1VBQUEsT0FBQTtBQ0NKOztBRE9BO0VBQ0Usa0JBQUE7QUNMRjs7QURRQTtFQUVFLG9CQUFBO0VBQUEsYUFBQTtBQ05GOztBRFFFO0VBQ0Usb0JBQUE7RUFBQSxhQUFBO0VBQ0EsbUJBQUE7VUFBQSxPQUFBO0VBQ0EsMEJBQUE7QUNOSjs7QURjQTtFQUNFLGdCQUFBO0FDWkY7O0FEZUE7RUFDRSxnQkFBQTtBQ1pGOztBRGVBO0VBQ0UsbUJBQUE7QUNaRjs7QURlQTtFQUNFLGFBQUE7QUNaRiIsImZpbGUiOiJzcmMvYXBwL21vZHVsZXMvY2hhcnRzL21vZHVsZXMvcGFja3MvY29tcG9uZW50cy9lZGl0LW1peGVkLWxlc3Nvbi9lZGl0LW1peGVkLWxlc3Nvbi5jb21wb25lbnQuc2NzcyIsInNvdXJjZXNDb250ZW50IjpbIi5hcHAtY3JlYXRpbmctbGVzc29uc19fY29udGFpbmVyIHtcbiAgcGFkZGluZzogMCAxNnB4O1xufVxuXG4uYXBwLWNyZWF0aW5nLWxlc3NvbnMtZm9ybSB7XG4gIHBhZGRpbmc6IDMwcHggMCAxMHB4IDA7XG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gIGRpc3BsYXk6IGZsZXg7XG4gIHdpZHRoOiAzNTBweDtcbn1cblxuLmFwcC1jcmVhdGluZy1sZXNzb25zLWZvcm1fX2ZpZWxkIHtcbiAgbWFyZ2luLXRvcDogOHB4O1xuXG4gICYubWF0LWZvcm0tZmllbGQge1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgZmxleDogMTtcblxuICAgICY6bm90KDpmaXJzdC1jaGlsZCkge1xuICAgICAgLy9tYXJnaW4tdG9wOiA4cHg7XG4gICAgfVxuICB9XG59XG5cbi5hcHAtY3JlYXRpbmctbGVzc29ucy1mb3JtX19jdXN0b20tcmFuZ2Uge1xuICBtYXJnaW4tYm90dG9tOiA4cHg7XG59XG5cbi5hcHAtY3JlYXRpbmctbGVzc29ucy1zdGFycy1mb3JtX19maWVsZCB7XG5cbiAgZGlzcGxheTogZmxleDtcblxuICAmLm1hdC1mb3JtLWZpZWxkIHtcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIGZsZXg6IDE7XG4gICAgcGFkZGluZzogMCAxMHB4ICFpbXBvcnRhbnQ7XG5cbiAgICAmOm5vdCg6Zmlyc3QtY2hpbGQpIHtcbiAgICAgIC8vbWFyZ2luLXRvcDogOHB4O1xuICAgIH1cbiAgfVxufVxuXG4uYXBwLWNyZWF0aW5nLWxlc3NvbnMtZm9ybV9fZmllbGRfbXQtMTAge1xuICBtYXJnaW4tdG9wOiAxMHB4O1xufVxuXG4uYXBwLWNyZWF0aW5nLWxlc3NvbnMtZm9ybV9fZmllbGRfbXQtMTYge1xuICBtYXJnaW4tdG9wOiAxNnB4O1xufVxuXG4uYXBwLWVkaXQtbWl4ZWQtbGVzc29uX19saXN0IHtcbiAgbWFyZ2luLWJvdHRvbTogMjBweDtcbn1cblxuLmFwcC1lZGl0LW1peGVkLWxlc3Nvbl9fbGlzdC1pdGVtIHtcbiAgbWFyZ2luOiA4cHggMDtcbn1cbiIsIi5hcHAtY3JlYXRpbmctbGVzc29uc19fY29udGFpbmVyIHtcbiAgcGFkZGluZzogMCAxNnB4O1xufVxuXG4uYXBwLWNyZWF0aW5nLWxlc3NvbnMtZm9ybSB7XG4gIHBhZGRpbmc6IDMwcHggMCAxMHB4IDA7XG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gIGRpc3BsYXk6IGZsZXg7XG4gIHdpZHRoOiAzNTBweDtcbn1cblxuLmFwcC1jcmVhdGluZy1sZXNzb25zLWZvcm1fX2ZpZWxkIHtcbiAgbWFyZ2luLXRvcDogOHB4O1xufVxuLmFwcC1jcmVhdGluZy1sZXNzb25zLWZvcm1fX2ZpZWxkLm1hdC1mb3JtLWZpZWxkIHtcbiAgZGlzcGxheTogZmxleDtcbiAgZmxleDogMTtcbn1cbi5hcHAtY3JlYXRpbmctbGVzc29ucy1mb3JtX19jdXN0b20tcmFuZ2Uge1xuICBtYXJnaW4tYm90dG9tOiA4cHg7XG59XG5cbi5hcHAtY3JlYXRpbmctbGVzc29ucy1zdGFycy1mb3JtX19maWVsZCB7XG4gIGRpc3BsYXk6IGZsZXg7XG59XG4uYXBwLWNyZWF0aW5nLWxlc3NvbnMtc3RhcnMtZm9ybV9fZmllbGQubWF0LWZvcm0tZmllbGQge1xuICBkaXNwbGF5OiBmbGV4O1xuICBmbGV4OiAxO1xuICBwYWRkaW5nOiAwIDEwcHggIWltcG9ydGFudDtcbn1cbi5hcHAtY3JlYXRpbmctbGVzc29ucy1mb3JtX19maWVsZF9tdC0xMCB7XG4gIG1hcmdpbi10b3A6IDEwcHg7XG59XG5cbi5hcHAtY3JlYXRpbmctbGVzc29ucy1mb3JtX19maWVsZF9tdC0xNiB7XG4gIG1hcmdpbi10b3A6IDE2cHg7XG59XG5cbi5hcHAtZWRpdC1taXhlZC1sZXNzb25fX2xpc3Qge1xuICBtYXJnaW4tYm90dG9tOiAyMHB4O1xufVxuXG4uYXBwLWVkaXQtbWl4ZWQtbGVzc29uX19saXN0LWl0ZW0ge1xuICBtYXJnaW46IDhweCAwO1xufSJdfQ== */");

/***/ }),

/***/ "./src/app/modules/charts/modules/packs/components/edit-mixed-lesson/edit-mixed-lesson.component.ts":
/*!**********************************************************************************************************!*\
  !*** ./src/app/modules/charts/modules/packs/components/edit-mixed-lesson/edit-mixed-lesson.component.ts ***!
  \**********************************************************************************************************/
/*! exports provided: EditMixedLessonComponent, defaultCompareFn, trackById, compareIndex */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "EditMixedLessonComponent", function() { return EditMixedLessonComponent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "defaultCompareFn", function() { return defaultCompareFn; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "trackById", function() { return trackById; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "compareIndex", function() { return compareIndex; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _services_app_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../../../../services/app.service */ "./src/app/services/app.service.ts");
/* harmony import */ var _services_charts_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../../services/charts.service */ "./src/app/modules/charts/services/charts.service.ts");
/* harmony import */ var _services_user_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../../../../services/user.service */ "./src/app/services/user.service.ts");
/* harmony import */ var _shared_services_snackbar_service__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../../../../shared/services/snackbar.service */ "./src/app/shared/services/snackbar.service.ts");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");
/* harmony import */ var _training_services_lesson_service__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../../../../training/services/lesson.service */ "./src/app/modules/training/services/lesson.service.ts");
/* harmony import */ var _services_default_data_service__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../../../../../services/default-data.service */ "./src/app/services/default-data.service.ts");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");












var EditMixedLessonComponent = /** @class */ (function () {
    function EditMixedLessonComponent(appService, adminService, userService, route, snackbarService, router, lessonService, defaultDataService, location) {
        this.appService = appService;
        this.adminService = adminService;
        this.userService = userService;
        this.route = route;
        this.snackbarService = snackbarService;
        this.router = router;
        this.lessonService = lessonService;
        this.defaultDataService = defaultDataService;
        this.location = location;
        // compare functions
        this.compareLessonsFn = defaultCompareFn;
        // track functions
        this.trackLessonsFn = trackById;
        this.userId = this.userService.getUser().id;
        this.packId = this.route.snapshot.paramMap.get('packId');
        this.customRangeMin = [];
        this.customRangeMax = [];
        this.compareIndex = compareIndex;
        this.trackChartGroupFn = trackById;
    }
    EditMixedLessonComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.appService.headerTitleTemplate = this.headerTitleTemplate;
        this.gameModes = this.defaultDataService.getGameModes();
        this.route.data
            .subscribe(function (data) {
            _this.chart = data.chart;
            _this.initFormGroup();
            _this.generateCustomRange();
        });
    };
    EditMixedLessonComponent.prototype.initFormGroup = function () {
        var _this = this;
        var titleCtrl = new _angular_forms__WEBPACK_IMPORTED_MODULE_3__["FormControl"]({ value: this.chart.title, disabled: !this.chart.isEditable }, _angular_forms__WEBPACK_IMPORTED_MODULE_3__["Validators"].required);
        var lessonsCtrl = new _angular_forms__WEBPACK_IMPORTED_MODULE_3__["FormControl"](null, _angular_forms__WEBPACK_IMPORTED_MODULE_3__["Validators"].required);
        var chapterCtrl = new _angular_forms__WEBPACK_IMPORTED_MODULE_3__["FormControl"](null, _angular_forms__WEBPACK_IMPORTED_MODULE_3__["Validators"].required);
        var countHandsCtrl = new _angular_forms__WEBPACK_IMPORTED_MODULE_3__["FormControl"](this.chart.countHands, _angular_forms__WEBPACK_IMPORTED_MODULE_3__["Validators"].required);
        var star1Ctrl = new _angular_forms__WEBPACK_IMPORTED_MODULE_3__["FormControl"](this.chart.star1, _angular_forms__WEBPACK_IMPORTED_MODULE_3__["Validators"].required);
        var star2Ctrl = new _angular_forms__WEBPACK_IMPORTED_MODULE_3__["FormControl"](this.chart.star2, _angular_forms__WEBPACK_IMPORTED_MODULE_3__["Validators"].required);
        var star3Ctrl = new _angular_forms__WEBPACK_IMPORTED_MODULE_3__["FormControl"](this.chart.star3, _angular_forms__WEBPACK_IMPORTED_MODULE_3__["Validators"].required);
        var gameMode = this.gameModes.find(function (mode) {
            if (_this.chart.chartInfo) {
                return mode.title === _this.chart.chartInfo.mode;
            }
            return _this.gameModes[0];
        });
        this.gameModeCtrl = new _angular_forms__WEBPACK_IMPORTED_MODULE_3__["FormControl"](gameMode, _angular_forms__WEBPACK_IMPORTED_MODULE_3__["Validators"].required);
        this.customRangeMinCtrl = new _angular_forms__WEBPACK_IMPORTED_MODULE_3__["FormControl"](this.chart.chartInfo ? this.chart.chartInfo.rangeMin : 1, _angular_forms__WEBPACK_IMPORTED_MODULE_3__["Validators"].required);
        this.customRangeMaxCtrl = new _angular_forms__WEBPACK_IMPORTED_MODULE_3__["FormControl"](this.chart.chartInfo ? this.chart.chartInfo.rangeMax : 25, _angular_forms__WEBPACK_IMPORTED_MODULE_3__["Validators"].required);
        this.formGroup = new _angular_forms__WEBPACK_IMPORTED_MODULE_3__["FormGroup"]({
            titleCtrl: titleCtrl,
            lessonsCtrl: lessonsCtrl,
            chapterCtrl: chapterCtrl,
            countHandsCtrl: countHandsCtrl,
            star1Ctrl: star1Ctrl,
            star2Ctrl: star2Ctrl,
            star3Ctrl: star3Ctrl,
        });
        this.lessons$ = this.adminService.getChartGroup(+this.packId, this.userId).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_8__["tap"])(function (data) {
            var checkedCharts = data.charts.filter(function (chart) {
                return _this.chart.taskIds.indexOf(chart.id) !== -1;
            });
            lessonsCtrl.setValue(checkedCharts);
        }), Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_8__["map"])(function (data) { return data.charts; }));
        this.chapters$ = this.adminService.getChapters(this.packId).pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_8__["tap"])(function (chapters) {
            var findChapter = chapters.find(function (chapter) {
                return chapter.id === _this.chart.chapterId;
            });
            chapterCtrl.setValue(findChapter);
        }));
        countHandsCtrl.valueChanges.subscribe(function () {
            star1Ctrl.setValidators(_angular_forms__WEBPACK_IMPORTED_MODULE_3__["Validators"].max(countHandsCtrl.value));
            star1Ctrl.updateValueAndValidity();
        });
        star1Ctrl.valueChanges.subscribe(function () {
            star2Ctrl.setValidators([_angular_forms__WEBPACK_IMPORTED_MODULE_3__["Validators"].max(countHandsCtrl.value), _angular_forms__WEBPACK_IMPORTED_MODULE_3__["Validators"].min(star1Ctrl.value + 1)]);
            star2Ctrl.updateValueAndValidity();
        });
        star2Ctrl.valueChanges.subscribe(function () {
            star3Ctrl.setValidators([_angular_forms__WEBPACK_IMPORTED_MODULE_3__["Validators"].max(countHandsCtrl.value), _angular_forms__WEBPACK_IMPORTED_MODULE_3__["Validators"].min(star2Ctrl.value + 1)]);
            star3Ctrl.updateValueAndValidity();
        });
    };
    EditMixedLessonComponent.prototype.onSubmitButtonClick = function () {
        var _this = this;
        var newTitle = this.formGroup.get('titleCtrl').value;
        var lessons = this.formGroup.get('lessonsCtrl').value.map(function (lesson) { return lesson.id; });
        var chapter = this.formGroup.get('chapterCtrl').value.id;
        var countHands = this.formGroup.get('countHandsCtrl').value;
        var star1 = this.formGroup.get('star1Ctrl').value;
        var star2 = this.formGroup.get('star2Ctrl').value;
        var star3 = this.formGroup.get('star3Ctrl').value;
        var newLesson = {
            title: newTitle,
            taskIds: lessons,
            chapterId: chapter,
            id: this.chart.id,
            stackMin: +this.customRangeMinCtrl.value,
            stackMax: +this.customRangeMaxCtrl.value,
            mode: this.gameModeCtrl.value.title,
            countHands: countHands,
            star1: star1,
            star2: star2,
            star3: star3,
        };
        this.adminService.createMixedLesson(newLesson).subscribe(function () {
            _this.snackbarService.showMessage('Mixed lesson edited');
            // this.router.navigate(['charts']);
            _this.location.back();
        });
    };
    EditMixedLessonComponent.prototype.generateCustomRange = function () {
        this.customRangeMin = this.findRange(1, 25);
        this.customRangeMax = this.findRange(2, 25);
    };
    EditMixedLessonComponent.prototype.findRange = function (start, end) {
        return Array.from(Array(1 + end - start).keys()).map(function (v) { return start + v; });
    };
    EditMixedLessonComponent.prototype.onChangedMinRange = function (event) {
        this.customRangeMinCtrl.setValue(event);
    };
    EditMixedLessonComponent.prototype.onChangedMaxRange = function (event) {
        this.customRangeMaxCtrl.setValue(event);
    };
    EditMixedLessonComponent.ctorParameters = function () { return [
        { type: _services_app_service__WEBPACK_IMPORTED_MODULE_4__["AppService"] },
        { type: _services_charts_service__WEBPACK_IMPORTED_MODULE_5__["ChartsService"] },
        { type: _services_user_service__WEBPACK_IMPORTED_MODULE_6__["UserService"] },
        { type: _angular_router__WEBPACK_IMPORTED_MODULE_2__["ActivatedRoute"] },
        { type: _shared_services_snackbar_service__WEBPACK_IMPORTED_MODULE_7__["SnackbarService"] },
        { type: _angular_router__WEBPACK_IMPORTED_MODULE_2__["Router"] },
        { type: _training_services_lesson_service__WEBPACK_IMPORTED_MODULE_9__["LessonService"] },
        { type: _services_default_data_service__WEBPACK_IMPORTED_MODULE_10__["DefaultDataService"] },
        { type: _angular_common__WEBPACK_IMPORTED_MODULE_11__["Location"] }
    ]; };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"])('headerTitleTemplate', { static: true })
    ], EditMixedLessonComponent.prototype, "headerTitleTemplate", void 0);
    EditMixedLessonComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-edit-mixed-lesson',
            template: tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(/*! raw-loader!./edit-mixed-lesson.component.html */ "./node_modules/raw-loader/dist/cjs.js!./src/app/modules/charts/modules/packs/components/edit-mixed-lesson/edit-mixed-lesson.component.html")).default,
            styles: [tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(/*! ./edit-mixed-lesson.component.scss */ "./src/app/modules/charts/modules/packs/components/edit-mixed-lesson/edit-mixed-lesson.component.scss")).default]
        })
    ], EditMixedLessonComponent);
    return EditMixedLessonComponent;
}());

function defaultCompareFn(compared1, compared2) {
    return compared1 && compared2 ? compared1.id === compared2.id : compared1 === compared2;
}
function trackById(index, _a) {
    var id = _a.id;
    return id;
}
function compareIndex(c1, c2) {
    return c1 && c2 ? c1 === c2 : c1 === c2;
}


/***/ }),

/***/ "./src/app/modules/charts/modules/packs/components/flash-dialog/flash-dialog.component.scss":
/*!**************************************************************************************************!*\
  !*** ./src/app/modules/charts/modules/packs/components/flash-dialog/flash-dialog.component.scss ***!
  \**************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("@media (max-height: 590px) {\n  .hidden-height-down {\n    display: none !important;\n  }\n}\n\n@media (max-width: 319px) {\n  .hidden-ms-down {\n    display: none !important;\n  }\n}\n\n@media (min-width: 320px) {\n  .hidden-ms-up {\n    display: none !important;\n  }\n}\n\n@media (max-width: 359px) {\n  .hidden-mm-down {\n    display: none !important;\n  }\n}\n\n@media (min-width: 360px) {\n  .hidden-mm-up {\n    display: none !important;\n  }\n}\n\n@media (max-width: 479px) {\n  .hidden-ml-down {\n    display: none !important;\n  }\n}\n\n@media (min-width: 480px) {\n  .hidden-ml-up {\n    display: none !important;\n  }\n}\n\n@media (max-width: 599px) {\n  .hidden-ts-down {\n    display: none !important;\n  }\n}\n\n@media (min-width: 600px) {\n  .hidden-ts-up {\n    display: none !important;\n  }\n}\n\n@media (max-width: 719px) {\n  .hidden-tm-down {\n    display: none !important;\n  }\n}\n\n@media (min-width: 720px) {\n  .hidden-tm-up {\n    display: none !important;\n  }\n}\n\n@media (max-width: 959px) {\n  .hidden-tl-down {\n    display: none !important;\n  }\n}\n\n@media (min-width: 960px) {\n  .hidden-tl-up {\n    display: none !important;\n  }\n}\n\n@media (max-width: 1023px) {\n  .hidden-ds-down {\n    display: none !important;\n  }\n}\n\n@media (min-width: 1024px) {\n  .hidden-ds-up {\n    display: none !important;\n  }\n}\n\n@media (max-width: 1279px) {\n  .hidden-dm-down {\n    display: none !important;\n  }\n}\n\n@media (min-width: 1280px) {\n  .hidden-dm-up {\n    display: none !important;\n  }\n}\n\n@media (max-width: 1439px) {\n  .hidden-dl-down {\n    display: none !important;\n  }\n}\n\n@media (min-width: 1440px) {\n  .hidden-dl-up {\n    display: none !important;\n  }\n}\n\n.app-full-screen {\n  max-width: 100vw !important;\n  width: 100vw;\n  height: 100vh;\n}\n\n@media (min-width: 360px) {\n  .app-flash-dialog, .app-flash-dialog__result {\n    margin: 5px;\n  }\n}\n\n@media (min-width: 480px) {\n  .app-flash-dialog, .app-flash-dialog__result {\n    margin: 15px;\n  }\n}\n\n@media (min-width: 720px) {\n  .app-flash-dialog, .app-flash-dialog__result {\n    margin: 20px;\n  }\n}\n\n@media (min-width: 1024px) {\n  .app-flash-dialog, .app-flash-dialog__result {\n    margin: 40px;\n  }\n}\n\n@media (min-width: 1280px) {\n  .app-flash-dialog, .app-flash-dialog__result {\n    margin: 50px;\n  }\n}\n\n.app-flash-dialog-chart {\n  max-width: 550px;\n  max-height: 400px;\n  display: grid;\n  grid-template-columns: repeat(13, 1fr);\n  font-family: \"Graphik\";\n  font-weight: 400;\n  font-style: light;\n  margin: 20px 0;\n}\n\n.app-flash-dialog__stack-size .app-radio-button-box-wrapper {\n  width: 34px !important;\n}\n\n.app-flash-dialog__stack-size .app-radio-button-label {\n  border: 1px solid #EFF3F6 !important;\n  width: 34px !important;\n}\n\n.app-flash-dialog-button {\n  margin: 20px 0;\n}\n\n.app-flash-dialog__header {\n  display: -webkit-box;\n  display: flex;\n  -webkit-box-align: center;\n          align-items: center;\n  -webkit-box-pack: justify;\n          justify-content: space-between;\n  margin-top: 10px;\n  margin-right: 10px;\n}\n\n@media (min-width: 360px) {\n  .app-flash-dialog__header {\n    margin-left: 5px;\n  }\n}\n\n@media (min-width: 480px) {\n  .app-flash-dialog__header {\n    margin-left: 15px;\n  }\n}\n\n@media (min-width: 720px) {\n  .app-flash-dialog__header {\n    margin-left: 20px;\n  }\n}\n\n@media (min-width: 1024px) {\n  .app-flash-dialog__header {\n    margin-left: 40px;\n  }\n}\n\n@media (min-width: 1280px) {\n  .app-flash-dialog__header {\n    margin-left: 50px;\n  }\n}\n\n.app-flash-dialog__link {\n  font-weight: 500;\n  font-stretch: normal;\n  font-size: 20px;\n  font-family: Roboto, \"Helvetica Neue\", sans-serif;\n  color: #009688;\n  outline: none;\n}\n\n.app-flash-dialog__link::first-letter {\n  text-transform: uppercase;\n}\n\n.app-flash-dialog__link:last-child {\n  color: #EFF3F6;\n  overflow: hidden;\n  white-space: nowrap;\n  text-overflow: ellipsis;\n}\n\n@media (min-width: 360px) {\n  .app-flash-dialog__link:last-child {\n    max-width: 120px;\n  }\n}\n\n@media (min-width: 480px) {\n  .app-flash-dialog__link:last-child {\n    max-width: 240px;\n  }\n}\n\n@media (min-width: 720px) {\n  .app-flash-dialog__link:last-child {\n    max-width: 360px;\n  }\n}\n\n@media (min-width: 1024px) {\n  .app-flash-dialog__link:last-child {\n    max-width: 480px;\n  }\n}\n\n@media (min-width: 1280px) {\n  .app-flash-dialog__link:last-child {\n    max-width: 600px;\n  }\n}\n\n.app-flash-dialog__result-hand {\n  padding: 10px 0;\n}\n\n.app-flash-dialog__result-game-type {\n  padding: 10px 0;\n}\n\n.app-flash-dialog__result-block-row {\n  display: -webkit-box;\n  display: flex;\n}\n\n.app-flash-dialog__result-action {\n  width: 50px;\n  height: 50px;\n  font-size: 10px;\n  box-sizing: border-box;\n  position: relative;\n}\n\n.app-flash-dialog__result-action_bordered {\n  border: 1px solid white;\n}\n\n.app-flash-dialog__result-action-title {\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  top: 0;\n  padding: 5px;\n  z-index: 99;\n  color: white;\n}\n\n.app-flash-dialog__result-action-title_black {\n  color: black;\n}\n\n.app-flash-dialog__result-action__zone {\n  height: 100%;\n  display: inline-block;\n  box-sizing: border-box;\n  padding-top: 20px;\n  position: relative;\n}\n\n.app-flash-dialog__result-action-factor {\n  position: absolute;\n  left: 5px;\n  bottom: 5px;\n  font-size: 8px;\n  word-wrap: break-word;\n}\n\n.app-flash-dialog__result-wrap {\n  display: -webkit-box;\n  display: flex;\n}\n\n.app-flash-dialog__result-left {\n  padding-bottom: 50px;\n}\n\n.app-flash-dialog__result-right {\n  padding-bottom: 50px;\n}\n\n@media (min-width: 600px) {\n  .app-flash-dialog__result-right {\n    margin-left: 80px;\n  }\n}\n\n.app-flash-dialog-swiper {\n  --swiper-pagination-color: #009688;\n}\n\n.app-flash-dialog__change-button {\n  width: 250px;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3Byb2plY3RzL3ByZWZsb3AtaGVyby9zcmMvc3R5bGVzL3ZhcmlhYmxlcy5zY3NzIiwic3JjL2FwcC9tb2R1bGVzL2NoYXJ0cy9tb2R1bGVzL3BhY2tzL2NvbXBvbmVudHMvZmxhc2gtZGlhbG9nL2ZsYXNoLWRpYWxvZy5jb21wb25lbnQuc2NzcyIsIi9ob21lL3Byb2plY3RzL3ByZWZsb3AtaGVyby9zcmMvYXBwL21vZHVsZXMvY2hhcnRzL21vZHVsZXMvcGFja3MvY29tcG9uZW50cy9mbGFzaC1kaWFsb2cvZmxhc2gtZGlhbG9nLmNvbXBvbmVudC5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQWtGRTtFQURGO0lBRUksd0JBQUE7RUNoRkY7QUFDRjs7QUQwRkU7RUFPQTtJQUVJLHdCQUFBO0VDOUZKO0FBQ0Y7O0FEOEVFO0VBbUJBO0lBRUksd0JBQUE7RUM5Rko7QUFDRjs7QUQ4RUU7RUFPQTtJQUVJLHdCQUFBO0VDbEZKO0FBQ0Y7O0FEa0VFO0VBbUJBO0lBRUksd0JBQUE7RUNsRko7QUFDRjs7QURrRUU7RUFPQTtJQUVJLHdCQUFBO0VDdEVKO0FBQ0Y7O0FEc0RFO0VBbUJBO0lBRUksd0JBQUE7RUN0RUo7QUFDRjs7QURzREU7RUFPQTtJQUVJLHdCQUFBO0VDMURKO0FBQ0Y7O0FEMENFO0VBbUJBO0lBRUksd0JBQUE7RUMxREo7QUFDRjs7QUQwQ0U7RUFPQTtJQUVJLHdCQUFBO0VDOUNKO0FBQ0Y7O0FEOEJFO0VBbUJBO0lBRUksd0JBQUE7RUM5Q0o7QUFDRjs7QUQ4QkU7RUFPQTtJQUVJLHdCQUFBO0VDbENKO0FBQ0Y7O0FEa0JFO0VBbUJBO0lBRUksd0JBQUE7RUNsQ0o7QUFDRjs7QURrQkU7RUFPQTtJQUVJLHdCQUFBO0VDdEJKO0FBQ0Y7O0FETUU7RUFtQkE7SUFFSSx3QkFBQTtFQ3RCSjtBQUNGOztBRE1FO0VBT0E7SUFFSSx3QkFBQTtFQ1ZKO0FBQ0Y7O0FETkU7RUFtQkE7SUFFSSx3QkFBQTtFQ1ZKO0FBQ0Y7O0FETkU7RUFPQTtJQUVJLHdCQUFBO0VDRUo7QUFDRjs7QURsQkU7RUFtQkE7SUFFSSx3QkFBQTtFQ0VKO0FBQ0Y7O0FDOUdBO0VBQ0UsMkJBQUE7RUFDQSxZQUFBO0VBQ0EsYUFBQTtBRGlIRjs7QUQ5QkU7RUVoRkY7SUY0R0ksV0FBQTtFQ09GO0FBQ0Y7O0FEcENFO0VFaEZGO0lGZ0hJLFlBQUE7RUNRRjtBQUNGOztBRHpDRTtFRWhGRjtJRm9ISSxZQUFBO0VDU0Y7QUFDRjs7QUQ5Q0U7RUVoRkY7SUZ3SEksWUFBQTtFQ1VGO0FBQ0Y7O0FEbkRFO0VFaEZGO0lGNEhJLFlBQUE7RUNXRjtBQUNGOztBQ2pJQTtFQUNFLGdCQUFBO0VBQ0EsaUJBQUE7RUFDQSxhQUFBO0VBQ0Esc0NBQUE7RUZZQSxzQkFzQmM7RUFyQmQsZ0JBcUJ5QjtFQXBCekIsaUJBb0I4QjtFRWhDOUIsY0FBQTtBRHNJRjs7QUNsSUU7RUFDRSxzQkFBQTtBRHFJSjs7QUNsSUU7RUFDRSxvQ0FBQTtFQUNBLHNCQUFBO0FEb0lKOztBQ2hJQTtFQUNFLGNBQUE7QURtSUY7O0FDaElBO0VBQ0Usb0JBQUE7RUFBQSxhQUFBO0VBQ0EseUJBQUE7VUFBQSxtQkFBQTtFQUNBLHlCQUFBO1VBQUEsOEJBQUE7RUFDQSxnQkFBQTtFQUNBLGtCQUFBO0FEbUlGOztBRHZGRTtFRWpERjtJRjZFSSxnQkFBQTtFQytERjtBQUNGOztBRDVGRTtFRWpERjtJRmlGSSxpQkFBQTtFQ2dFRjtBQUNGOztBRGpHRTtFRWpERjtJRnFGSSxpQkFBQTtFQ2lFRjtBQUNGOztBRHRHRTtFRWpERjtJRnlGSSxpQkFBQTtFQ2tFRjtBQUNGOztBRDNHRTtFRWpERjtJRjZGSSxpQkFBQTtFQ21FRjtBQUNGOztBQ3hKQTtFQUNFLGdCQUFBO0VBQ0Esb0JBQUE7RUFDQSxlQUFBO0VBQ0EsaURBQUE7RUFDQSxjRmhETTtFRWlETixhQUFBO0FEMkpGOztBQ3pKRTtFQUNFLHlCQUFBO0FEMkpKOztBQ3ZKRTtFQUNFLGNGckRJO0VFc0RKLGdCQUFBO0VBQ0EsbUJBQUE7RUFDQSx1QkFBQTtBRHlKSjs7QURsSUU7RUUzQkE7SUZ1REUsZ0JBQUE7RUMwR0Y7QUFDRjs7QUR2SUU7RUUzQkE7SUYyREUsZ0JBQUE7RUMyR0Y7QUFDRjs7QUQ1SUU7RUUzQkE7SUYrREUsZ0JBQUE7RUM0R0Y7QUFDRjs7QURqSkU7RUUzQkE7SUZtRUUsZ0JBQUE7RUM2R0Y7QUFDRjs7QUR0SkU7RUUzQkE7SUZ1RUUsZ0JBQUE7RUM4R0Y7QUFDRjs7QUMzS0E7RUFDRSxlQUFBO0FEOEtGOztBQzNLQTtFQUNFLGVBQUE7QUQ4S0Y7O0FDM0tBO0VBQ0Usb0JBQUE7RUFBQSxhQUFBO0FEOEtGOztBQzNLQTtFQUNFLFdBQUE7RUFDQSxZQUFBO0VBQ0EsZUFBQTtFQUNBLHNCQUFBO0VBQ0Esa0JBQUE7QUQ4S0Y7O0FDM0tBO0VBQ0UsdUJBQUE7QUQ4S0Y7O0FDM0tBO0VBQ0Usa0JBQUE7RUFDQSxXQUFBO0VBQ0EsWUFBQTtFQUNBLE1BQUE7RUFDQSxZQUFBO0VBQ0EsV0FBQTtFQUNBLFlBQUE7QUQ4S0Y7O0FDM0tBO0VBQ0UsWUFBQTtBRDhLRjs7QUMzS0E7RUFDRSxZQUFBO0VBQ0EscUJBQUE7RUFDQSxzQkFBQTtFQUNBLGlCQUFBO0VBQ0Esa0JBQUE7QUQ4S0Y7O0FDM0tBO0VBQ0Usa0JBQUE7RUFDQSxTQUFBO0VBQ0EsV0FBQTtFQUNBLGNBQUE7RUFDQSxxQkFBQTtBRDhLRjs7QUMzS0E7RUFDRSxvQkFBQTtFQUFBLGFBQUE7QUQ4S0Y7O0FDM0tBO0VBQ0Usb0JBQUE7QUQ4S0Y7O0FDM0tBO0VBQ0Usb0JBQUE7QUQ4S0Y7O0FEN05FO0VFOENGO0lBR0ksaUJBQUE7RURnTEY7QUFDRjs7QUM3S0E7RUFDRSxrQ0FBQTtBRGdMRjs7QUM3S0E7RUFDRSxZQUFBO0FEZ0xGIiwiZmlsZSI6InNyYy9hcHAvbW9kdWxlcy9jaGFydHMvbW9kdWxlcy9wYWNrcy9jb21wb25lbnRzL2ZsYXNoLWRpYWxvZy9mbGFzaC1kaWFsb2cuY29tcG9uZW50LnNjc3MiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBjb2xvcnNcbiRncmF5LTE6ICMzMDM3NEE7XG4kZ3JheS0yOiAjNDg0RjYyO1xuJGdyYXktMzogIzQ4NEY2MjtcblxuJGdyZWVuOiAjMDA5Njg4O1xuJGdyZWVuLTI6ICM0M0EwNDc7XG4kZ3JlZW4tMzogIzAwQjVBNTtcblxuJHdoaXRlOiAjRUZGM0Y2O1xuJHdoaXRlLTI6ICNFN0VCRUU7XG5cbiRyZWQ6ICNENDI2NDc7XG4kcmVkLTI6ICNGRjZGNjA7XG5cbiRvcmFuZ2U6ICNGQUEzMEQ7XG5cbiRibGFjay0xOiAjMjYzMjM4O1xuJGJsYWNrLTI6ICMzNzQ3NEY7XG5cbiRjYXJkLWNvbG9yLXJlZDogI0VGNTM1MDtcbiRjYXJkLWNvbG9yLWJsYWNrOiAjNjE2MTYxO1xuJGNhcmQtY29sb3ItYmx1ZTogIzNGNTFCNTtcbiRjYXJkLWNvbG9yLWdyZWVuOiAjNDNBMDQ3O1xuXG4vLyBzaGFkb3dcbiRzaGFkb3ctZ3JlZW46ICAwIDFweCAzcHggMCAkZ3JheS0xO1xuXG5cbi8vIGZvbnRzXG5AbWl4aW4gZm9udCgkZm9udEZhbWlseSwgJGZvbnRXZWlnaHQsICRmb250U3R5bGUpIHtcbiAgZm9udC1mYW1pbHk6ICRmb250RmFtaWx5O1xuICBmb250LXdlaWdodDogJGZvbnRXZWlnaHQ7XG4gIGZvbnQtc3R5bGU6ICRmb250U3R5bGU7XG59XG5cbkBtaXhpbiBncmFwaGlrLWJvbGQoKSB7XG4gIEBpbmNsdWRlIGZvbnQoJ0dyYXBoaWsnLCBib2xkLCBub3JtYWwpO1xufVxuXG5AbWl4aW4gZ3JhcGhpay1zZW1pYm9sZCgpIHtcbiAgQGluY2x1ZGUgZm9udCgnR3JhcGhpaycsIDYwMCwgbm9ybWFsKTtcbn1cblxuQG1peGluIGdyYXBoaWstcmVndWxhcigpIHtcbiAgQGluY2x1ZGUgZm9udCgnR3JhcGhpaycsIG5vcm1hbCwgbm9ybWFsKTtcbn1cblxuQG1peGluIGdyYXBoaWstc2VtaWJvbGQtaXRhbGljKCkge1xuICBAaW5jbHVkZSBmb250KCdHcmFwaGlrJywgNjAwLCBpdGFsaWMpO1xufVxuXG5AbWl4aW4gZ3JhcGhpay1saWdodCgpIHtcbiAgQGluY2x1ZGUgZm9udCgnR3JhcGhpaycsIDQwMCwgbGlnaHQpO1xufVxuXG4vL3NjcmVlbiBzaXplc1xuJHNjcmVlbi1tczogMzIwcHg7XG4kc2NyZWVuLW1tOiAzNjBweDsgLy8gZmlyc3RcbiRzY3JlZW4tbWw6IDQ4MHB4OyAvLyAkc2Vjb25kXG4kc2NyZWVuLXRzOiA2MDBweDtcbiRzY3JlZW4tdG06IDcyMHB4OyAvLyB0aGlyZFxuJHNjcmVlbi10bDogOTYwcHg7XG4kc2NyZWVuLWRzOiAxMDI0cHg7IC8vIGZvdXJ0aFxuJHNjcmVlbi1kbTogMTI4MHB4OyAvLyBmaWZ0aFxuJHNjcmVlbi1kbDogMTQ0MHB4O1xuXG5cblxuJGdyaWQ6IChcbiAgJ21zJzogMzIwcHgsXG4gICdtbSc6IDM2MHB4LFxuICAnbWwnOiA0ODBweCxcbiAgJ3RzJzogNjAwcHgsXG4gICd0bSc6IDcyMHB4LFxuICAndGwnOiA5NjBweCxcbiAgJ2RzJzogMTAyNHB4LFxuICAnZG0nOiAxMjgwcHgsXG4gICdkbCc6IDE0NDBweCxcbik7XG5cbi5oaWRkZW4taGVpZ2h0LWRvd24ge1xuICBAbWVkaWEgKG1heC1oZWlnaHQ6IDU5MHB4KSB7XG4gICAgZGlzcGxheTogbm9uZSAhaW1wb3J0YW50O1xuICB9XG59XG5cbkBtaXhpbiBhYm92ZSgkYnJlYWtwb2ludHMpIHtcbiAgQG1lZGlhIChtaW4td2lkdGg6ICN7JGJyZWFrcG9pbnRzfSkge1xuICAgIEBjb250ZW50O1xuICB9XG59XG5cbkBtaXhpbiBiZWxvdygkYnJlYWtwb2ludHMpIHtcbiAgQG1lZGlhIChtYXgtd2lkdGg6ICN7JGJyZWFrcG9pbnRzfSkge1xuICAgIEBjb250ZW50O1xuICB9XG59XG5cbkBlYWNoICRrZXksICR2YWx1ZSBpbiAkZ3JpZCB7XG5cbiAgLmhpZGRlbi0jeyRrZXl9LWRvd24ge1xuICAgIEBpbmNsdWRlIGJlbG93KCN7JHZhbHVlIC0gMX0pIHtcbiAgICAgIGRpc3BsYXk6IG5vbmUgIWltcG9ydGFudDtcbiAgICB9XG4gIH1cblxuICAuaGlkZGVuLSN7JGtleX0tdXAge1xuICAgIEBpbmNsdWRlIGFib3ZlKCN7JHZhbHVlfSkge1xuICAgICAgZGlzcGxheTogbm9uZSAhaW1wb3J0YW50O1xuICAgIH1cbiAgfVxufVxuXG5AbWl4aW4gYWJvdmVTY3JlZW5TaXplKCR0eXBlLCAkZmlyc3QsICRzZWNvbmQsICR0aGlyZCwgJGZvdXJ0aCwgJGZpZnRoKSB7XG4gIEBpbmNsdWRlIGFib3ZlKCRzY3JlZW4tbW0pIHtcbiAgICAjeyR0eXBlfTogJGZpcnN0ICsgcHg7XG4gIH1cblxuICBAaW5jbHVkZSBhYm92ZSgkc2NyZWVuLW1sKSB7XG4gICAgI3skdHlwZX06ICRzZWNvbmQgKyBweDtcbiAgfVxuXG4gIEBpbmNsdWRlIGFib3ZlKCRzY3JlZW4tdG0pIHtcbiAgICAjeyR0eXBlfTogJHRoaXJkICsgcHg7XG4gIH1cblxuICBAaW5jbHVkZSBhYm92ZSgkc2NyZWVuLWRzKSB7XG4gICAgI3skdHlwZX06ICRmb3VydGggKyBweDtcbiAgfVxuXG4gIEBpbmNsdWRlIGFib3ZlKCRzY3JlZW4tZG0pIHtcbiAgICAjeyR0eXBlfTogJGZpZnRoICsgcHg7XG4gIH1cbn1cblxuQG1peGluIGFib3ZlU2NyZWVuU2l6ZVdpdGhEaW1lbnNpb24oJHR5cGUsICRmaXJzdCwgJHNlY29uZCwgJHRoaXJkLCAkZm91cnRoLCAkZmlmdGgsICRkaW1lbnNpb24pIHtcbiAgQGluY2x1ZGUgYWJvdmUoJHNjcmVlbi1tbSkge1xuICAgICN7JHR5cGV9OiAkZmlyc3QgKyAkZGltZW5zaW9uO1xuICB9XG5cbiAgQGluY2x1ZGUgYWJvdmUoJHNjcmVlbi1tbCkge1xuICAgICN7JHR5cGV9OiAkc2Vjb25kICsgJGRpbWVuc2lvbjtcbiAgfVxuXG4gIEBpbmNsdWRlIGFib3ZlKCRzY3JlZW4tdG0pIHtcbiAgICAjeyR0eXBlfTogJHRoaXJkICsgJGRpbWVuc2lvbjtcbiAgfVxuXG4gIEBpbmNsdWRlIGFib3ZlKCRzY3JlZW4tZHMpIHtcbiAgICAjeyR0eXBlfTogJGZvdXJ0aCArICRkaW1lbnNpb247XG4gIH1cblxuICBAaW5jbHVkZSBhYm92ZSgkc2NyZWVuLWRtKSB7XG4gICAgI3skdHlwZX06ICRmaWZ0aCArICRkaW1lbnNpb247XG4gIH1cbn1cblxuQG1peGluIGJlbG93U2NyZWVuU2l6ZSgkdHlwZSwgJGZpcnN0LCAkc2Vjb25kLCAkdGhpcmQsICRmb3VydGgsICRmaWZ0aCkge1xuICBAaW5jbHVkZSBiZWxvdygkc2NyZWVuLW1tKSB7XG4gICAgI3skdHlwZX06ICRmaXJzdCArIHB4O1xuICB9XG5cbiAgQGluY2x1ZGUgYmVsb3coJHNjcmVlbi1tbCkge1xuICAgICN7JHR5cGV9OiAkc2Vjb25kICsgcHg7XG4gIH1cblxuICBAaW5jbHVkZSBiZWxvdygkc2NyZWVuLXRtKSB7XG4gICAgI3skdHlwZX06ICR0aGlyZCArIHB4O1xuICB9XG5cbiAgQGluY2x1ZGUgYmVsb3coJHNjcmVlbi1kcykge1xuICAgICN7JHR5cGV9OiAkZm91cnRoICsgcHg7XG4gIH1cblxuICBAaW5jbHVkZSBiZWxvdygkc2NyZWVuLWRtKSB7XG4gICAgI3skdHlwZX06ICRmaWZ0aCArIHB4O1xuICB9XG59XG5cbkBtaXhpbiBpY29uU2l6ZVNjcmVlblNpemUoJGZpcnN0LCAkc2Vjb25kLCAkdGhpcmQsICRmb3VydGgsICRmaWZ0aCkge1xuICBAaW5jbHVkZSBhYm92ZSgkc2NyZWVuLW1tKSB7XG4gICAgd2lkdGg6ICRmaXJzdCArIHB4ICFpbXBvcnRhbnQ7XG4gICAgaGVpZ2h0OiAkZmlyc3QgKyBweCAhaW1wb3J0YW50O1xuICB9XG5cbiAgQGluY2x1ZGUgYWJvdmUoJHNjcmVlbi1tbCkge1xuICAgIHdpZHRoOiAkc2Vjb25kICsgcHggIWltcG9ydGFudDtcbiAgICBoZWlnaHQ6ICRzZWNvbmQgKyBweCAhaW1wb3J0YW50O1xuICB9XG5cbiAgQGluY2x1ZGUgYWJvdmUoJHNjcmVlbi10bSkge1xuICAgIHdpZHRoOiAkdGhpcmQgKyBweCAhaW1wb3J0YW50O1xuICAgIGhlaWdodDogJHRoaXJkICsgcHggIWltcG9ydGFudDtcbiAgfVxuXG4gIEBpbmNsdWRlIGFib3ZlKCRzY3JlZW4tZHMpIHtcbiAgICB3aWR0aDogJGZvdXJ0aCArIHB4ICFpbXBvcnRhbnQ7XG4gICAgaGVpZ2h0OiAkZm91cnRoICsgcHggIWltcG9ydGFudDtcbiAgfVxuXG4gIEBpbmNsdWRlIGFib3ZlKCRzY3JlZW4tZG0pIHtcbiAgICB3aWR0aDogJGZpZnRoICsgcHggIWltcG9ydGFudDtcbiAgICBoZWlnaHQ6ICRmaWZ0aCArIHB4ICFpbXBvcnRhbnQ7XG4gIH1cbn1cblxuXG4iLCJAbWVkaWEgKG1heC1oZWlnaHQ6IDU5MHB4KSB7XG4gIC5oaWRkZW4taGVpZ2h0LWRvd24ge1xuICAgIGRpc3BsYXk6IG5vbmUgIWltcG9ydGFudDtcbiAgfVxufVxuXG5AbWVkaWEgKG1heC13aWR0aDogMzE5cHgpIHtcbiAgLmhpZGRlbi1tcy1kb3duIHtcbiAgICBkaXNwbGF5OiBub25lICFpbXBvcnRhbnQ7XG4gIH1cbn1cblxuQG1lZGlhIChtaW4td2lkdGg6IDMyMHB4KSB7XG4gIC5oaWRkZW4tbXMtdXAge1xuICAgIGRpc3BsYXk6IG5vbmUgIWltcG9ydGFudDtcbiAgfVxufVxuXG5AbWVkaWEgKG1heC13aWR0aDogMzU5cHgpIHtcbiAgLmhpZGRlbi1tbS1kb3duIHtcbiAgICBkaXNwbGF5OiBub25lICFpbXBvcnRhbnQ7XG4gIH1cbn1cblxuQG1lZGlhIChtaW4td2lkdGg6IDM2MHB4KSB7XG4gIC5oaWRkZW4tbW0tdXAge1xuICAgIGRpc3BsYXk6IG5vbmUgIWltcG9ydGFudDtcbiAgfVxufVxuXG5AbWVkaWEgKG1heC13aWR0aDogNDc5cHgpIHtcbiAgLmhpZGRlbi1tbC1kb3duIHtcbiAgICBkaXNwbGF5OiBub25lICFpbXBvcnRhbnQ7XG4gIH1cbn1cblxuQG1lZGlhIChtaW4td2lkdGg6IDQ4MHB4KSB7XG4gIC5oaWRkZW4tbWwtdXAge1xuICAgIGRpc3BsYXk6IG5vbmUgIWltcG9ydGFudDtcbiAgfVxufVxuXG5AbWVkaWEgKG1heC13aWR0aDogNTk5cHgpIHtcbiAgLmhpZGRlbi10cy1kb3duIHtcbiAgICBkaXNwbGF5OiBub25lICFpbXBvcnRhbnQ7XG4gIH1cbn1cblxuQG1lZGlhIChtaW4td2lkdGg6IDYwMHB4KSB7XG4gIC5oaWRkZW4tdHMtdXAge1xuICAgIGRpc3BsYXk6IG5vbmUgIWltcG9ydGFudDtcbiAgfVxufVxuXG5AbWVkaWEgKG1heC13aWR0aDogNzE5cHgpIHtcbiAgLmhpZGRlbi10bS1kb3duIHtcbiAgICBkaXNwbGF5OiBub25lICFpbXBvcnRhbnQ7XG4gIH1cbn1cblxuQG1lZGlhIChtaW4td2lkdGg6IDcyMHB4KSB7XG4gIC5oaWRkZW4tdG0tdXAge1xuICAgIGRpc3BsYXk6IG5vbmUgIWltcG9ydGFudDtcbiAgfVxufVxuXG5AbWVkaWEgKG1heC13aWR0aDogOTU5cHgpIHtcbiAgLmhpZGRlbi10bC1kb3duIHtcbiAgICBkaXNwbGF5OiBub25lICFpbXBvcnRhbnQ7XG4gIH1cbn1cblxuQG1lZGlhIChtaW4td2lkdGg6IDk2MHB4KSB7XG4gIC5oaWRkZW4tdGwtdXAge1xuICAgIGRpc3BsYXk6IG5vbmUgIWltcG9ydGFudDtcbiAgfVxufVxuXG5AbWVkaWEgKG1heC13aWR0aDogMTAyM3B4KSB7XG4gIC5oaWRkZW4tZHMtZG93biB7XG4gICAgZGlzcGxheTogbm9uZSAhaW1wb3J0YW50O1xuICB9XG59XG5cbkBtZWRpYSAobWluLXdpZHRoOiAxMDI0cHgpIHtcbiAgLmhpZGRlbi1kcy11cCB7XG4gICAgZGlzcGxheTogbm9uZSAhaW1wb3J0YW50O1xuICB9XG59XG5cbkBtZWRpYSAobWF4LXdpZHRoOiAxMjc5cHgpIHtcbiAgLmhpZGRlbi1kbS1kb3duIHtcbiAgICBkaXNwbGF5OiBub25lICFpbXBvcnRhbnQ7XG4gIH1cbn1cblxuQG1lZGlhIChtaW4td2lkdGg6IDEyODBweCkge1xuICAuaGlkZGVuLWRtLXVwIHtcbiAgICBkaXNwbGF5OiBub25lICFpbXBvcnRhbnQ7XG4gIH1cbn1cblxuQG1lZGlhIChtYXgtd2lkdGg6IDE0MzlweCkge1xuICAuaGlkZGVuLWRsLWRvd24ge1xuICAgIGRpc3BsYXk6IG5vbmUgIWltcG9ydGFudDtcbiAgfVxufVxuXG5AbWVkaWEgKG1pbi13aWR0aDogMTQ0MHB4KSB7XG4gIC5oaWRkZW4tZGwtdXAge1xuICAgIGRpc3BsYXk6IG5vbmUgIWltcG9ydGFudDtcbiAgfVxufVxuXG4uYXBwLWZ1bGwtc2NyZWVuIHtcbiAgbWF4LXdpZHRoOiAxMDB2dyAhaW1wb3J0YW50O1xuICB3aWR0aDogMTAwdnc7XG4gIGhlaWdodDogMTAwdmg7XG59XG5cbkBtZWRpYSAobWluLXdpZHRoOiAzNjBweCkge1xuICAuYXBwLWZsYXNoLWRpYWxvZywgLmFwcC1mbGFzaC1kaWFsb2dfX3Jlc3VsdCB7XG4gICAgbWFyZ2luOiA1cHg7XG4gIH1cbn1cbkBtZWRpYSAobWluLXdpZHRoOiA0ODBweCkge1xuICAuYXBwLWZsYXNoLWRpYWxvZywgLmFwcC1mbGFzaC1kaWFsb2dfX3Jlc3VsdCB7XG4gICAgbWFyZ2luOiAxNXB4O1xuICB9XG59XG5AbWVkaWEgKG1pbi13aWR0aDogNzIwcHgpIHtcbiAgLmFwcC1mbGFzaC1kaWFsb2csIC5hcHAtZmxhc2gtZGlhbG9nX19yZXN1bHQge1xuICAgIG1hcmdpbjogMjBweDtcbiAgfVxufVxuQG1lZGlhIChtaW4td2lkdGg6IDEwMjRweCkge1xuICAuYXBwLWZsYXNoLWRpYWxvZywgLmFwcC1mbGFzaC1kaWFsb2dfX3Jlc3VsdCB7XG4gICAgbWFyZ2luOiA0MHB4O1xuICB9XG59XG5AbWVkaWEgKG1pbi13aWR0aDogMTI4MHB4KSB7XG4gIC5hcHAtZmxhc2gtZGlhbG9nLCAuYXBwLWZsYXNoLWRpYWxvZ19fcmVzdWx0IHtcbiAgICBtYXJnaW46IDUwcHg7XG4gIH1cbn1cblxuLmFwcC1mbGFzaC1kaWFsb2ctY2hhcnQge1xuICBtYXgtd2lkdGg6IDU1MHB4O1xuICBtYXgtaGVpZ2h0OiA0MDBweDtcbiAgZGlzcGxheTogZ3JpZDtcbiAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiByZXBlYXQoMTMsIDFmcik7XG4gIGZvbnQtZmFtaWx5OiBcIkdyYXBoaWtcIjtcbiAgZm9udC13ZWlnaHQ6IDQwMDtcbiAgZm9udC1zdHlsZTogbGlnaHQ7XG4gIG1hcmdpbjogMjBweCAwO1xufVxuXG4uYXBwLWZsYXNoLWRpYWxvZ19fc3RhY2stc2l6ZSAuYXBwLXJhZGlvLWJ1dHRvbi1ib3gtd3JhcHBlciB7XG4gIHdpZHRoOiAzNHB4ICFpbXBvcnRhbnQ7XG59XG4uYXBwLWZsYXNoLWRpYWxvZ19fc3RhY2stc2l6ZSAuYXBwLXJhZGlvLWJ1dHRvbi1sYWJlbCB7XG4gIGJvcmRlcjogMXB4IHNvbGlkICNFRkYzRjYgIWltcG9ydGFudDtcbiAgd2lkdGg6IDM0cHggIWltcG9ydGFudDtcbn1cblxuLmFwcC1mbGFzaC1kaWFsb2ctYnV0dG9uIHtcbiAgbWFyZ2luOiAyMHB4IDA7XG59XG5cbi5hcHAtZmxhc2gtZGlhbG9nX19oZWFkZXIge1xuICBkaXNwbGF5OiBmbGV4O1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XG4gIG1hcmdpbi10b3A6IDEwcHg7XG4gIG1hcmdpbi1yaWdodDogMTBweDtcbn1cbkBtZWRpYSAobWluLXdpZHRoOiAzNjBweCkge1xuICAuYXBwLWZsYXNoLWRpYWxvZ19faGVhZGVyIHtcbiAgICBtYXJnaW4tbGVmdDogNXB4O1xuICB9XG59XG5AbWVkaWEgKG1pbi13aWR0aDogNDgwcHgpIHtcbiAgLmFwcC1mbGFzaC1kaWFsb2dfX2hlYWRlciB7XG4gICAgbWFyZ2luLWxlZnQ6IDE1cHg7XG4gIH1cbn1cbkBtZWRpYSAobWluLXdpZHRoOiA3MjBweCkge1xuICAuYXBwLWZsYXNoLWRpYWxvZ19faGVhZGVyIHtcbiAgICBtYXJnaW4tbGVmdDogMjBweDtcbiAgfVxufVxuQG1lZGlhIChtaW4td2lkdGg6IDEwMjRweCkge1xuICAuYXBwLWZsYXNoLWRpYWxvZ19faGVhZGVyIHtcbiAgICBtYXJnaW4tbGVmdDogNDBweDtcbiAgfVxufVxuQG1lZGlhIChtaW4td2lkdGg6IDEyODBweCkge1xuICAuYXBwLWZsYXNoLWRpYWxvZ19faGVhZGVyIHtcbiAgICBtYXJnaW4tbGVmdDogNTBweDtcbiAgfVxufVxuXG4uYXBwLWZsYXNoLWRpYWxvZ19fbGluayB7XG4gIGZvbnQtd2VpZ2h0OiA1MDA7XG4gIGZvbnQtc3RyZXRjaDogbm9ybWFsO1xuICBmb250LXNpemU6IDIwcHg7XG4gIGZvbnQtZmFtaWx5OiBSb2JvdG8sIFwiSGVsdmV0aWNhIE5ldWVcIiwgc2Fucy1zZXJpZjtcbiAgY29sb3I6ICMwMDk2ODg7XG4gIG91dGxpbmU6IG5vbmU7XG59XG4uYXBwLWZsYXNoLWRpYWxvZ19fbGluazo6Zmlyc3QtbGV0dGVyIHtcbiAgdGV4dC10cmFuc2Zvcm06IHVwcGVyY2FzZTtcbn1cbi5hcHAtZmxhc2gtZGlhbG9nX19saW5rOmxhc3QtY2hpbGQge1xuICBjb2xvcjogI0VGRjNGNjtcbiAgb3ZlcmZsb3c6IGhpZGRlbjtcbiAgd2hpdGUtc3BhY2U6IG5vd3JhcDtcbiAgdGV4dC1vdmVyZmxvdzogZWxsaXBzaXM7XG59XG5AbWVkaWEgKG1pbi13aWR0aDogMzYwcHgpIHtcbiAgLmFwcC1mbGFzaC1kaWFsb2dfX2xpbms6bGFzdC1jaGlsZCB7XG4gICAgbWF4LXdpZHRoOiAxMjBweDtcbiAgfVxufVxuQG1lZGlhIChtaW4td2lkdGg6IDQ4MHB4KSB7XG4gIC5hcHAtZmxhc2gtZGlhbG9nX19saW5rOmxhc3QtY2hpbGQge1xuICAgIG1heC13aWR0aDogMjQwcHg7XG4gIH1cbn1cbkBtZWRpYSAobWluLXdpZHRoOiA3MjBweCkge1xuICAuYXBwLWZsYXNoLWRpYWxvZ19fbGluazpsYXN0LWNoaWxkIHtcbiAgICBtYXgtd2lkdGg6IDM2MHB4O1xuICB9XG59XG5AbWVkaWEgKG1pbi13aWR0aDogMTAyNHB4KSB7XG4gIC5hcHAtZmxhc2gtZGlhbG9nX19saW5rOmxhc3QtY2hpbGQge1xuICAgIG1heC13aWR0aDogNDgwcHg7XG4gIH1cbn1cbkBtZWRpYSAobWluLXdpZHRoOiAxMjgwcHgpIHtcbiAgLmFwcC1mbGFzaC1kaWFsb2dfX2xpbms6bGFzdC1jaGlsZCB7XG4gICAgbWF4LXdpZHRoOiA2MDBweDtcbiAgfVxufVxuXG4uYXBwLWZsYXNoLWRpYWxvZ19fcmVzdWx0LWhhbmQge1xuICBwYWRkaW5nOiAxMHB4IDA7XG59XG5cbi5hcHAtZmxhc2gtZGlhbG9nX19yZXN1bHQtZ2FtZS10eXBlIHtcbiAgcGFkZGluZzogMTBweCAwO1xufVxuXG4uYXBwLWZsYXNoLWRpYWxvZ19fcmVzdWx0LWJsb2NrLXJvdyB7XG4gIGRpc3BsYXk6IGZsZXg7XG59XG5cbi5hcHAtZmxhc2gtZGlhbG9nX19yZXN1bHQtYWN0aW9uIHtcbiAgd2lkdGg6IDUwcHg7XG4gIGhlaWdodDogNTBweDtcbiAgZm9udC1zaXplOiAxMHB4O1xuICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xuICBwb3NpdGlvbjogcmVsYXRpdmU7XG59XG5cbi5hcHAtZmxhc2gtZGlhbG9nX19yZXN1bHQtYWN0aW9uX2JvcmRlcmVkIHtcbiAgYm9yZGVyOiAxcHggc29saWQgd2hpdGU7XG59XG5cbi5hcHAtZmxhc2gtZGlhbG9nX19yZXN1bHQtYWN0aW9uLXRpdGxlIHtcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICB3aWR0aDogMTAwJTtcbiAgaGVpZ2h0OiAxMDAlO1xuICB0b3A6IDA7XG4gIHBhZGRpbmc6IDVweDtcbiAgei1pbmRleDogOTk7XG4gIGNvbG9yOiB3aGl0ZTtcbn1cblxuLmFwcC1mbGFzaC1kaWFsb2dfX3Jlc3VsdC1hY3Rpb24tdGl0bGVfYmxhY2sge1xuICBjb2xvcjogYmxhY2s7XG59XG5cbi5hcHAtZmxhc2gtZGlhbG9nX19yZXN1bHQtYWN0aW9uX196b25lIHtcbiAgaGVpZ2h0OiAxMDAlO1xuICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XG4gIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XG4gIHBhZGRpbmctdG9wOiAyMHB4O1xuICBwb3NpdGlvbjogcmVsYXRpdmU7XG59XG5cbi5hcHAtZmxhc2gtZGlhbG9nX19yZXN1bHQtYWN0aW9uLWZhY3RvciB7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgbGVmdDogNXB4O1xuICBib3R0b206IDVweDtcbiAgZm9udC1zaXplOiA4cHg7XG4gIHdvcmQtd3JhcDogYnJlYWstd29yZDtcbn1cblxuLmFwcC1mbGFzaC1kaWFsb2dfX3Jlc3VsdC13cmFwIHtcbiAgZGlzcGxheTogZmxleDtcbn1cblxuLmFwcC1mbGFzaC1kaWFsb2dfX3Jlc3VsdC1sZWZ0IHtcbiAgcGFkZGluZy1ib3R0b206IDUwcHg7XG59XG5cbi5hcHAtZmxhc2gtZGlhbG9nX19yZXN1bHQtcmlnaHQge1xuICBwYWRkaW5nLWJvdHRvbTogNTBweDtcbn1cbkBtZWRpYSAobWluLXdpZHRoOiA2MDBweCkge1xuICAuYXBwLWZsYXNoLWRpYWxvZ19fcmVzdWx0LXJpZ2h0IHtcbiAgICBtYXJnaW4tbGVmdDogODBweDtcbiAgfVxufVxuXG4uYXBwLWZsYXNoLWRpYWxvZy1zd2lwZXIge1xuICAtLXN3aXBlci1wYWdpbmF0aW9uLWNvbG9yOiAjMDA5Njg4O1xufVxuXG4uYXBwLWZsYXNoLWRpYWxvZ19fY2hhbmdlLWJ1dHRvbiB7XG4gIHdpZHRoOiAyNTBweDtcbn0iLCJAaW1wb3J0IFwiLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3R5bGVzL3ZhcmlhYmxlc1wiO1xuXG4uYXBwLWZ1bGwtc2NyZWVuIHtcbiAgbWF4LXdpZHRoOiAxMDB2dyAhaW1wb3J0YW50O1xuICB3aWR0aDogMTAwdnc7XG4gIGhlaWdodDogMTAwdmg7XG59XG5cbi5hcHAtZmxhc2gtZGlhbG9nLCAuYXBwLWZsYXNoLWRpYWxvZ19fcmVzdWx0IHtcbiAgQGluY2x1ZGUgYWJvdmVTY3JlZW5TaXplKG1hcmdpbiwgNSwgMTUsIDIwLCA0MCwgNTApO1xufVxuXG4uYXBwLWZsYXNoLWRpYWxvZ19fYnV0dG9uLWNsb3NlIHtcbn1cblxuLmFwcC1mbGFzaC1kaWFsb2ctY2hhcnQge1xuICBtYXgtd2lkdGg6IDU1MHB4O1xuICBtYXgtaGVpZ2h0OiA0MDBweDtcbiAgZGlzcGxheTogZ3JpZDtcbiAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiByZXBlYXQoMTMsIDFmcik7XG4gIEBpbmNsdWRlIGdyYXBoaWstbGlnaHQoKTtcbiAgbWFyZ2luOiAyMHB4IDA7XG59XG5cbi5hcHAtZmxhc2gtZGlhbG9nX19zdGFjay1zaXplIHtcbiAgLmFwcC1yYWRpby1idXR0b24tYm94LXdyYXBwZXIge1xuICAgIHdpZHRoOiAzNHB4ICFpbXBvcnRhbnQ7XG4gIH1cblxuICAuYXBwLXJhZGlvLWJ1dHRvbi1sYWJlbCB7XG4gICAgYm9yZGVyOiAxcHggc29saWQgJHdoaXRlICFpbXBvcnRhbnQ7XG4gICAgd2lkdGg6IDM0cHggIWltcG9ydGFudDtcbiAgfVxufVxuXG4uYXBwLWZsYXNoLWRpYWxvZy1idXR0b24ge1xuICBtYXJnaW46IDIwcHggMDtcbn1cblxuLmFwcC1mbGFzaC1kaWFsb2dfX2hlYWRlciB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjtcbiAgbWFyZ2luLXRvcDogMTBweDtcbiAgbWFyZ2luLXJpZ2h0OiAxMHB4O1xuICBAaW5jbHVkZSBhYm92ZVNjcmVlblNpemUobWFyZ2luLWxlZnQsIDUsIDE1LCAyMCwgNDAsIDUwKTtcbn1cblxuLmFwcC1mbGFzaC1kaWFsb2dfX2xpbmsge1xuICBmb250LXdlaWdodDogNTAwO1xuICBmb250LXN0cmV0Y2g6IG5vcm1hbDtcbiAgZm9udC1zaXplOiAyMHB4O1xuICBmb250LWZhbWlseTogUm9ib3RvLCBcIkhlbHZldGljYSBOZXVlXCIsIHNhbnMtc2VyaWY7XG4gIGNvbG9yOiAkZ3JlZW47XG4gIG91dGxpbmU6IG5vbmU7XG5cbiAgJjo6Zmlyc3QtbGV0dGVyIHtcbiAgICB0ZXh0LXRyYW5zZm9ybTogdXBwZXJjYXNlO1xuICB9XG5cblxuICAmOmxhc3QtY2hpbGQge1xuICAgIGNvbG9yOiAkd2hpdGU7XG4gICAgb3ZlcmZsb3c6IGhpZGRlbjtcbiAgICB3aGl0ZS1zcGFjZTogbm93cmFwO1xuICAgIHRleHQtb3ZlcmZsb3c6IGVsbGlwc2lzO1xuXG4gICAgQGluY2x1ZGUgYWJvdmVTY3JlZW5TaXplKG1heC13aWR0aCwgMTIwLCAyNDAsIDM2MCwgNDgwLCA2MDApO1xuXG4gIH1cbn1cblxuLmFwcC1mbGFzaC1kaWFsb2dfX3Jlc3VsdC1oYW5kIHtcbiAgcGFkZGluZzogMTBweCAwO1xufVxuXG4uYXBwLWZsYXNoLWRpYWxvZ19fcmVzdWx0LWdhbWUtdHlwZSB7XG4gIHBhZGRpbmc6IDEwcHggMDtcbn1cblxuLmFwcC1mbGFzaC1kaWFsb2dfX3Jlc3VsdC1ibG9jay1yb3cge1xuICBkaXNwbGF5OiBmbGV4O1xufVxuXG4uYXBwLWZsYXNoLWRpYWxvZ19fcmVzdWx0LWFjdGlvbiB7XG4gIHdpZHRoOiA1MHB4O1xuICBoZWlnaHQ6IDUwcHg7XG4gIGZvbnQtc2l6ZTogMTBweDtcbiAgYm94LXNpemluZzogYm9yZGVyLWJveDtcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xufVxuXG4uYXBwLWZsYXNoLWRpYWxvZ19fcmVzdWx0LWFjdGlvbl9ib3JkZXJlZCB7XG4gIGJvcmRlcjogMXB4IHNvbGlkIHdoaXRlO1xufVxuXG4uYXBwLWZsYXNoLWRpYWxvZ19fcmVzdWx0LWFjdGlvbi10aXRsZSB7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgd2lkdGg6IDEwMCU7XG4gIGhlaWdodDogMTAwJTtcbiAgdG9wOiAwO1xuICBwYWRkaW5nOiA1cHg7XG4gIHotaW5kZXg6IDk5O1xuICBjb2xvcjogd2hpdGU7XG59XG5cbi5hcHAtZmxhc2gtZGlhbG9nX19yZXN1bHQtYWN0aW9uLXRpdGxlX2JsYWNrIHtcbiAgY29sb3I6IGJsYWNrO1xufVxuXG4uYXBwLWZsYXNoLWRpYWxvZ19fcmVzdWx0LWFjdGlvbl9fem9uZSB7XG4gIGhlaWdodDogMTAwJTtcbiAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xuICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xuICBwYWRkaW5nLXRvcDogMjBweDtcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xufVxuXG4uYXBwLWZsYXNoLWRpYWxvZ19fcmVzdWx0LWFjdGlvbi1mYWN0b3Ige1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIGxlZnQ6IDVweDtcbiAgYm90dG9tOiA1cHg7XG4gIGZvbnQtc2l6ZTogOHB4O1xuICB3b3JkLXdyYXA6IGJyZWFrLXdvcmQ7XG59XG5cbi5hcHAtZmxhc2gtZGlhbG9nX19yZXN1bHQtd3JhcCB7XG4gIGRpc3BsYXk6IGZsZXg7XG59XG5cbi5hcHAtZmxhc2gtZGlhbG9nX19yZXN1bHQtbGVmdCB7XG4gIHBhZGRpbmctYm90dG9tOiA1MHB4O1xufVxuXG4uYXBwLWZsYXNoLWRpYWxvZ19fcmVzdWx0LXJpZ2h0IHtcbiAgcGFkZGluZy1ib3R0b206IDUwcHg7XG4gIEBpbmNsdWRlIGFib3ZlKCRzY3JlZW4tdHMpIHtcbiAgICBtYXJnaW4tbGVmdDogODBweDtcbiAgfVxufVxuXG4uYXBwLWZsYXNoLWRpYWxvZy1zd2lwZXIge1xuICAtLXN3aXBlci1wYWdpbmF0aW9uLWNvbG9yOiAjMDA5Njg4O1xufVxuXG4uYXBwLWZsYXNoLWRpYWxvZ19fY2hhbmdlLWJ1dHRvbiB7XG4gIHdpZHRoOiAyNTBweDtcbn1cblxuXG4iXX0= */");

/***/ }),

/***/ "./src/app/modules/charts/modules/packs/components/flash-dialog/flash-dialog.component.ts":
/*!************************************************************************************************!*\
  !*** ./src/app/modules/charts/modules/packs/components/flash-dialog/flash-dialog.component.ts ***!
  \************************************************************************************************/
/*! exports provided: FlashDialogComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FlashDialogComponent", function() { return FlashDialogComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_material_dialog__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/material/dialog */ "./node_modules/@angular/material/esm5/dialog.es5.js");
/* harmony import */ var _services_user_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../../../services/user.service */ "./src/app/services/user.service.ts");
/* harmony import */ var _services_default_data_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../../../../services/default-data.service */ "./src/app/services/default-data.service.ts");
/* harmony import */ var _services_charts_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../../services/charts.service */ "./src/app/modules/charts/services/charts.service.ts");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! rxjs/operators */ "./node_modules/rxjs/_esm5/operators/index.js");








var FlashDialogComponent = /** @class */ (function () {
    function FlashDialogComponent(dialogRef, userService, defaultDataService, chartsService, data) {
        this.dialogRef = dialogRef;
        this.userService = userService;
        this.defaultDataService = defaultDataService;
        this.chartsService = chartsService;
        this.data = data;
        this.config = {
            a11y: true,
            direction: 'horizontal',
            slidesPerView: 1,
            keyboard: true,
            mousewheel: true,
            scrollbar: false,
            navigation: false,
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
                hideOnClick: false
            }
        };
        this.isResultAvailable = false;
        this.packId = data.packId;
        this.packTitle = data.packTitle;
    }
    FlashDialogComponent.prototype.ngOnInit = function () {
        this.combinations = this.defaultDataService.getEmptyChart();
        this.activeAnswer = this.chartsService.getDefaultAnswers()[0];
        this.stackSizesShort = [
            { id: 1, title: '1' },
            { id: 2, title: '2' },
            { id: 3, title: '3' },
            { id: 4, title: '4' },
            { id: 5, title: '5' },
            { id: 6, title: '6' },
            { id: 7, title: '7' },
            { id: 8, title: '8' },
            { id: 9, title: '9' },
            { id: 10, title: '10' },
        ];
        this.stackSizesMedium = [
            { id: 11, title: '11' },
            { id: 12, title: '12' },
            { id: 13, title: '13' },
            { id: 14, title: '14' },
            { id: 15, title: '15' },
            { id: 16, title: '16' },
            { id: 17, title: '17' },
            { id: 18, title: '18' },
            { id: 19, title: '19' },
            { id: 20, title: '20' },
        ];
        this.stackSizesDeep = [
            { id: 21, title: '21' },
            { id: 22, title: '22' },
            { id: 23, title: '23' },
            { id: 24, title: '24' },
            { id: 25, title: '25' },
        ];
        this.initFormGroup();
    };
    FlashDialogComponent.prototype.initFormGroup = function () {
        var _this = this;
        this.stackSizeCtrl = new _angular_forms__WEBPACK_IMPORTED_MODULE_6__["FormControl"](null, _angular_forms__WEBPACK_IMPORTED_MODULE_6__["Validators"].required);
        this.stackSizeCtrl.valueChanges.pipe(Object(rxjs_operators__WEBPACK_IMPORTED_MODULE_7__["filter"])(function (value) { return value; })).subscribe(function () {
            if (_this.saveIndexAnswer || _this.saveIndexAnswer === 0) {
                _this.getAnswer();
            }
        });
    };
    FlashDialogComponent.prototype.getAnswer = function () {
        var _this = this;
        this.chartsService.getFlashAnswer(this.packId, this.stackSizeCtrl.value.id, this.saveIndexAnswer)
            .subscribe(function (newPrompter) {
            _this.prompter = newPrompter;
            _this.isResultAvailable = true;
        });
    };
    FlashDialogComponent.prototype.onCombinationClick = function (combinationIndex) {
        var parts = this.combinations[combinationIndex].split(',');
        if (this.saveIndexAnswer) {
            this.combinations[this.saveIndexAnswer] = parts[0];
        }
        if (parts[1] === this.activeAnswer.isRandom && parts[2] === this.activeAnswer.value) {
            this.combinations[combinationIndex] = parts[0];
            this.saveIndexAnswer = null;
            this.combinationTitle = '';
        }
        else {
            parts[1] = this.activeAnswer.isRandom;
            parts[2] = this.activeAnswer.value;
            this.combinations[combinationIndex] = parts.join(',');
            this.saveIndexAnswer = combinationIndex;
            this.combinationTitle = this.defaultDataService.getCombinationTitleById(combinationIndex);
            if (this.stackSizeCtrl.value) {
                this.getAnswer();
            }
        }
    };
    FlashDialogComponent.prototype.getColorByValue = function (value) {
        return this.defaultDataService.getColorByCombinationSymbol(value);
    };
    FlashDialogComponent.prototype.close = function () {
        this.dialogRef.close();
    };
    FlashDialogComponent.prototype.changeHand = function () {
        this.combinationTitle = '';
        this.stackSizeCtrl.setValue(null);
        this.onCombinationClick(this.saveIndexAnswer);
        this.isResultAvailable = false;
    };
    FlashDialogComponent.ctorParameters = function () { return [
        { type: _angular_material_dialog__WEBPACK_IMPORTED_MODULE_2__["MatDialogRef"] },
        { type: _services_user_service__WEBPACK_IMPORTED_MODULE_3__["UserService"] },
        { type: _services_default_data_service__WEBPACK_IMPORTED_MODULE_4__["DefaultDataService"] },
        { type: _services_charts_service__WEBPACK_IMPORTED_MODULE_5__["ChartsService"] },
        { type: undefined, decorators: [{ type: _angular_core__WEBPACK_IMPORTED_MODULE_1__["Inject"], args: [_angular_material_dialog__WEBPACK_IMPORTED_MODULE_2__["MAT_DIALOG_DATA"],] }] }
    ]; };
    FlashDialogComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-flash-dialog',
            template: tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(/*! raw-loader!./flash-dialog.component.html */ "./node_modules/raw-loader/dist/cjs.js!./src/app/modules/charts/modules/packs/components/flash-dialog/flash-dialog.component.html")).default,
            styles: [tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(/*! ./flash-dialog.component.scss */ "./src/app/modules/charts/modules/packs/components/flash-dialog/flash-dialog.component.scss")).default]
        }),
        tslib__WEBPACK_IMPORTED_MODULE_0__["__param"](4, Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Inject"])(_angular_material_dialog__WEBPACK_IMPORTED_MODULE_2__["MAT_DIALOG_DATA"]))
    ], FlashDialogComponent);
    return FlashDialogComponent;
}());



/***/ }),

/***/ "./src/app/modules/charts/modules/packs/components/youtube-dialog/youtube-dialog.component.scss":
/*!******************************************************************************************************!*\
  !*** ./src/app/modules/charts/modules/packs/components/youtube-dialog/youtube-dialog.component.scss ***!
  \******************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("@media (max-height: 590px) {\n  .hidden-height-down {\n    display: none !important;\n  }\n}\n\n@media (max-width: 319px) {\n  .hidden-ms-down {\n    display: none !important;\n  }\n}\n\n@media (min-width: 320px) {\n  .hidden-ms-up {\n    display: none !important;\n  }\n}\n\n@media (max-width: 359px) {\n  .hidden-mm-down {\n    display: none !important;\n  }\n}\n\n@media (min-width: 360px) {\n  .hidden-mm-up {\n    display: none !important;\n  }\n}\n\n@media (max-width: 479px) {\n  .hidden-ml-down {\n    display: none !important;\n  }\n}\n\n@media (min-width: 480px) {\n  .hidden-ml-up {\n    display: none !important;\n  }\n}\n\n@media (max-width: 599px) {\n  .hidden-ts-down {\n    display: none !important;\n  }\n}\n\n@media (min-width: 600px) {\n  .hidden-ts-up {\n    display: none !important;\n  }\n}\n\n@media (max-width: 719px) {\n  .hidden-tm-down {\n    display: none !important;\n  }\n}\n\n@media (min-width: 720px) {\n  .hidden-tm-up {\n    display: none !important;\n  }\n}\n\n@media (max-width: 959px) {\n  .hidden-tl-down {\n    display: none !important;\n  }\n}\n\n@media (min-width: 960px) {\n  .hidden-tl-up {\n    display: none !important;\n  }\n}\n\n@media (max-width: 1023px) {\n  .hidden-ds-down {\n    display: none !important;\n  }\n}\n\n@media (min-width: 1024px) {\n  .hidden-ds-up {\n    display: none !important;\n  }\n}\n\n@media (max-width: 1279px) {\n  .hidden-dm-down {\n    display: none !important;\n  }\n}\n\n@media (min-width: 1280px) {\n  .hidden-dm-up {\n    display: none !important;\n  }\n}\n\n@media (max-width: 1439px) {\n  .hidden-dl-down {\n    display: none !important;\n  }\n}\n\n@media (min-width: 1440px) {\n  .hidden-dl-up {\n    display: none !important;\n  }\n}\n\n.app-youtube-screen {\n  max-width: 640px !important;\n  width: 640px;\n  padding: 0 10px;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3Byb2plY3RzL3ByZWZsb3AtaGVyby9zcmMvc3R5bGVzL3ZhcmlhYmxlcy5zY3NzIiwic3JjL2FwcC9tb2R1bGVzL2NoYXJ0cy9tb2R1bGVzL3BhY2tzL2NvbXBvbmVudHMveW91dHViZS1kaWFsb2cveW91dHViZS1kaWFsb2cuY29tcG9uZW50LnNjc3MiLCIvaG9tZS9wcm9qZWN0cy9wcmVmbG9wLWhlcm8vc3JjL2FwcC9tb2R1bGVzL2NoYXJ0cy9tb2R1bGVzL3BhY2tzL2NvbXBvbmVudHMveW91dHViZS1kaWFsb2cveW91dHViZS1kaWFsb2cuY29tcG9uZW50LnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBa0ZFO0VBREY7SUFFSSx3QkFBQTtFQ2hGRjtBQUNGOztBRDBGRTtFQU9BO0lBRUksd0JBQUE7RUM5Rko7QUFDRjs7QUQ4RUU7RUFtQkE7SUFFSSx3QkFBQTtFQzlGSjtBQUNGOztBRDhFRTtFQU9BO0lBRUksd0JBQUE7RUNsRko7QUFDRjs7QURrRUU7RUFtQkE7SUFFSSx3QkFBQTtFQ2xGSjtBQUNGOztBRGtFRTtFQU9BO0lBRUksd0JBQUE7RUN0RUo7QUFDRjs7QURzREU7RUFtQkE7SUFFSSx3QkFBQTtFQ3RFSjtBQUNGOztBRHNERTtFQU9BO0lBRUksd0JBQUE7RUMxREo7QUFDRjs7QUQwQ0U7RUFtQkE7SUFFSSx3QkFBQTtFQzFESjtBQUNGOztBRDBDRTtFQU9BO0lBRUksd0JBQUE7RUM5Q0o7QUFDRjs7QUQ4QkU7RUFtQkE7SUFFSSx3QkFBQTtFQzlDSjtBQUNGOztBRDhCRTtFQU9BO0lBRUksd0JBQUE7RUNsQ0o7QUFDRjs7QURrQkU7RUFtQkE7SUFFSSx3QkFBQTtFQ2xDSjtBQUNGOztBRGtCRTtFQU9BO0lBRUksd0JBQUE7RUN0Qko7QUFDRjs7QURNRTtFQW1CQTtJQUVJLHdCQUFBO0VDdEJKO0FBQ0Y7O0FETUU7RUFPQTtJQUVJLHdCQUFBO0VDVko7QUFDRjs7QURORTtFQW1CQTtJQUVJLHdCQUFBO0VDVko7QUFDRjs7QURORTtFQU9BO0lBRUksd0JBQUE7RUNFSjtBQUNGOztBRGxCRTtFQW1CQTtJQUVJLHdCQUFBO0VDRUo7QUFDRjs7QUM5R0E7RUFDRSwyQkFBQTtFQUNBLFlBQUE7RUFDQSxlQUFBO0FEaUhGIiwiZmlsZSI6InNyYy9hcHAvbW9kdWxlcy9jaGFydHMvbW9kdWxlcy9wYWNrcy9jb21wb25lbnRzL3lvdXR1YmUtZGlhbG9nL3lvdXR1YmUtZGlhbG9nLmNvbXBvbmVudC5zY3NzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gY29sb3JzXG4kZ3JheS0xOiAjMzAzNzRBO1xuJGdyYXktMjogIzQ4NEY2MjtcbiRncmF5LTM6ICM0ODRGNjI7XG5cbiRncmVlbjogIzAwOTY4ODtcbiRncmVlbi0yOiAjNDNBMDQ3O1xuJGdyZWVuLTM6ICMwMEI1QTU7XG5cbiR3aGl0ZTogI0VGRjNGNjtcbiR3aGl0ZS0yOiAjRTdFQkVFO1xuXG4kcmVkOiAjRDQyNjQ3O1xuJHJlZC0yOiAjRkY2RjYwO1xuXG4kb3JhbmdlOiAjRkFBMzBEO1xuXG4kYmxhY2stMTogIzI2MzIzODtcbiRibGFjay0yOiAjMzc0NzRGO1xuXG4kY2FyZC1jb2xvci1yZWQ6ICNFRjUzNTA7XG4kY2FyZC1jb2xvci1ibGFjazogIzYxNjE2MTtcbiRjYXJkLWNvbG9yLWJsdWU6ICMzRjUxQjU7XG4kY2FyZC1jb2xvci1ncmVlbjogIzQzQTA0NztcblxuLy8gc2hhZG93XG4kc2hhZG93LWdyZWVuOiAgMCAxcHggM3B4IDAgJGdyYXktMTtcblxuXG4vLyBmb250c1xuQG1peGluIGZvbnQoJGZvbnRGYW1pbHksICRmb250V2VpZ2h0LCAkZm9udFN0eWxlKSB7XG4gIGZvbnQtZmFtaWx5OiAkZm9udEZhbWlseTtcbiAgZm9udC13ZWlnaHQ6ICRmb250V2VpZ2h0O1xuICBmb250LXN0eWxlOiAkZm9udFN0eWxlO1xufVxuXG5AbWl4aW4gZ3JhcGhpay1ib2xkKCkge1xuICBAaW5jbHVkZSBmb250KCdHcmFwaGlrJywgYm9sZCwgbm9ybWFsKTtcbn1cblxuQG1peGluIGdyYXBoaWstc2VtaWJvbGQoKSB7XG4gIEBpbmNsdWRlIGZvbnQoJ0dyYXBoaWsnLCA2MDAsIG5vcm1hbCk7XG59XG5cbkBtaXhpbiBncmFwaGlrLXJlZ3VsYXIoKSB7XG4gIEBpbmNsdWRlIGZvbnQoJ0dyYXBoaWsnLCBub3JtYWwsIG5vcm1hbCk7XG59XG5cbkBtaXhpbiBncmFwaGlrLXNlbWlib2xkLWl0YWxpYygpIHtcbiAgQGluY2x1ZGUgZm9udCgnR3JhcGhpaycsIDYwMCwgaXRhbGljKTtcbn1cblxuQG1peGluIGdyYXBoaWstbGlnaHQoKSB7XG4gIEBpbmNsdWRlIGZvbnQoJ0dyYXBoaWsnLCA0MDAsIGxpZ2h0KTtcbn1cblxuLy9zY3JlZW4gc2l6ZXNcbiRzY3JlZW4tbXM6IDMyMHB4O1xuJHNjcmVlbi1tbTogMzYwcHg7IC8vIGZpcnN0XG4kc2NyZWVuLW1sOiA0ODBweDsgLy8gJHNlY29uZFxuJHNjcmVlbi10czogNjAwcHg7XG4kc2NyZWVuLXRtOiA3MjBweDsgLy8gdGhpcmRcbiRzY3JlZW4tdGw6IDk2MHB4O1xuJHNjcmVlbi1kczogMTAyNHB4OyAvLyBmb3VydGhcbiRzY3JlZW4tZG06IDEyODBweDsgLy8gZmlmdGhcbiRzY3JlZW4tZGw6IDE0NDBweDtcblxuXG5cbiRncmlkOiAoXG4gICdtcyc6IDMyMHB4LFxuICAnbW0nOiAzNjBweCxcbiAgJ21sJzogNDgwcHgsXG4gICd0cyc6IDYwMHB4LFxuICAndG0nOiA3MjBweCxcbiAgJ3RsJzogOTYwcHgsXG4gICdkcyc6IDEwMjRweCxcbiAgJ2RtJzogMTI4MHB4LFxuICAnZGwnOiAxNDQwcHgsXG4pO1xuXG4uaGlkZGVuLWhlaWdodC1kb3duIHtcbiAgQG1lZGlhIChtYXgtaGVpZ2h0OiA1OTBweCkge1xuICAgIGRpc3BsYXk6IG5vbmUgIWltcG9ydGFudDtcbiAgfVxufVxuXG5AbWl4aW4gYWJvdmUoJGJyZWFrcG9pbnRzKSB7XG4gIEBtZWRpYSAobWluLXdpZHRoOiAjeyRicmVha3BvaW50c30pIHtcbiAgICBAY29udGVudDtcbiAgfVxufVxuXG5AbWl4aW4gYmVsb3coJGJyZWFrcG9pbnRzKSB7XG4gIEBtZWRpYSAobWF4LXdpZHRoOiAjeyRicmVha3BvaW50c30pIHtcbiAgICBAY29udGVudDtcbiAgfVxufVxuXG5AZWFjaCAka2V5LCAkdmFsdWUgaW4gJGdyaWQge1xuXG4gIC5oaWRkZW4tI3ska2V5fS1kb3duIHtcbiAgICBAaW5jbHVkZSBiZWxvdygjeyR2YWx1ZSAtIDF9KSB7XG4gICAgICBkaXNwbGF5OiBub25lICFpbXBvcnRhbnQ7XG4gICAgfVxuICB9XG5cbiAgLmhpZGRlbi0jeyRrZXl9LXVwIHtcbiAgICBAaW5jbHVkZSBhYm92ZSgjeyR2YWx1ZX0pIHtcbiAgICAgIGRpc3BsYXk6IG5vbmUgIWltcG9ydGFudDtcbiAgICB9XG4gIH1cbn1cblxuQG1peGluIGFib3ZlU2NyZWVuU2l6ZSgkdHlwZSwgJGZpcnN0LCAkc2Vjb25kLCAkdGhpcmQsICRmb3VydGgsICRmaWZ0aCkge1xuICBAaW5jbHVkZSBhYm92ZSgkc2NyZWVuLW1tKSB7XG4gICAgI3skdHlwZX06ICRmaXJzdCArIHB4O1xuICB9XG5cbiAgQGluY2x1ZGUgYWJvdmUoJHNjcmVlbi1tbCkge1xuICAgICN7JHR5cGV9OiAkc2Vjb25kICsgcHg7XG4gIH1cblxuICBAaW5jbHVkZSBhYm92ZSgkc2NyZWVuLXRtKSB7XG4gICAgI3skdHlwZX06ICR0aGlyZCArIHB4O1xuICB9XG5cbiAgQGluY2x1ZGUgYWJvdmUoJHNjcmVlbi1kcykge1xuICAgICN7JHR5cGV9OiAkZm91cnRoICsgcHg7XG4gIH1cblxuICBAaW5jbHVkZSBhYm92ZSgkc2NyZWVuLWRtKSB7XG4gICAgI3skdHlwZX06ICRmaWZ0aCArIHB4O1xuICB9XG59XG5cbkBtaXhpbiBhYm92ZVNjcmVlblNpemVXaXRoRGltZW5zaW9uKCR0eXBlLCAkZmlyc3QsICRzZWNvbmQsICR0aGlyZCwgJGZvdXJ0aCwgJGZpZnRoLCAkZGltZW5zaW9uKSB7XG4gIEBpbmNsdWRlIGFib3ZlKCRzY3JlZW4tbW0pIHtcbiAgICAjeyR0eXBlfTogJGZpcnN0ICsgJGRpbWVuc2lvbjtcbiAgfVxuXG4gIEBpbmNsdWRlIGFib3ZlKCRzY3JlZW4tbWwpIHtcbiAgICAjeyR0eXBlfTogJHNlY29uZCArICRkaW1lbnNpb247XG4gIH1cblxuICBAaW5jbHVkZSBhYm92ZSgkc2NyZWVuLXRtKSB7XG4gICAgI3skdHlwZX06ICR0aGlyZCArICRkaW1lbnNpb247XG4gIH1cblxuICBAaW5jbHVkZSBhYm92ZSgkc2NyZWVuLWRzKSB7XG4gICAgI3skdHlwZX06ICRmb3VydGggKyAkZGltZW5zaW9uO1xuICB9XG5cbiAgQGluY2x1ZGUgYWJvdmUoJHNjcmVlbi1kbSkge1xuICAgICN7JHR5cGV9OiAkZmlmdGggKyAkZGltZW5zaW9uO1xuICB9XG59XG5cbkBtaXhpbiBiZWxvd1NjcmVlblNpemUoJHR5cGUsICRmaXJzdCwgJHNlY29uZCwgJHRoaXJkLCAkZm91cnRoLCAkZmlmdGgpIHtcbiAgQGluY2x1ZGUgYmVsb3coJHNjcmVlbi1tbSkge1xuICAgICN7JHR5cGV9OiAkZmlyc3QgKyBweDtcbiAgfVxuXG4gIEBpbmNsdWRlIGJlbG93KCRzY3JlZW4tbWwpIHtcbiAgICAjeyR0eXBlfTogJHNlY29uZCArIHB4O1xuICB9XG5cbiAgQGluY2x1ZGUgYmVsb3coJHNjcmVlbi10bSkge1xuICAgICN7JHR5cGV9OiAkdGhpcmQgKyBweDtcbiAgfVxuXG4gIEBpbmNsdWRlIGJlbG93KCRzY3JlZW4tZHMpIHtcbiAgICAjeyR0eXBlfTogJGZvdXJ0aCArIHB4O1xuICB9XG5cbiAgQGluY2x1ZGUgYmVsb3coJHNjcmVlbi1kbSkge1xuICAgICN7JHR5cGV9OiAkZmlmdGggKyBweDtcbiAgfVxufVxuXG5AbWl4aW4gaWNvblNpemVTY3JlZW5TaXplKCRmaXJzdCwgJHNlY29uZCwgJHRoaXJkLCAkZm91cnRoLCAkZmlmdGgpIHtcbiAgQGluY2x1ZGUgYWJvdmUoJHNjcmVlbi1tbSkge1xuICAgIHdpZHRoOiAkZmlyc3QgKyBweCAhaW1wb3J0YW50O1xuICAgIGhlaWdodDogJGZpcnN0ICsgcHggIWltcG9ydGFudDtcbiAgfVxuXG4gIEBpbmNsdWRlIGFib3ZlKCRzY3JlZW4tbWwpIHtcbiAgICB3aWR0aDogJHNlY29uZCArIHB4ICFpbXBvcnRhbnQ7XG4gICAgaGVpZ2h0OiAkc2Vjb25kICsgcHggIWltcG9ydGFudDtcbiAgfVxuXG4gIEBpbmNsdWRlIGFib3ZlKCRzY3JlZW4tdG0pIHtcbiAgICB3aWR0aDogJHRoaXJkICsgcHggIWltcG9ydGFudDtcbiAgICBoZWlnaHQ6ICR0aGlyZCArIHB4ICFpbXBvcnRhbnQ7XG4gIH1cblxuICBAaW5jbHVkZSBhYm92ZSgkc2NyZWVuLWRzKSB7XG4gICAgd2lkdGg6ICRmb3VydGggKyBweCAhaW1wb3J0YW50O1xuICAgIGhlaWdodDogJGZvdXJ0aCArIHB4ICFpbXBvcnRhbnQ7XG4gIH1cblxuICBAaW5jbHVkZSBhYm92ZSgkc2NyZWVuLWRtKSB7XG4gICAgd2lkdGg6ICRmaWZ0aCArIHB4ICFpbXBvcnRhbnQ7XG4gICAgaGVpZ2h0OiAkZmlmdGggKyBweCAhaW1wb3J0YW50O1xuICB9XG59XG5cblxuIiwiQG1lZGlhIChtYXgtaGVpZ2h0OiA1OTBweCkge1xuICAuaGlkZGVuLWhlaWdodC1kb3duIHtcbiAgICBkaXNwbGF5OiBub25lICFpbXBvcnRhbnQ7XG4gIH1cbn1cblxuQG1lZGlhIChtYXgtd2lkdGg6IDMxOXB4KSB7XG4gIC5oaWRkZW4tbXMtZG93biB7XG4gICAgZGlzcGxheTogbm9uZSAhaW1wb3J0YW50O1xuICB9XG59XG5cbkBtZWRpYSAobWluLXdpZHRoOiAzMjBweCkge1xuICAuaGlkZGVuLW1zLXVwIHtcbiAgICBkaXNwbGF5OiBub25lICFpbXBvcnRhbnQ7XG4gIH1cbn1cblxuQG1lZGlhIChtYXgtd2lkdGg6IDM1OXB4KSB7XG4gIC5oaWRkZW4tbW0tZG93biB7XG4gICAgZGlzcGxheTogbm9uZSAhaW1wb3J0YW50O1xuICB9XG59XG5cbkBtZWRpYSAobWluLXdpZHRoOiAzNjBweCkge1xuICAuaGlkZGVuLW1tLXVwIHtcbiAgICBkaXNwbGF5OiBub25lICFpbXBvcnRhbnQ7XG4gIH1cbn1cblxuQG1lZGlhIChtYXgtd2lkdGg6IDQ3OXB4KSB7XG4gIC5oaWRkZW4tbWwtZG93biB7XG4gICAgZGlzcGxheTogbm9uZSAhaW1wb3J0YW50O1xuICB9XG59XG5cbkBtZWRpYSAobWluLXdpZHRoOiA0ODBweCkge1xuICAuaGlkZGVuLW1sLXVwIHtcbiAgICBkaXNwbGF5OiBub25lICFpbXBvcnRhbnQ7XG4gIH1cbn1cblxuQG1lZGlhIChtYXgtd2lkdGg6IDU5OXB4KSB7XG4gIC5oaWRkZW4tdHMtZG93biB7XG4gICAgZGlzcGxheTogbm9uZSAhaW1wb3J0YW50O1xuICB9XG59XG5cbkBtZWRpYSAobWluLXdpZHRoOiA2MDBweCkge1xuICAuaGlkZGVuLXRzLXVwIHtcbiAgICBkaXNwbGF5OiBub25lICFpbXBvcnRhbnQ7XG4gIH1cbn1cblxuQG1lZGlhIChtYXgtd2lkdGg6IDcxOXB4KSB7XG4gIC5oaWRkZW4tdG0tZG93biB7XG4gICAgZGlzcGxheTogbm9uZSAhaW1wb3J0YW50O1xuICB9XG59XG5cbkBtZWRpYSAobWluLXdpZHRoOiA3MjBweCkge1xuICAuaGlkZGVuLXRtLXVwIHtcbiAgICBkaXNwbGF5OiBub25lICFpbXBvcnRhbnQ7XG4gIH1cbn1cblxuQG1lZGlhIChtYXgtd2lkdGg6IDk1OXB4KSB7XG4gIC5oaWRkZW4tdGwtZG93biB7XG4gICAgZGlzcGxheTogbm9uZSAhaW1wb3J0YW50O1xuICB9XG59XG5cbkBtZWRpYSAobWluLXdpZHRoOiA5NjBweCkge1xuICAuaGlkZGVuLXRsLXVwIHtcbiAgICBkaXNwbGF5OiBub25lICFpbXBvcnRhbnQ7XG4gIH1cbn1cblxuQG1lZGlhIChtYXgtd2lkdGg6IDEwMjNweCkge1xuICAuaGlkZGVuLWRzLWRvd24ge1xuICAgIGRpc3BsYXk6IG5vbmUgIWltcG9ydGFudDtcbiAgfVxufVxuXG5AbWVkaWEgKG1pbi13aWR0aDogMTAyNHB4KSB7XG4gIC5oaWRkZW4tZHMtdXAge1xuICAgIGRpc3BsYXk6IG5vbmUgIWltcG9ydGFudDtcbiAgfVxufVxuXG5AbWVkaWEgKG1heC13aWR0aDogMTI3OXB4KSB7XG4gIC5oaWRkZW4tZG0tZG93biB7XG4gICAgZGlzcGxheTogbm9uZSAhaW1wb3J0YW50O1xuICB9XG59XG5cbkBtZWRpYSAobWluLXdpZHRoOiAxMjgwcHgpIHtcbiAgLmhpZGRlbi1kbS11cCB7XG4gICAgZGlzcGxheTogbm9uZSAhaW1wb3J0YW50O1xuICB9XG59XG5cbkBtZWRpYSAobWF4LXdpZHRoOiAxNDM5cHgpIHtcbiAgLmhpZGRlbi1kbC1kb3duIHtcbiAgICBkaXNwbGF5OiBub25lICFpbXBvcnRhbnQ7XG4gIH1cbn1cblxuQG1lZGlhIChtaW4td2lkdGg6IDE0NDBweCkge1xuICAuaGlkZGVuLWRsLXVwIHtcbiAgICBkaXNwbGF5OiBub25lICFpbXBvcnRhbnQ7XG4gIH1cbn1cblxuLmFwcC15b3V0dWJlLXNjcmVlbiB7XG4gIG1heC13aWR0aDogNjQwcHggIWltcG9ydGFudDtcbiAgd2lkdGg6IDY0MHB4O1xuICBwYWRkaW5nOiAwIDEwcHg7XG59IiwiQGltcG9ydCBcIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3N0eWxlcy92YXJpYWJsZXNcIjtcblxuLmFwcC15b3V0dWJlLXNjcmVlbiB7XG4gIG1heC13aWR0aDogNjQwcHggIWltcG9ydGFudDtcbiAgd2lkdGg6IDY0MHB4O1xuICBwYWRkaW5nOiAwIDEwcHg7XG59XG4iXX0= */");

/***/ }),

/***/ "./src/app/modules/charts/modules/packs/components/youtube-dialog/youtube-dialog.component.ts":
/*!****************************************************************************************************!*\
  !*** ./src/app/modules/charts/modules/packs/components/youtube-dialog/youtube-dialog.component.ts ***!
  \****************************************************************************************************/
/*! exports provided: YoutubeDialogComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "YoutubeDialogComponent", function() { return YoutubeDialogComponent; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");


var YoutubeDialogComponent = /** @class */ (function () {
    function YoutubeDialogComponent() {
    }
    Object.defineProperty(YoutubeDialogComponent.prototype, "id", {
        set: function (id) {
            this.videoId = id;
        },
        enumerable: true,
        configurable: true
    });
    YoutubeDialogComponent.prototype.ngOnInit = function () {
        var tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        document.body.appendChild(tag);
    };
    // Autoplay
    YoutubeDialogComponent.prototype.onReady = function () {
        this.player.mute();
        this.player.playVideo();
    };
    // Loop
    YoutubeDialogComponent.prototype.onStateChange = function (event) {
        if (event.data === 0) {
            this.player.playVideo();
        }
    };
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ViewChild"])('player', { static: true })
    ], YoutubeDialogComponent.prototype, "player", void 0);
    tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Input"])()
    ], YoutubeDialogComponent.prototype, "id", null);
    YoutubeDialogComponent = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["Component"])({
            selector: 'app-youtube-dialog',
            template: tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(/*! raw-loader!./youtube-dialog.component.html */ "./node_modules/raw-loader/dist/cjs.js!./src/app/modules/charts/modules/packs/components/youtube-dialog/youtube-dialog.component.html")).default,
            styles: [tslib__WEBPACK_IMPORTED_MODULE_0__["__importDefault"](__webpack_require__(/*! ./youtube-dialog.component.scss */ "./src/app/modules/charts/modules/packs/components/youtube-dialog/youtube-dialog.component.scss")).default]
        })
    ], YoutubeDialogComponent);
    return YoutubeDialogComponent;
}());



/***/ }),

/***/ "./src/app/modules/charts/modules/packs/packs-routing.module.ts":
/*!**********************************************************************!*\
  !*** ./src/app/modules/charts/modules/packs/packs-routing.module.ts ***!
  \**********************************************************************/
/*! exports provided: PacksRoutingModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PacksRoutingModule", function() { return PacksRoutingModule; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "./node_modules/@angular/router/fesm5/router.js");
/* harmony import */ var _components_chart_details_chart_details_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./components/chart-details/chart-details.component */ "./src/app/modules/charts/modules/packs/components/chart-details/chart-details.component.ts");
/* harmony import */ var _resolvers_chart_details_resolver__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../resolvers/chart-details.resolver */ "./src/app/modules/charts/resolvers/chart-details.resolver.ts");
/* harmony import */ var _components_creating_lesson_creating_lesson_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./components/creating-lesson/creating-lesson.component */ "./src/app/modules/charts/modules/packs/components/creating-lesson/creating-lesson.component.ts");
/* harmony import */ var _components_creating_mixed_lesson_creating_mixed_lesson_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./components/creating-mixed-lesson/creating-mixed-lesson.component */ "./src/app/modules/charts/modules/packs/components/creating-mixed-lesson/creating-mixed-lesson.component.ts");
/* harmony import */ var _components_edit_lesson_edit_lesson_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./components/edit-lesson/edit-lesson.component */ "./src/app/modules/charts/modules/packs/components/edit-lesson/edit-lesson.component.ts");
/* harmony import */ var _resolvers_chart_resolver__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../resolvers/chart.resolver */ "./src/app/modules/charts/resolvers/chart.resolver.ts");
/* harmony import */ var _components_edit_mixed_lesson_edit_mixed_lesson_component__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./components/edit-mixed-lesson/edit-mixed-lesson.component */ "./src/app/modules/charts/modules/packs/components/edit-mixed-lesson/edit-mixed-lesson.component.ts");
/* harmony import */ var _resolvers_mixed_chart_resolver__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../resolvers/mixed-chart.resolver */ "./src/app/modules/charts/resolvers/mixed-chart.resolver.ts");











var routes = [
    { path: '', component: _components_chart_details_chart_details_component__WEBPACK_IMPORTED_MODULE_3__["ChartDetailsComponent"], resolve: { charts: _resolvers_chart_details_resolver__WEBPACK_IMPORTED_MODULE_4__["ChartDetailsResolver"] } },
    { path: 'new-lesson', component: _components_creating_lesson_creating_lesson_component__WEBPACK_IMPORTED_MODULE_5__["CreatingLessonComponent"], data: { breadcrumb: 'new lesson' } },
    { path: 'new-mixed-lesson', component: _components_creating_mixed_lesson_creating_mixed_lesson_component__WEBPACK_IMPORTED_MODULE_6__["CreatingMixedLessonComponent"], data: { breadcrumb: 'new mixed lesson' } },
    { path: 'edit-lesson/:id', component: _components_edit_lesson_edit_lesson_component__WEBPACK_IMPORTED_MODULE_7__["EditLessonComponent"], resolve: { chart: _resolvers_chart_resolver__WEBPACK_IMPORTED_MODULE_8__["ChartResolver"] }, data: { breadcrumb: 'Chart #' } },
    { path: 'edit-mixed-lesson/:id', component: _components_edit_mixed_lesson_edit_mixed_lesson_component__WEBPACK_IMPORTED_MODULE_9__["EditMixedLessonComponent"], resolve: { chart: _resolvers_mixed_chart_resolver__WEBPACK_IMPORTED_MODULE_10__["MixedChartResolver"] }, data: { breadcrumb: '' } },
];
var PacksRoutingModule = /** @class */ (function () {
    function PacksRoutingModule() {
    }
    PacksRoutingModule = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
            imports: [_angular_router__WEBPACK_IMPORTED_MODULE_2__["RouterModule"].forChild(routes)],
            exports: [_angular_router__WEBPACK_IMPORTED_MODULE_2__["RouterModule"]]
        })
    ], PacksRoutingModule);
    return PacksRoutingModule;
}());



/***/ }),

/***/ "./src/app/modules/charts/modules/packs/packs.module.ts":
/*!**************************************************************!*\
  !*** ./src/app/modules/charts/modules/packs/packs.module.ts ***!
  \**************************************************************/
/*! exports provided: PacksModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "PacksModule", function() { return PacksModule; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common */ "./node_modules/@angular/common/fesm5/common.js");
/* harmony import */ var _packs_routing_module__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./packs-routing.module */ "./src/app/modules/charts/modules/packs/packs-routing.module.ts");
/* harmony import */ var _components_creating_lesson_creating_lesson_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./components/creating-lesson/creating-lesson.component */ "./src/app/modules/charts/modules/packs/components/creating-lesson/creating-lesson.component.ts");
/* harmony import */ var _components_creating_mixed_lesson_creating_mixed_lesson_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./components/creating-mixed-lesson/creating-mixed-lesson.component */ "./src/app/modules/charts/modules/packs/components/creating-mixed-lesson/creating-mixed-lesson.component.ts");
/* harmony import */ var _components_edit_lesson_edit_lesson_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./components/edit-lesson/edit-lesson.component */ "./src/app/modules/charts/modules/packs/components/edit-lesson/edit-lesson.component.ts");
/* harmony import */ var _components_edit_mixed_lesson_edit_mixed_lesson_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./components/edit-mixed-lesson/edit-mixed-lesson.component */ "./src/app/modules/charts/modules/packs/components/edit-mixed-lesson/edit-mixed-lesson.component.ts");
/* harmony import */ var _shared_shared_module__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../../../shared/shared.module */ "./src/app/shared/shared.module.ts");
/* harmony import */ var _angular_material_progress_spinner__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/material/progress-spinner */ "./node_modules/@angular/material/esm5/progress-spinner.es5.js");
/* harmony import */ var _components_chart_details_chart_details_component__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./components/chart-details/chart-details.component */ "./src/app/modules/charts/modules/packs/components/chart-details/chart-details.component.ts");
/* harmony import */ var _components_flash_dialog_flash_dialog_component__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./components/flash-dialog/flash-dialog.component */ "./src/app/modules/charts/modules/packs/components/flash-dialog/flash-dialog.component.ts");
/* harmony import */ var _angular_youtube_player__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @angular/youtube-player */ "./node_modules/@angular/youtube-player/fesm2015/youtube-player.js");
/* harmony import */ var _components_youtube_dialog_youtube_dialog_component__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./components/youtube-dialog/youtube-dialog.component */ "./src/app/modules/charts/modules/packs/components/youtube-dialog/youtube-dialog.component.ts");
/* harmony import */ var ngx_swiper_wrapper__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ngx-swiper-wrapper */ "./node_modules/ngx-swiper-wrapper/fesm5/ngx-swiper-wrapper.js");
/* harmony import */ var _angular_cdk_drag_drop__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! @angular/cdk/drag-drop */ "./node_modules/@angular/cdk/esm5/drag-drop.es5.js");

















var DEFAULT_SWIPER_CONFIG = {
    direction: 'horizontal',
    slidesPerView: 'auto'
};
var PacksModule = /** @class */ (function () {
    function PacksModule() {
    }
    PacksModule = tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"]([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
            declarations: [
                _components_chart_details_chart_details_component__WEBPACK_IMPORTED_MODULE_10__["ChartDetailsComponent"],
                _components_creating_lesson_creating_lesson_component__WEBPACK_IMPORTED_MODULE_4__["CreatingLessonComponent"],
                _components_creating_mixed_lesson_creating_mixed_lesson_component__WEBPACK_IMPORTED_MODULE_5__["CreatingMixedLessonComponent"],
                _components_edit_lesson_edit_lesson_component__WEBPACK_IMPORTED_MODULE_6__["EditLessonComponent"],
                _components_edit_mixed_lesson_edit_mixed_lesson_component__WEBPACK_IMPORTED_MODULE_7__["EditMixedLessonComponent"],
                _components_flash_dialog_flash_dialog_component__WEBPACK_IMPORTED_MODULE_11__["FlashDialogComponent"],
                _components_youtube_dialog_youtube_dialog_component__WEBPACK_IMPORTED_MODULE_13__["YoutubeDialogComponent"],
            ],
            imports: [
                _angular_common__WEBPACK_IMPORTED_MODULE_2__["CommonModule"],
                _packs_routing_module__WEBPACK_IMPORTED_MODULE_3__["PacksRoutingModule"],
                _shared_shared_module__WEBPACK_IMPORTED_MODULE_8__["SharedModule"],
                _angular_material_progress_spinner__WEBPACK_IMPORTED_MODULE_9__["MatProgressSpinnerModule"],
                _angular_youtube_player__WEBPACK_IMPORTED_MODULE_12__["YouTubePlayerModule"],
                ngx_swiper_wrapper__WEBPACK_IMPORTED_MODULE_14__["SwiperModule"],
                _angular_cdk_drag_drop__WEBPACK_IMPORTED_MODULE_15__["DragDropModule"],
            ],
            entryComponents: [
                _components_flash_dialog_flash_dialog_component__WEBPACK_IMPORTED_MODULE_11__["FlashDialogComponent"],
                _components_youtube_dialog_youtube_dialog_component__WEBPACK_IMPORTED_MODULE_13__["YoutubeDialogComponent"],
            ],
            providers: [
                {
                    provide: ngx_swiper_wrapper__WEBPACK_IMPORTED_MODULE_14__["SWIPER_CONFIG"],
                    useValue: DEFAULT_SWIPER_CONFIG
                }
            ]
        })
    ], PacksModule);
    return PacksModule;
}());



/***/ })

}]);
//# sourceMappingURL=modules-packs-packs-module.js.map