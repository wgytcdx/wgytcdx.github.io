/**
 * Created by 15267 on 2017/5/17.
 */
(function () {
  const k = function () {}; k.prototype = { isCancellation: !0, message: 'The task has been cancelled.' }; typeof __jscex__async__taskIdSeed === 'undefined' && (__jscex__async__taskIdSeed = 0); const l = function (b) { return typeof b.start === 'function' && typeof b.addEventListener === 'function' && typeof b.removeEventListener === 'function' && typeof b.complete === 'function'; }; const j = function (b) {
    if (!b.modules.async) {
      const d = function () {}; d.prototype = {
        register(a) {
          this.isCancellationRequested && a(); if (!this._handlers) {
            this._handlers = [];
          } this._handlers.push(a);
        },
        unregister(a) { this._handlers && (a = this._handlers.indexOf(a), a >= 0 && this._handlers.splice(a, 1)); },
        cancel() { if (!this.isCancellationRequested) { this.isCancellationRequested = !0; const a = this._handlers; delete this._handlers; for (let f = 0; f < a.length; f++) try { a[f](); } catch (c) { b.logger.warn(`[WARNING] Cancellation handler threw an error: ${c}`); } } },
        throwIfCancellationRequested() { if (this.isCancellationRequested) throw new k(); },
      }; const e = function (a) {
        this.id = ++__jscex__async__taskIdSeed;
        this._delegate = a; this._listeners = {}; this.status = 'ready';
      }; e.prototype = {
        start() { if (this.status != 'ready') throw Error('Task can only be started in "ready" status.'); this.status = 'running'; this._delegate(this); },
        complete(a, f) {
          if (this.status != 'running') throw Error('The "complete" method can only be called in "running" status.'); const c = this._listeners; delete this._listeners; if (a == 'success') this.result = f, this.status = 'succeeded', this._notify('success', c.success); else if (a == 'failure') {
            this.error = f, this.status = f.isCancellation ? 'canceled' : 'faulted', this._notify('failure', c.failure);
          } else throw Error(`Unsupported type: ${a}`); this._notify('complete', c.complete); this.error && !c.failure && !c.complete && b.logger.warn(`[WARNING] An unhandled error occurred: ${this.error}`);
        },
        _notify(a, f) { if (f) for (let c = 0; c < f.length; c++) try { f[c](this); } catch (i) { b.logger.warn(`[WARNING] The task's ${a} listener threw an error: ${i}`); } },
        addEventListener(a, b) {
          this._listeners && (this._listeners[a] || (this._listeners[a] = []), this._listeners[a].push(b));
        },
        removeEventListener(a, b) { if (this._listeners) { const c = this._listeners[a]; if (c) { const i = c.indexOf(b); i >= 0 && c.splice(i, 1); } } },
      }; e.create = function (a) { return new e(a); }; e.isTask = l; const h = function () {}; h.prototype = {
        Start(a, b) { return e.create((c) => { b.next(a, (a, b) => { if (a == 'normal' || a == 'return')c.complete('success', b); else if (a == 'throw')c.complete('failure', b); else throw Error(`Unsupported type: ${a}`); }); }); },
        Bind(a, b) {
          return {
            next(c, e) {
              const d = function (a) { if (a.error)e('throw', a.error); else { let d; try { d = b.call(c, a.result); } catch (h) { e('throw', h); return; }d.next(c, e); } }; a.status == 'ready' ? (a.addEventListener('complete', d), a.start()) : a.status == 'running' ? a.addEventListener('complete', d) : d(a);
            },
          };
        },
      }; for (var g in b.BuilderBase.prototype)h.prototype[g] = b.BuilderBase.prototype[g]; if (!b.Async)b.Async = {}; g = b.Async; g.CancellationToken = d; g.CanceledError = k; g.Task = e; g.AsyncBuilder = h; if (!b.builders)b.builders = {}; b.binders.async = '$await'; b.builders.async = new h();
      b.modules.async = !0;
    }
  }; const m = typeof define === 'function' && !define.amd; const n = typeof require === 'function' && typeof define === 'function' && define.amd; if (typeof require === 'function' && typeof module !== 'undefined' && module.exports)module.exports.init = function (b) { if (!b.modules.builderbase) { if (typeof __dirname === 'string') try { require.paths.unshift(__dirname); } catch (d) { try { module.paths.unshift(__dirname); } catch (e) {} }require('jscex-builderbase').init(b); }j(b); }; else if (m) {
    define('jscex-async', ['jscex-builderbase'], (b, d,
      e) => { e.exports.init = function (d) { d.modules.builderbase || b('jscex-builderbase').init(d); j(d); }; });
  } else if (n)define('jscex-async', ['jscex-builderbase'], b => ({ init(d) { d.modules.builderbase || b.init(d); j(d); } })); else { if (typeof Jscex === 'undefined') throw Error('Missing the root object, please load "jscex" module first.'); if (!Jscex.modules.builderbase) throw Error('Missing essential components, please initialize "builderbase" module first.'); j(Jscex); }
}());
