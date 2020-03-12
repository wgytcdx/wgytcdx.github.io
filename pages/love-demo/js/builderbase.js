/**
 * Created by 15267 on 2017/5/17.
 */
(function () {
  const j = function () {}; j.prototype = {
    Loop(b, c, a, d) { return { next(e, i) { const f = function (b) { a.next(e, (a, e) => { if (a == 'normal' || a == 'continue')g(b); else if (a == 'throw' || a == 'return')i(a, e); else if (a == 'break')i('normal'); else throw Error(`Invalid type for "Loop": ${a}`); }); }; var g = function (a) { try { c && !a && c.call(e), !b || b.call(e) ? f(!1) : i('normal'); } catch (d) { i('throw', d); } }; d ? f(!0) : g(!0); } }; },
    Delay(b) { return { next(c, a) { try { b.call(c).next(c, a); } catch (d) { a('throw', d); } } }; },
    Combine(b,
      c) { return { next(a, d) { b.next(a, (b, i, f) => { if (b == 'normal') try { c.next(a, d); } catch (g) { d('throw', g); } else d(b, i, f); }); } }; },
    Return(b) { return { next(c, a) { a('return', b); } }; },
    Normal() { return { next(b, c) { c('normal'); } }; },
    Break() { return { next(b, c) { c('break'); } }; },
    Continue() { return { next(b, c) { c('continue'); } }; },
    Throw(b) { return { next(c, a) { a('throw', b); } }; },
    Try(b, c, a) {
      return {
        next(d, e) {
          b.next(d, (b, f, g) => {
            if (b
    != 'throw' || !c)a ? a.next(d, (a, c, d) => { a == 'normal' ? e(b, f, g) : e(a, c, d); }) : e(b, f, g); else if (c) { let h; try { h = c.call(d, f); } catch (j) { a ? a.next(d, (a, b, c) => { a == 'normal' ? e('throw', j) : e(a, b, c); }) : e('throw', j); }h && h.next(d, (b, c, f) => { b == 'throw' ? a ? a.next(d, (a, d, g) => { a == 'normal' ? e(b, c, f) : e(a, d, g); }) : e(b, c, f) : a ? a.next(d, (a, d, g) => { a == 'normal' ? e(b, c, f) : e(a, d, g); }) : e(b, c, f); }); } else a.next(d, (a, c, d) => { a == 'normal' ? e(b, f, g) : e(a, c, d); });
          });
        },
      };
    },
  }; const h = function (b) {
    if (!b.modules)b.modules = {}; if (!b.modules.builderbase) {
      b.modules.builderbase = !0, b.BuilderBase = j;
    }
  }; const k = typeof define === 'function' && !define.amd; const l = typeof require === 'function' && typeof define === 'function' && define.amd; if (typeof require === 'function' && typeof module !== 'undefined' && module.exports)module.exports.init = h; else if (k)define('jscex-builderbase', (b, c, a) => { a.exports.init = h; }); else if (l)define('jscex-builderbase', () => ({ init: h })); else { if (typeof Jscex === 'undefined') throw Error('Missing the root object, please load "jscex" module first.'); h(Jscex); }
}());
