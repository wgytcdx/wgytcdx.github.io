/**
 * Created by 15267 on 2017/5/17.
 */
(function () {
  const codeGenerator = (typeof eval('(function () {})') === 'function')
    ? function (code) { return code; }
    : function (code) { return `false || ${code}`; };

  // support string type only.
  const stringify = (typeof JSON !== 'undefined' && JSON.stringify)
    ? function (s) { return JSON.stringify(s); }
    : (function () {
      // Implementation comes from JSON2 (http://www.json.org/js.html)

      const escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;

      const meta = { // table of character substitutions
        '\b': '\\b',
        '\t': '\\t',
        '\n': '\\n',
        '\f': '\\f',
        '\r': '\\r',
        '"': '\\"',
        '\\': '\\\\',
      };

      return function (s) {
        // If the string contains no control characters, no quote characters, and no
        // backslash characters, then we can safely slap some quotes around it.
        // Otherwise we must also replace the offending characters with safe escape
        // sequences.

        escapable.lastIndex = 0;
        return escapable.test(s) ? `"${s.replace(escapable, (a) => {
          const c = meta[a];
          return typeof c === 's' ? c
            : `\\u${(`0000${a.charCodeAt(0).toString(16)}`).slice(-4)}`;
        })}"` : `"${s}"`;
      };
    }());

  // seed defined in global
  if (typeof __jscex__tempVarSeed === 'undefined') {
    __jscex__tempVarSeed = 0;
  }

  const init = function (root) {
    if (root.modules.jit) {
      return;
    }

    function JscexTreeGenerator(binder) {
      this._binder = binder;
      this._root = null;
    }
    JscexTreeGenerator.prototype = {

      generate(ast) {
        const params = ast[2]; const
          statements = ast[3];

        this._root = { type: 'delay', stmts: [] };

        this._visitStatements(statements, this._root.stmts);

        return this._root;
      },

      _getBindInfo(stmt) {
        const type = stmt[0];
        if (type == 'stat') {
          var expr = stmt[1];
          if (expr[0] == 'call') {
            var callee = expr[1];
            if (callee[0] == 'name' && callee[1] == this._binder && expr[2].length == 1) {
              return {
                expression: expr[2][0],
                argName: '',
                assignee: null,
              };
            }
          } else if (expr[0] == 'assign') {
            const assignee = expr[2];
            expr = expr[3];
            if (expr[0] == 'call') {
              var callee = expr[1];
              if (callee[0] == 'name' && callee[1] == this._binder && expr[2].length == 1) {
                return {
                  expression: expr[2][0],
                  argName: '$$_result_$$',
                  assignee,
                };
              }
            }
          }
        } else if (type == 'var') {
          const defs = stmt[1];
          if (defs.length == 1) {
            const item = defs[0];
            const name = item[0];
            var expr = item[1];
            if (expr && expr[0] == 'call') {
              var callee = expr[1];
              if (callee[0] == 'name' && callee[1] == this._binder && expr[2].length == 1) {
                return {
                  expression: expr[2][0],
                  argName: name,
                  assignee: null,
                };
              }
            }
          }
        } else if (type == 'return') {
          var expr = stmt[1];
          if (expr && expr[0] == 'call') {
            var callee = expr[1];
            if (callee[0] == 'name' && callee[1] == this._binder && expr[2].length == 1) {
              return {
                expression: expr[2][0],
                argName: '$$_result_$$',
                assignee: 'return',
              };
            }
          }
        }

        return null;
      },

      _visitStatements(statements, stmts, index) {
        if (arguments.length <= 2) index = 0;

        if (index >= statements.length) {
          stmts.push({ type: 'normal' });
          return this;
        }

        const currStmt = statements[index];
        const bindInfo = this._getBindInfo(currStmt);

        if (bindInfo) {
          const bindStmt = { type: 'bind', info: bindInfo };
          stmts.push(bindStmt);

          if (bindInfo.assignee != 'return') {
            bindStmt.stmts = [];
            this._visitStatements(statements, bindStmt.stmts, index + 1);
          }
        } else {
          const type = currStmt[0];
          if (type == 'return' || type == 'break' || type == 'continue' || type == 'throw') {
            stmts.push({ type, stmt: currStmt });
          } else if (type == 'if' || type == 'try' || type == 'for' || type == 'do'
                        || type == 'while' || type == 'switch' || type == 'for-in') {
            const newStmt = this._visit(currStmt);

            if (newStmt.type == 'raw') {
              stmts.push(newStmt);
              this._visitStatements(statements, stmts, index + 1);
            } else {
              const isLast = (index == statements.length - 1);
              if (isLast) {
                stmts.push(newStmt);
              } else {
                const combineStmt = {
                  type: 'combine',
                  first: { type: 'delay', stmts: [newStmt] },
                  second: { type: 'delay', stmts: [] },
                };
                stmts.push(combineStmt);

                this._visitStatements(statements, combineStmt.second.stmts, index + 1);
              }
            }
          } else {
            stmts.push({ type: 'raw', stmt: currStmt });

            this._visitStatements(statements, stmts, index + 1);
          }
        }

        return this;
      },

      _visit(ast) {
        const type = ast[0];

        function throwUnsupportedError() {
          throw new Error(`"${type}" is not currently supported.`);
        }

        const visitor = this._visitors[type];

        if (visitor) {
          return visitor.call(this, ast);
        }
        throwUnsupportedError();
      },

      _visitBody(ast, stmts) {
        if (ast[0] == 'block') {
          this._visitStatements(ast[1], stmts);
        } else {
          this._visitStatements([ast], stmts);
        }
      },

      _noBinding(stmts) {
        switch (stmts[stmts.length - 1].type) {
          case 'normal':
          case 'return':
          case 'break':
          case 'throw':
          case 'continue':
            return true;
        }

        return false;
      },

      _collectCaseStatements(cases, index) {
        const res = [];

        for (let i = index; i < cases.length; i++) {
          const rawStmts = cases[i][1];
          for (let j = 0; j < rawStmts.length; j++) {
            if (rawStmts[j][0] == 'break') {
              return res;
            }

            res.push(rawStmts[j]);
          }
        }

        return res;
      },

      _visitors: {

        for(ast) {
          const bodyStmts = [];
          const body = ast[4];
          this._visitBody(body, bodyStmts);

          if (this._noBinding(bodyStmts)) {
            return { type: 'raw', stmt: ast };
          }

          const delayStmt = { type: 'delay', stmts: [] };

          const setup = ast[1];
          if (setup) {
            delayStmt.stmts.push({ type: 'raw', stmt: setup });
          }

          const loopStmt = { type: 'loop', bodyFirst: false, bodyStmt: { type: 'delay', stmts: bodyStmts } };
          delayStmt.stmts.push(loopStmt);

          const condition = ast[2];
          if (condition) {
            loopStmt.condition = condition;
          }

          const update = ast[3];
          if (update) {
            loopStmt.update = update;
          }

          return delayStmt;
        },

        'for-in': function (ast) {
          const body = ast[4];

          const bodyStmts = [];
          this._visitBody(body, bodyStmts);

          if (this._noBinding(bodyStmts)) {
            return { type: 'raw', stmt: ast };
          }

          const id = (__jscex__tempVarSeed++);
          const keysVar = `$$_keys_$$_${id}`;
          const indexVar = `$$_index_$$_${id}`;
          // var memVar = "$$_mem_$$_" + id;

          const delayStmt = { type: 'delay', stmts: [] };

          // var members = Jscex._forInKeys(obj);
          const keysAst = root.parse(`var ${keysVar} = Jscex._forInKeys(obj);`)[1][0];
          keysAst[1][0][1][2][0] = ast[3]; // replace obj with real AST;
          delayStmt.stmts.push({ type: 'raw', stmt: keysAst });

          /*
                     // var members = [];
                     delayStmt.stmts.push({
                     type: "raw",
                     stmt: uglifyJS.parse("var " + membersVar + " = [];")[1][0]
                     });

                     // for (var mem in obj) members.push(mem);
                     var keysAst = uglifyJS.parse("for (var " + memVar +" in obj) " + membersVar + ".push(" + memVar + ");")[1][0];
                     keysAst[3] = ast[3]; // replace the "obj" with real AST.
                     delayStmt.stmts.push({ type : "raw", stmt: keysAst});
                     */

          // var index = 0;
          delayStmt.stmts.push({
            type: 'raw',
            stmt: root.parse(`var ${indexVar} = 0;`)[1][0],
          });

          // index < members.length
          const condition = root.parse(`${indexVar} < ${keysVar}.length`)[1][0][1];

          // index++
          const update = root.parse(`${indexVar}++`)[1][0][1];

          const loopStmt = {
            type: 'loop',
            bodyFirst: false,
            update,
            condition,
            bodyStmt: { type: 'delay', stmts: [] },
          };
          delayStmt.stmts.push(loopStmt);

          const varName = ast[2][1]; // ast[2] == ["name", m]
          if (ast[1][0] == 'var') {
            loopStmt.bodyStmt.stmts.push({
              type: 'raw',
              stmt: root.parse(`var ${varName} = ${keysVar}[${indexVar}];`)[1][0],
            });
          } else {
            loopStmt.bodyStmt.stmts.push({
              type: 'raw',
              stmt: root.parse(`${varName} = ${keysVar}[${indexVar}];`)[1][0],
            });
          }

          this._visitBody(body, loopStmt.bodyStmt.stmts);

          return delayStmt;
        },

        while(ast) {
          const bodyStmts = [];
          const body = ast[2];
          this._visitBody(body, bodyStmts);

          if (this._noBinding(bodyStmts)) {
            return { type: 'raw', stmt: ast };
          }

          const loopStmt = { type: 'loop', bodyFirst: false, bodyStmt: { type: 'delay', stmts: bodyStmts } };

          const condition = ast[1];
          loopStmt.condition = condition;

          return loopStmt;
        },

        do(ast) {
          const bodyStmts = [];
          const body = ast[2];
          this._visitBody(body, bodyStmts);

          if (this._noBinding(bodyStmts)) {
            return { type: 'raw', stmt: ast };
          }

          const loopStmt = { type: 'loop', bodyFirst: true, bodyStmt: { type: 'delay', stmts: bodyStmts } };

          const condition = ast[1];
          loopStmt.condition = condition;

          return loopStmt;
        },

        switch(ast) {
          let noBinding = true;

          const switchStmt = { type: 'switch', item: ast[1], caseStmts: [] };

          const cases = ast[2];
          for (let i = 0; i < cases.length; i++) {
            const caseStmt = { item: cases[i][0], stmts: [] };
            switchStmt.caseStmts.push(caseStmt);

            const statements = this._collectCaseStatements(cases, i);
            this._visitStatements(statements, caseStmt.stmts);
            noBinding = noBinding && this._noBinding(caseStmt.stmts);
          }

          if (noBinding) {
            return { type: 'raw', stmt: ast };
          }
          return switchStmt;
        },

        if(ast) {
          let noBinding = true;

          const ifStmt = { type: 'if', conditionStmts: [] };

          let currAst = ast;
          while (true) {
            const condition = currAst[1];
            const condStmt = { cond: condition, stmts: [] };
            ifStmt.conditionStmts.push(condStmt);

            const thenPart = currAst[2];
            this._visitBody(thenPart, condStmt.stmts);

            noBinding = noBinding && this._noBinding(condStmt.stmts);

            var elsePart = currAst[3];
            if (elsePart && elsePart[0] == 'if') {
              currAst = elsePart;
            } else {
              break;
            }
          }

          var elsePart = currAst[3];
          if (elsePart) {
            ifStmt.elseStmts = [];

            this._visitBody(elsePart, ifStmt.elseStmts);

            noBinding = noBinding && this._noBinding(ifStmt.elseStmts);
          }

          if (noBinding) {
            return { type: 'raw', stmt: ast };
          }
          return ifStmt;
        },

        try(ast, stmts) {
          const bodyStmts = [];
          const bodyStatements = ast[1];
          this._visitStatements(bodyStatements, bodyStmts);

          let noBinding = this._noBinding(bodyStmts);

          const tryStmt = { type: 'try', bodyStmt: { type: 'delay', stmts: bodyStmts } };

          const catchClause = ast[2];
          if (catchClause) {
            const exVar = catchClause[0];
            tryStmt.exVar = exVar;
            tryStmt.catchStmts = [];

            this._visitStatements(catchClause[1], tryStmt.catchStmts);

            noBinding = noBinding && this._noBinding(tryStmt.catchStmts);
          }

          const finallyStatements = ast[3];
          if (finallyStatements) {
            tryStmt.finallyStmt = { type: 'delay', stmts: [] };

            this._visitStatements(finallyStatements, tryStmt.finallyStmt.stmts);

            noBinding = noBinding && this._noBinding(tryStmt.finallyStmt.stmts);
          }

          if (noBinding) {
            return { type: 'raw', stmt: ast };
          }
          return tryStmt;
        },
      },
    };

    function CodeGenerator(builderName, binder, indent) {
      this._builderName = builderName;
      this._binder = binder;
      this._normalMode = false;
      this._indent = indent;
      this._indentLevel = 0;
      this._builderVar = `$$_builder_$$_${__jscex__tempVarSeed++}`;
    }
    CodeGenerator.prototype = {
      _write(s) {
        this._buffer.push(s);
        return this;
      },

      _writeLine(s) {
        this._write(s)._write('\n');
        return this;
      },

      _writeIndents() {
        for (var i = 0; i < this._indent; i++) {
          this._write(' ');
        }

        for (var i = 0; i < this._indentLevel; i++) {
          this._write('    ');
        }
        return this;
      },

      generate(params, jscexAst) {
        this._buffer = [];

        this._writeLine(`(function (${params.join(', ')}) {`);
        this._indentLevel++;

        this._writeIndents()
          ._writeLine(`var ${this._builderVar} = Jscex.builders[${stringify(this._builderName)}];`);

        this._writeIndents()
          ._writeLine(`return ${this._builderVar}.Start(this,`);
        this._indentLevel++;

        this._pos = { };

        this._writeIndents()
          ._visitJscex(jscexAst)
          ._writeLine();
        this._indentLevel--;

        this._writeIndents()
          ._writeLine(');');
        this._indentLevel--;

        this._writeIndents()
          ._write('})');

        return this._buffer.join('');
      },

      _visitJscex(ast) {
        this._jscexVisitors[ast.type].call(this, ast);
        return this;
      },

      _visitRaw(ast) {
        const type = ast[0];

        function throwUnsupportedError() {
          throw new Error(`"${type}" is not currently supported.`);
        }

        const visitor = this._rawVisitors[type];

        if (visitor) {
          visitor.call(this, ast);
        } else {
          throwUnsupportedError();
        }

        return this;
      },

      _visitJscexStatements(statements) {
        for (let i = 0; i < statements.length; i++) {
          const stmt = statements[i];

          if (stmt.type == 'raw' || stmt.type == 'if' || stmt.type == 'switch') {
            this._writeIndents()
              ._visitJscex(stmt)._writeLine();
          } else if (stmt.type == 'delay') {
            this._visitJscexStatements(stmt.stmts);
          } else {
            this._writeIndents()
              ._write('return ')._visitJscex(stmt)._writeLine(';');
          }
        }
      },

      _visitRawStatements(statements) {
        for (let i = 0; i < statements.length; i++) {
          const s = statements[i];

          this._writeIndents()
            ._visitRaw(s)._writeLine();

          switch (s[0]) {
            case 'break':
            case 'return':
            case 'continue':
            case 'throw':
              return;
          }
        }
      },

      _visitRawBody(body) {
        if (body[0] == 'block') {
          this._visitRaw(body);
        } else {
          this._writeLine();
          this._indentLevel++;

          this._writeIndents()
            ._visitRaw(body);
          this._indentLevel--;
        }

        return this;
      },

      _visitRawFunction(ast) {
        const funcName = ast[1] || '';
        const args = ast[2];
        const statements = ast[3];

        this._writeLine(`function ${funcName}(${args.join(', ')}) {`);
        this._indentLevel++;

        const currInFunction = this._pos.inFunction;
        this._pos.inFunction = true;

        this._visitRawStatements(statements);
        this._indentLevel--;

        this._pos.inFunction = currInFunction;

        this._writeIndents()
          ._write('}');
      },

      _jscexVisitors: {
        delay(ast) {
          if (ast.stmts.length == 1) {
            const subStmt = ast.stmts[0];
            switch (subStmt.type) {
              case 'delay':
              case 'combine':
              case 'normal':
              case 'break':
              case 'continue':
              case 'loop':
              case 'try':
                this._visitJscex(subStmt);
                return;
              case 'return':
                if (!subStmt.stmt[1]) {
                  this._visitJscex(subStmt);
                  return;
                }
            }
          }

          this._writeLine(`${this._builderVar}.Delay(function () {`);
          this._indentLevel++;

          this._visitJscexStatements(ast.stmts);
          this._indentLevel--;

          this._writeIndents()
            ._write('})');
        },

        combine(ast) {
          this._writeLine(`${this._builderVar}.Combine(`);
          this._indentLevel++;

          this._writeIndents()
            ._visitJscex(ast.first)._writeLine(',');
          this._writeIndents()
            ._visitJscex(ast.second)._writeLine();
          this._indentLevel--;

          this._writeIndents()
            ._write(')');
        },

        loop(ast) {
          this._writeLine(`${this._builderVar}.Loop(`);
          this._indentLevel++;

          if (ast.condition) {
            this._writeIndents()
              ._writeLine('function () {');
            this._indentLevel++;

            this._writeIndents()
              ._write('return ')._visitRaw(ast.condition)._writeLine(';');
            this._indentLevel--;

            this._writeIndents()
              ._writeLine('},');
          } else {
            this._writeIndents()._writeLine('null,');
          }

          if (ast.update) {
            this._writeIndents()
              ._writeLine('function () {');
            this._indentLevel++;

            this._writeIndents()
              ._visitRaw(ast.update)._writeLine(';');
            this._indentLevel--;

            this._writeIndents()
              ._writeLine('},');
          } else {
            this._writeIndents()._writeLine('null,');
          }

          this._writeIndents()
            ._visitJscex(ast.bodyStmt)._writeLine(',');

          this._writeIndents()
            ._writeLine(ast.bodyFirst);
          this._indentLevel--;

          this._writeIndents()
            ._write(')');
        },

        raw(ast) {
          this._visitRaw(ast.stmt);
        },

        bind(ast) {
          const { info } = ast;
          this._write(`${this._builderVar}.Bind(`)._visitRaw(info.expression)._writeLine(`, function (${info.argName}) {`);
          this._indentLevel++;

          if (info.assignee == 'return') {
            this._writeIndents()
              ._writeLine(`return ${this._builderVar}.Return(${info.argName});`);
          } else {
            if (info.assignee) {
              this._writeIndents()
                ._visitRaw(info.assignee)._writeLine(` = ${info.argName};`);
            }

            this._visitJscexStatements(ast.stmts);
          }
          this._indentLevel--;

          this._writeIndents()
            ._write('})');
        },

        if(ast) {
          for (let i = 0; i < ast.conditionStmts.length; i++) {
            const stmt = ast.conditionStmts[i];

            this._write('if (')._visitRaw(stmt.cond)._writeLine(') {');
            this._indentLevel++;

            this._visitJscexStatements(stmt.stmts);
            this._indentLevel--;

            this._writeIndents()
              ._write('} else ');
          }

          this._writeLine('{');
          this._indentLevel++;

          if (ast.elseStmts) {
            this._visitJscexStatements(ast.elseStmts);
          } else {
            this._writeIndents()
              ._writeLine(`return ${this._builderVar}.Normal();`);
          }

          this._indentLevel--;

          this._writeIndents()
            ._write('}');
        },

        switch(ast) {
          this._write('switch (')._visitRaw(ast.item)._writeLine(') {');
          this._indentLevel++;

          for (let i = 0; i < ast.caseStmts.length; i++) {
            const caseStmt = ast.caseStmts[i];

            if (caseStmt.item) {
              this._writeIndents()
                ._write('case ')._visitRaw(caseStmt.item)._writeLine(':');
            } else {
              this._writeIndents()._writeLine('default:');
            }
            this._indentLevel++;

            this._visitJscexStatements(caseStmt.stmts);
            this._indentLevel--;
          }

          this._writeIndents()
            ._write('}');
        },

        try(ast) {
          this._writeLine(`${this._builderVar}.Try(`);
          this._indentLevel++;

          this._writeIndents()
            ._visitJscex(ast.bodyStmt)._writeLine(',');

          if (ast.catchStmts) {
            this._writeIndents()
              ._writeLine(`function (${ast.exVar}) {`);
            this._indentLevel++;

            this._visitJscexStatements(ast.catchStmts);
            this._indentLevel--;

            this._writeIndents()
              ._writeLine('},');
          } else {
            this._writeIndents()
              ._writeLine('null,');
          }

          if (ast.finallyStmt) {
            this._writeIndents()
              ._visitJscex(ast.finallyStmt)._writeLine();
          } else {
            this._writeIndents()
              ._writeLine('null');
          }
          this._indentLevel--;

          this._writeIndents()
            ._write(')');
        },

        normal(ast) {
          this._write(`${this._builderVar}.Normal()`);
        },

        throw(ast) {
          this._write(`${this._builderVar}.Throw(`)._visitRaw(ast.stmt[1])._write(')');
        },

        break(ast) {
          this._write(`${this._builderVar}.Break()`);
        },

        continue(ast) {
          this._write(`${this._builderVar}.Continue()`);
        },

        return(ast) {
          this._write(`${this._builderVar}.Return(`);
          if (ast.stmt[1]) this._visitRaw(ast.stmt[1]);
          this._write(')');
        },
      },

      _rawVisitors: {
        var(ast) {
          this._write('var ');

          const items = ast[1];
          for (let i = 0; i < items.length; i++) {
            this._write(items[i][0]);
            if (items[i].length > 1) {
              this._write(' = ')._visitRaw(items[i][1]);
            }
            if (i < items.length - 1) this._write(', ');
          }

          this._write(';');
        },

        seq(ast) {
          for (let i = 1; i < ast.length; i++) {
            this._visitRaw(ast[i]);
            if (i < ast.length - 1) this._write(', ');
          }
        },

        binary(ast) {
          const op = ast[1]; const left = ast[2]; const
            right = ast[3];

          function needBracket(item) {
            const type = item[0];
            return !(type == 'num' || type == 'name' || type == 'dot');
          }

          if (needBracket(left)) {
            this._write('(')._visitRaw(left)._write(') ');
          } else {
            this._visitRaw(left)._write(' ');
          }

          this._write(op);

          if (needBracket(right)) {
            this._write(' (')._visitRaw(right)._write(')');
          } else {
            this._write(' ')._visitRaw(right);
          }
        },

        sub(ast) {
          const prop = ast[1]; const
            index = ast[2];

          function needBracket() {
            return !(prop[0] == 'name');
          }

          if (needBracket()) {
            this._write('(')._visitRaw(prop)._write(')[')._visitRaw(index)
              ._write(']');
          } else {
            this._visitRaw(prop)._write('[')._visitRaw(index)._write(']');
          }
        },

        'unary-postfix': function (ast) {
          const op = ast[1];
          const item = ast[2];
          this._visitRaw(item)._write(op);
        },

        'unary-prefix': function (ast) {
          const op = ast[1];
          const item = ast[2];
          this._write(op);
          if (op == 'typeof') {
            this._write('(')._visitRaw(item)._write(')');
          } else {
            this._visitRaw(item);
          }
        },

        assign(ast) {
          const op = ast[1];
          const name = ast[2];
          const value = ast[3];

          this._visitRaw(name);
          if ((typeof op) === 'string') {
            this._write(` ${op}= `);
          } else {
            this._write(' = ');
          }
          this._visitRaw(value);
        },

        stat(ast) {
          this._visitRaw(ast[1])._write(';');
        },

        dot(ast) {
          function needBracket() {
            const leftOp = ast[1][0];
            return !(leftOp == 'dot' || leftOp == 'name');
          }

          if (needBracket()) {
            this._write('(')._visitRaw(ast[1])._write(').')._write(ast[2]);
          } else {
            this._visitRaw(ast[1])._write('.')._write(ast[2]);
          }
        },

        new(ast) {
          const ctor = ast[1];

          this._write('new ')._visitRaw(ctor)._write('(');

          const args = ast[2];
          for (let i = 0, len = args.length; i < len; i++) {
            this._visitRaw(args[i]);
            if (i < len - 1) this._write(', ');
          }

          this._write(')');
        },

        call(ast) {
          if (_isJscexPattern(ast)) {
            const indent = this._indent + this._indentLevel * 4;
            const newCode = _compileJscexPattern(ast, indent);
            this._write(newCode);
          } else {
            const invalidBind = (ast[1][0] == 'name') && (ast[1][1] == this._binder);
            if (invalidBind) {
              this._pos = { inFunction: true };
              this._buffer = [];
            }

            this._visitRaw(ast[1])._write('(');

            const args = ast[2];
            for (let i = 0; i < args.length; i++) {
              this._visitRaw(args[i]);
              if (i < args.length - 1) this._write(', ');
            }

            this._write(')');

            if (invalidBind) {
              throw (`Invalid bind operation: ${this._buffer.join('')}`);
            }
          }
        },

        name(ast) {
          this._write(ast[1]);
        },

        object(ast) {
          const items = ast[1];
          if (items.length <= 0) {
            this._write('{ }');
          } else {
            this._writeLine('{');
            this._indentLevel++;

            for (let i = 0; i < items.length; i++) {
              this._writeIndents()
                ._write(`${stringify(items[i][0])}: `)
                ._visitRaw(items[i][1]);

              if (i < items.length - 1) {
                this._writeLine(',');
              } else {
                this._writeLine('');
              }
            }

            this._indentLevel--;
            this._writeIndents()._write('}');
          }
        },

        array(ast) {
          this._write('[');

          const items = ast[1];
          for (let i = 0; i < items.length; i++) {
            this._visitRaw(items[i]);
            if (i < items.length - 1) this._write(', ');
          }

          this._write(']');
        },

        num(ast) {
          this._write(ast[1]);
        },

        regexp(ast) {
          this._write(`/${ast[1]}/${ast[2]}`);
        },

        string(ast) {
          this._write(stringify(ast[1]));
        },

        function(ast) {
          this._visitRawFunction(ast);
        },

        defun(ast) {
          this._visitRawFunction(ast);
        },

        return(ast) {
          if (this._pos.inFunction) {
            this._write('return');
            const value = ast[1];
            if (value) this._write(' ')._visitRaw(value);
            this._write(';');
          } else {
            this._write('return ')._visitJscex({ type: 'return', stmt: ast })._write(';');
          }
        },

        for(ast) {
          this._write('for (');

          const setup = ast[1];
          if (setup) {
            this._visitRaw(setup);
            if (setup[0] != 'var') {
              this._write('; ');
            } else {
              this._write(' ');
            }
          } else {
            this._write('; ');
          }

          const condition = ast[2];
          if (condition) this._visitRaw(condition);
          this._write('; ');

          const update = ast[3];
          if (update) this._visitRaw(update);
          this._write(') ');

          const currInLoop = this._pos.inLoop;
          this._pos.inLoop = true;

          const body = ast[4];
          this._visitRawBody(body);

          this._pos.inLoop = currInLoop;
        },

        'for-in': function (ast) {
          this._write('for (');

          const declare = ast[1];
          if (declare[0] == 'var') { // declare == ["var", [["m"]]]
            this._write(`var ${declare[1][0][0]}`);
          } else {
            this._visitRaw(declare);
          }

          this._write(' in ')._visitRaw(ast[3])._write(') ');

          const body = ast[4];
          this._visitRawBody(body);
        },

        block(ast) {
          this._writeLine('{');
          this._indentLevel++;

          this._visitRawStatements(ast[1]);
          this._indentLevel--;

          this._writeIndents()
            ._write('}');
        },

        while(ast) {
          const condition = ast[1];
          const body = ast[2];

          const currInLoop = this._pos.inLoop;
          this._pos.inLoop = true;

          this._write('while (')._visitRaw(condition)._write(') ')._visitRawBody(body);

          this._pos.inLoop = currInLoop;
        },

        do(ast) {
          const condition = ast[1];
          const body = ast[2];

          const currInLoop = this._pos.inLoop;
          this._pos.inLoop = true;

          this._write('do ')._visitRawBody(body);

          this._pos.inLoop = currInLoop;

          if (body[0] == 'block') {
            this._write(' ');
          } else {
            this._writeLine()._writeIndents();
          }

          this._write('while (')._visitRaw(condition)._write(');');
        },

        if(ast) {
          const condition = ast[1];
          const thenPart = ast[2];

          this._write('if (')._visitRaw(condition)._write(') ')._visitRawBody(thenPart);

          const elsePart = ast[3];
          if (elsePart) {
            if (thenPart[0] == 'block') {
              this._write(' ');
            } else {
              this._writeLine('')
                ._writeIndents();
            }

            if (elsePart[0] == 'if') {
              this._write('else ')._visitRaw(elsePart);
            } else {
              this._write('else ')._visitRawBody(elsePart);
            }
          }
        },

        break(ast) {
          if (this._pos.inLoop || this._pos.inSwitch) {
            this._write('break;');
          } else {
            this._write('return ')._visitJscex({ type: 'break', stmt: ast })._write(';');
          }
        },

        continue(ast) {
          if (this._pos.inLoop) {
            this._write('continue;');
          } else {
            this._write('return ')._visitJscex({ type: 'continue', stmt: ast })._write(';');
          }
        },

        throw(ast) {
          const pos = this._pos;
          if (pos.inTry || pos.inFunction) {
            this._write('throw ')._visitRaw(ast[1])._write(';');
          } else {
            this._write('return ')._visitJscex({ type: 'throw', stmt: ast })._write(';');
          }
        },

        conditional(ast) {
          this._write('(')._visitRaw(ast[1])._write(') ? (')._visitRaw(ast[2])
            ._write(') : (')
            ._visitRaw(ast[3])
            ._write(')');
        },

        try(ast) {
          this._writeLine('try {');
          this._indentLevel++;

          const currInTry = this._pos.inTry;
          this._pos.inTry = true;

          this._visitRawStatements(ast[1]);
          this._indentLevel--;

          this._pos.inTry = currInTry;

          const catchClause = ast[2];
          const finallyStatements = ast[3];

          if (catchClause) {
            this._writeIndents()
              ._writeLine(`} catch (${catchClause[0]}) {`);
            this._indentLevel++;

            this._visitRawStatements(catchClause[1]);
            this._indentLevel--;
          }

          if (finallyStatements) {
            this._writeIndents()
              ._writeLine('} finally {');
            this._indentLevel++;

            this._visitRawStatements(finallyStatements);
            this._indentLevel--;
          }

          this._writeIndents()
            ._write('}');
        },

        switch(ast) {
          this._write('switch (')._visitRaw(ast[1])._writeLine(') {');
          this._indentLevel++;

          const currInSwitch = this._pos.inSwitch;
          this._pos.inSwitch = true;

          const cases = ast[2];
          for (let i = 0; i < cases.length; i++) {
            const c = cases[i];
            this._writeIndents();

            if (c[0]) {
              this._write('case ')._visitRaw(c[0])._writeLine(':');
            } else {
              this._writeLine('default:');
            }
            this._indentLevel++;

            this._visitRawStatements(c[1]);
            this._indentLevel--;
          }
          this._indentLevel--;

          this._pos.inSwitch = currInSwitch;

          this._writeIndents()
            ._write('}');
        },
      },
    };

    function _isJscexPattern(ast) {
      if (ast[0] != 'call') return false;

      const evalName = ast[1];
      if (evalName[0] != 'name' || evalName[1] != 'eval') return false;

      const compileCall = ast[2][0];
      if (!compileCall || compileCall[0] != 'call') return false;

      const compileMethod = compileCall[1];
      if (!compileMethod || compileMethod[0] != 'dot' || compileMethod[2] != 'compile') return false;

      const jscexName = compileMethod[1];
      if (!jscexName || jscexName[0] != 'name' || jscexName[1] != 'Jscex') return false;

      const builder = compileCall[2][0];
      if (!builder || builder[0] != 'string') return false;

      const func = compileCall[2][1];
      if (!func || func[0] != 'function') return false;

      return true;
    }

    function _compileJscexPattern(ast, indent) {
      const builderName = ast[2][0][2][0][1];
      const funcAst = ast[2][0][2][1];
      const binder = root.binders[builderName];

      const jscexTreeGenerator = new JscexTreeGenerator(binder);
      const jscexAst = jscexTreeGenerator.generate(funcAst);

      const codeGenerator = new CodeGenerator(builderName, binder, indent);
      const newCode = codeGenerator.generate(funcAst[2], jscexAst);

      return newCode;
    }

    function compile(builderName, func) {
      const funcCode = func.toString();
      const evalCode = `eval(Jscex.compile(${stringify(builderName)}, ${funcCode}))`;
      const evalCodeAst = root.parse(evalCode);

      // [ "toplevel", [ [ "stat", [ "call", ... ] ] ] ]
      const evalAst = evalCodeAst[1][0][1];
      const newCode = _compileJscexPattern(evalAst, 0);

      root.logger.debug(`${funcCode}\n\n>>>\n\n${newCode}`);

      return codeGenerator(newCode);
    }

    root.compile = compile;

    root.modules.jit = true;
  };

  const isCommonJS = (typeof require !== 'undefined' && typeof module !== 'undefined' && module.exports);
  const isAmd = (typeof define !== 'undefined' && define.amd);

  if (isCommonJS) {
    module.exports.init = function (root) {
      if (!root.modules.parser) {
        require('./jscex-parser').init(root);
      }

      init(root);
    };
  } else if (isAmd) {
    define('jscex-jit', ['jscex-parser'], parser => ({
      init(root) {
        if (!root.modules.parser) {
          parser.init(root);
        }

        init(root);
      },
    }));
  } else {
    if (typeof Jscex === 'undefined') {
      throw new Error('Missing root object, please load "jscex" module first.');
    }

    if (!Jscex.modules.parser) {
      throw new Error('Missing essential components, please initialize "parser" module first.');
    }

    init(Jscex);
  }
}());
