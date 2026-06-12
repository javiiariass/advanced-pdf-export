var sn=Object.create;var ue=Object.defineProperty;var ln=Object.getOwnPropertyDescriptor;var cn=Object.getOwnPropertyNames;var dn=Object.getPrototypeOf,gn=Object.prototype.hasOwnProperty;var un=(e,n)=>()=>(n||e((n={exports:{}}).exports,n),n.exports),pn=(e,n)=>{for(var t in n)ue(e,t,{get:n[t],enumerable:!0})},We=(e,n,t,o)=>{if(n&&typeof n=="object"||typeof n=="function")for(let i of cn(n))!gn.call(e,i)&&i!==t&&ue(e,i,{get:()=>n[i],enumerable:!(o=ln(n,i))||o.enumerable});return e};var hn=(e,n,t)=>(t=e!=null?sn(dn(e)):{},We(n||!e||!e.__esModule?ue(t,"default",{value:e,enumerable:!0}):t,e)),mn=e=>We(ue({},"__esModule",{value:!0}),e);var pt=un((dr,ut)=>{function et(e){return e instanceof Map?e.clear=e.delete=e.set=function(){throw new Error("map is read-only")}:e instanceof Set&&(e.add=e.clear=e.delete=function(){throw new Error("set is read-only")}),Object.freeze(e),Object.getOwnPropertyNames(e).forEach(n=>{let t=e[n],o=typeof t;(o==="object"||o==="function")&&!Object.isFrozen(t)&&et(t)}),e}var he=class{constructor(n){n.data===void 0&&(n.data={}),this.data=n.data,this.isMatchIgnored=!1}ignoreMatch(){this.isMatchIgnored=!0}};function tt(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#x27;")}function ee(e,...n){let t=Object.create(null);for(let o in e)t[o]=e[o];return n.forEach(function(o){for(let i in o)t[i]=o[i]}),t}var fn="</span>",Ve=e=>!!e.scope,bn=(e,{prefix:n})=>{if(e.startsWith("language:"))return e.replace("language:","language-");if(e.includes(".")){let t=e.split(".");return[`${n}${t.shift()}`,...t.map((o,i)=>`${o}${"_".repeat(i+1)}`)].join(" ")}return`${n}${e}`},Me=class{constructor(n,t){this.buffer="",this.classPrefix=t.classPrefix,n.walk(this)}addText(n){this.buffer+=tt(n)}openNode(n){if(!Ve(n))return;let t=bn(n.scope,{prefix:this.classPrefix});this.span(t)}closeNode(n){Ve(n)&&(this.buffer+=fn)}value(){return this.buffer}span(n){this.buffer+=`<span class="${n}">`}},Ze=(e={})=>{let n={children:[]};return Object.assign(n,e),n},Oe=class e{constructor(){this.rootNode=Ze(),this.stack=[this.rootNode]}get top(){return this.stack[this.stack.length-1]}get root(){return this.rootNode}add(n){this.top.children.push(n)}openNode(n){let t=Ze({scope:n});this.add(t),this.stack.push(t)}closeNode(){if(this.stack.length>1)return this.stack.pop()}closeAllNodes(){for(;this.closeNode(););}toJSON(){return JSON.stringify(this.rootNode,null,4)}walk(n){return this.constructor._walk(n,this.rootNode)}static _walk(n,t){return typeof t=="string"?n.addText(t):t.children&&(n.openNode(t),t.children.forEach(o=>this._walk(n,o)),n.closeNode(t)),n}static _collapse(n){typeof n!="string"&&n.children&&(n.children.every(t=>typeof t=="string")?n.children=[n.children.join("")]:n.children.forEach(t=>{e._collapse(t)}))}},Re=class extends Oe{constructor(n){super(),this.options=n}addText(n){n!==""&&this.add(n)}startScope(n){this.openNode(n)}endScope(){this.closeNode()}__addSublanguage(n,t){let o=n.root;t&&(o.scope=`language:${t}`),this.add(o)}toHTML(){return new Me(this,this.options).value()}finalize(){return this.closeAllNodes(),!0}};function le(e){return e?typeof e=="string"?e:e.source:null}function nt(e){return oe("(?=",e,")")}function En(e){return oe("(?:",e,")*")}function _n(e){return oe("(?:",e,")?")}function oe(...e){return e.map(t=>le(t)).join("")}function yn(e){let n=e[e.length-1];return typeof n=="object"&&n.constructor===Object?(e.splice(e.length-1,1),n):{}}function Be(...e){return"("+(yn(e).capture?"":"?:")+e.map(o=>le(o)).join("|")+")"}function ot(e){return new RegExp(e.toString()+"|").exec("").length-1}function wn(e,n){let t=e&&e.exec(n);return t&&t.index===0}var Sn=/\[(?:[^\\\]]|\\.)*\]|\(\??|\\([1-9][0-9]*)|\\./;function De(e,{joinWith:n}){let t=0;return e.map(o=>{t+=1;let i=t,l=le(o),a="";for(;l.length>0;){let r=Sn.exec(l);if(!r){a+=l;break}a+=l.substring(0,r.index),l=l.substring(r.index+r[0].length),r[0][0]==="\\"&&r[1]?a+="\\"+String(Number(r[1])+i):(a+=r[0],r[0]==="("&&t++)}return a}).map(o=>`(${o})`).join(n)}var Tn=/\b\B/,rt="[a-zA-Z]\\w*",je="[a-zA-Z_]\\w*",at="\\b\\d+(\\.\\d+)?",it="(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)",st="\\b(0b[01]+)",vn="!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~",xn=(e={})=>{let n=/^#![ ]*\//;return e.binary&&(e.begin=oe(n,/.*\b/,e.binary,/\b.*/)),ee({scope:"meta",begin:n,end:/$/,relevance:0,"on:begin":(t,o)=>{t.index!==0&&o.ignoreMatch()}},e)},ce={begin:"\\\\[\\s\\S]",relevance:0},Nn={scope:"string",begin:"'",end:"'",illegal:"\\n",contains:[ce]},Cn={scope:"string",begin:'"',end:'"',illegal:"\\n",contains:[ce]},kn={begin:/\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|they|like|more)\b/},fe=function(e,n,t={}){let o=ee({scope:"comment",begin:e,end:n,contains:[]},t);o.contains.push({scope:"doctag",begin:"[ ]*(?=(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):)",end:/(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):/,excludeBegin:!0,relevance:0});let i=Be("I","a","is","so","us","to","at","if","in","it","on",/[A-Za-z]+['](d|ve|re|ll|t|s|n)/,/[A-Za-z]+[-][a-z]+/,/[A-Za-z][a-z]{2,}/);return o.contains.push({begin:oe(/[ ]+/,"(",i,/[.]?[:]?([.][ ]|[ ])/,"){3}")}),o},An=fe("//","$"),Mn=fe("/\\*","\\*/"),On=fe("#","$"),Rn={scope:"number",begin:at,relevance:0},Ln={scope:"number",begin:it,relevance:0},Bn={scope:"number",begin:st,relevance:0},Dn={scope:"regexp",begin:/\/(?=[^/\n]*\/)/,end:/\/[gimuy]*/,contains:[ce,{begin:/\[/,end:/\]/,relevance:0,contains:[ce]}]},jn={scope:"title",begin:rt,relevance:0},In={scope:"title",begin:je,relevance:0},Fn={begin:"\\.\\s*"+je,relevance:0},Hn=function(e){return Object.assign(e,{"on:begin":(n,t)=>{t.data._beginMatch=n[1]},"on:end":(n,t)=>{t.data._beginMatch!==n[1]&&t.ignoreMatch()}})},pe=Object.freeze({__proto__:null,APOS_STRING_MODE:Nn,BACKSLASH_ESCAPE:ce,BINARY_NUMBER_MODE:Bn,BINARY_NUMBER_RE:st,COMMENT:fe,C_BLOCK_COMMENT_MODE:Mn,C_LINE_COMMENT_MODE:An,C_NUMBER_MODE:Ln,C_NUMBER_RE:it,END_SAME_AS_BEGIN:Hn,HASH_COMMENT_MODE:On,IDENT_RE:rt,MATCH_NOTHING_RE:Tn,METHOD_GUARD:Fn,NUMBER_MODE:Rn,NUMBER_RE:at,PHRASAL_WORDS_MODE:kn,QUOTE_STRING_MODE:Cn,REGEXP_MODE:Dn,RE_STARTERS_RE:vn,SHEBANG:xn,TITLE_MODE:jn,UNDERSCORE_IDENT_RE:je,UNDERSCORE_TITLE_MODE:In});function Pn(e,n){e.input[e.index-1]==="."&&n.ignoreMatch()}function $n(e,n){e.className!==void 0&&(e.scope=e.className,delete e.className)}function Un(e,n){n&&e.beginKeywords&&(e.begin="\\b("+e.beginKeywords.split(" ").join("|")+")(?!\\.)(?=\\b|\\s)",e.__beforeBegin=Pn,e.keywords=e.keywords||e.beginKeywords,delete e.beginKeywords,e.relevance===void 0&&(e.relevance=0))}function zn(e,n){Array.isArray(e.illegal)&&(e.illegal=Be(...e.illegal))}function Gn(e,n){if(e.match){if(e.begin||e.end)throw new Error("begin & end are not supported with match");e.begin=e.match,delete e.match}}function qn(e,n){e.relevance===void 0&&(e.relevance=1)}var Kn=(e,n)=>{if(!e.beforeMatch)return;if(e.starts)throw new Error("beforeMatch cannot be used with starts");let t=Object.assign({},e);Object.keys(e).forEach(o=>{delete e[o]}),e.keywords=t.keywords,e.begin=oe(t.beforeMatch,nt(t.begin)),e.starts={relevance:0,contains:[Object.assign(t,{endsParent:!0})]},e.relevance=0,delete t.beforeMatch},Wn=["of","and","for","in","not","or","if","then","parent","list","value"],Vn="keyword";function lt(e,n,t=Vn){let o=Object.create(null);return typeof e=="string"?i(t,e.split(" ")):Array.isArray(e)?i(t,e):Object.keys(e).forEach(function(l){Object.assign(o,lt(e[l],n,l))}),o;function i(l,a){n&&(a=a.map(r=>r.toLowerCase())),a.forEach(function(r){let s=r.split("|");o[s[0]]=[l,Zn(s[0],s[1])]})}}function Zn(e,n){return n?Number(n):Yn(e)?0:1}function Yn(e){return Wn.includes(e.toLowerCase())}var Ye={},ne=e=>{console.error(e)},Xe=(e,...n)=>{console.log(`WARN: ${e}`,...n)},ae=(e,n)=>{Ye[`${e}/${n}`]||(console.log(`Deprecated as of ${e}. ${n}`),Ye[`${e}/${n}`]=!0)},me=new Error;function ct(e,n,{key:t}){let o=0,i=e[t],l={},a={};for(let r=1;r<=n.length;r++)a[r+o]=i[r],l[r+o]=!0,o+=ot(n[r-1]);e[t]=a,e[t]._emit=l,e[t]._multi=!0}function Xn(e){if(Array.isArray(e.begin)){if(e.skip||e.excludeBegin||e.returnBegin)throw ne("skip, excludeBegin, returnBegin not compatible with beginScope: {}"),me;if(typeof e.beginScope!="object"||e.beginScope===null)throw ne("beginScope must be object"),me;ct(e,e.begin,{key:"beginScope"}),e.begin=De(e.begin,{joinWith:""})}}function Jn(e){if(Array.isArray(e.end)){if(e.skip||e.excludeEnd||e.returnEnd)throw ne("skip, excludeEnd, returnEnd not compatible with endScope: {}"),me;if(typeof e.endScope!="object"||e.endScope===null)throw ne("endScope must be object"),me;ct(e,e.end,{key:"endScope"}),e.end=De(e.end,{joinWith:""})}}function Qn(e){e.scope&&typeof e.scope=="object"&&e.scope!==null&&(e.beginScope=e.scope,delete e.scope)}function eo(e){Qn(e),typeof e.beginScope=="string"&&(e.beginScope={_wrap:e.beginScope}),typeof e.endScope=="string"&&(e.endScope={_wrap:e.endScope}),Xn(e),Jn(e)}function to(e){function n(a,r){return new RegExp(le(a),"m"+(e.case_insensitive?"i":"")+(e.unicodeRegex?"u":"")+(r?"g":""))}class t{constructor(){this.matchIndexes={},this.regexes=[],this.matchAt=1,this.position=0}addRule(r,s){s.position=this.position++,this.matchIndexes[this.matchAt]=s,this.regexes.push([s,r]),this.matchAt+=ot(r)+1}compile(){this.regexes.length===0&&(this.exec=()=>null);let r=this.regexes.map(s=>s[1]);this.matcherRe=n(De(r,{joinWith:"|"}),!0),this.lastIndex=0}exec(r){this.matcherRe.lastIndex=this.lastIndex;let s=this.matcherRe.exec(r);if(!s)return null;let c=s.findIndex((E,b)=>b>0&&E!==void 0),g=this.matchIndexes[c];return s.splice(0,c),Object.assign(s,g)}}class o{constructor(){this.rules=[],this.multiRegexes=[],this.count=0,this.lastIndex=0,this.regexIndex=0}getMatcher(r){if(this.multiRegexes[r])return this.multiRegexes[r];let s=new t;return this.rules.slice(r).forEach(([c,g])=>s.addRule(c,g)),s.compile(),this.multiRegexes[r]=s,s}resumingScanAtSamePosition(){return this.regexIndex!==0}considerAll(){this.regexIndex=0}addRule(r,s){this.rules.push([r,s]),s.type==="begin"&&this.count++}exec(r){let s=this.getMatcher(this.regexIndex);s.lastIndex=this.lastIndex;let c=s.exec(r);if(this.resumingScanAtSamePosition()&&!(c&&c.index===this.lastIndex)){let g=this.getMatcher(0);g.lastIndex=this.lastIndex+1,c=g.exec(r)}return c&&(this.regexIndex+=c.position+1,this.regexIndex===this.count&&this.considerAll()),c}}function i(a){let r=new o;return a.contains.forEach(s=>r.addRule(s.begin,{rule:s,type:"begin"})),a.terminatorEnd&&r.addRule(a.terminatorEnd,{type:"end"}),a.illegal&&r.addRule(a.illegal,{type:"illegal"}),r}function l(a,r){let s=a;if(a.isCompiled)return s;[$n,Gn,eo,Kn].forEach(g=>g(a,r)),e.compilerExtensions.forEach(g=>g(a,r)),a.__beforeBegin=null,[Un,zn,qn].forEach(g=>g(a,r)),a.isCompiled=!0;let c=null;return typeof a.keywords=="object"&&a.keywords.$pattern&&(a.keywords=Object.assign({},a.keywords),c=a.keywords.$pattern,delete a.keywords.$pattern),c=c||/\w+/,a.keywords&&(a.keywords=lt(a.keywords,e.case_insensitive)),s.keywordPatternRe=n(c,!0),r&&(a.begin||(a.begin=/\B|\b/),s.beginRe=n(s.begin),!a.end&&!a.endsWithParent&&(a.end=/\B|\b/),a.end&&(s.endRe=n(s.end)),s.terminatorEnd=le(s.end)||"",a.endsWithParent&&r.terminatorEnd&&(s.terminatorEnd+=(a.end?"|":"")+r.terminatorEnd)),a.illegal&&(s.illegalRe=n(a.illegal)),a.contains||(a.contains=[]),a.contains=[].concat(...a.contains.map(function(g){return no(g==="self"?a:g)})),a.contains.forEach(function(g){l(g,s)}),a.starts&&l(a.starts,r),s.matcher=i(s),s}if(e.compilerExtensions||(e.compilerExtensions=[]),e.contains&&e.contains.includes("self"))throw new Error("ERR: contains `self` is not supported at the top-level of a language.  See documentation.");return e.classNameAliases=ee(e.classNameAliases||{}),l(e)}function dt(e){return e?e.endsWithParent||dt(e.starts):!1}function no(e){return e.variants&&!e.cachedVariants&&(e.cachedVariants=e.variants.map(function(n){return ee(e,{variants:null},n)})),e.cachedVariants?e.cachedVariants:dt(e)?ee(e,{starts:e.starts?ee(e.starts):null}):Object.isFrozen(e)?ee(e):e}var oo="11.11.1",Le=class extends Error{constructor(n,t){super(n),this.name="HTMLInjectionError",this.html=t}},Ae=tt,Je=ee,Qe=Symbol("nomatch"),ro=7,gt=function(e){let n=Object.create(null),t=Object.create(null),o=[],i=!0,l="Could not find the language '{}', did you forget to load/include a language module?",a={disableAutodetect:!0,name:"Plain text",contains:[]},r={ignoreUnescapedHTML:!1,throwUnescapedHTML:!1,noHighlightRe:/^(no-?highlight)$/i,languageDetectRe:/\blang(?:uage)?-([\w-]+)\b/i,classPrefix:"hljs-",cssSelector:"pre code",languages:null,__emitter:Re};function s(d){return r.noHighlightRe.test(d)}function c(d){let u=d.className+" ";u+=d.parentNode?d.parentNode.className:"";let p=r.languageDetectRe.exec(u);if(p){let N=O(p[1]);return N||(Xe(l.replace("{}",p[1])),Xe("Falling back to no-highlight mode for this block.",d)),N?p[1]:"no-highlight"}return u.split(/\s+/).find(N=>s(N)||O(N))}function g(d,u,p){let N="",R="";typeof u=="object"?(N=d,p=u.ignoreIllegals,R=u.language):(ae("10.7.0","highlight(lang, code, ...args) has been deprecated."),ae("10.7.0",`Please use highlight(code, options) instead.
https://github.com/highlightjs/highlight.js/issues/2277`),R=d,N=u),p===void 0&&(p=!0);let H={code:N,language:R};F("before:highlight",H);let q=H.result?H.result:E(H.language,H.code,p);return q.code=H.code,F("after:highlight",q),q}function E(d,u,p,N){let R=Object.create(null);function H(h,_){return h.keywords[_]}function q(){if(!x.keywords){z.addText(I);return}let h=0;x.keywordPatternRe.lastIndex=0;let _=x.keywordPatternRe.exec(I),k="";for(;_;){k+=I.substring(h,_.index);let B=J.case_insensitive?_[0].toLowerCase():_[0],K=H(x,B);if(K){let[Q,rn]=K;if(z.addText(k),k="",R[B]=(R[B]||0)+1,R[B]<=ro&&(ge+=rn),Q.startsWith("_"))k+=_[0];else{let an=J.classNameAliases[Q]||Q;X(_[0],an)}}else k+=_[0];h=x.keywordPatternRe.lastIndex,_=x.keywordPatternRe.exec(I)}k+=I.substring(h),z.addText(k)}function Y(){if(I==="")return;let h=null;if(typeof x.subLanguage=="string"){if(!n[x.subLanguage]){z.addText(I);return}h=E(x.subLanguage,I,!0,Ke[x.subLanguage]),Ke[x.subLanguage]=h._top}else h=m(I,x.subLanguage.length?x.subLanguage:null);x.relevance>0&&(ge+=h.relevance),z.__addSublanguage(h._emitter,h.language)}function V(){x.subLanguage!=null?Y():q(),I=""}function X(h,_){h!==""&&(z.startScope(_),z.addText(h),z.endScope())}function Ue(h,_){let k=1,B=_.length-1;for(;k<=B;){if(!h._emit[k]){k++;continue}let K=J.classNameAliases[h[k]]||h[k],Q=_[k];K?X(Q,K):(I=Q,q(),I=""),k++}}function ze(h,_){return h.scope&&typeof h.scope=="string"&&z.openNode(J.classNameAliases[h.scope]||h.scope),h.beginScope&&(h.beginScope._wrap?(X(I,J.classNameAliases[h.beginScope._wrap]||h.beginScope._wrap),I=""):h.beginScope._multi&&(Ue(h.beginScope,_),I="")),x=Object.create(h,{parent:{value:x}}),x}function Ge(h,_,k){let B=wn(h.endRe,k);if(B){if(h["on:end"]){let K=new he(h);h["on:end"](_,K),K.isMatchIgnored&&(B=!1)}if(B){for(;h.endsParent&&h.parent;)h=h.parent;return h}}if(h.endsWithParent)return Ge(h.parent,_,k)}function Qt(h){return x.matcher.regexIndex===0?(I+=h[0],1):(ke=!0,0)}function en(h){let _=h[0],k=h.rule,B=new he(k),K=[k.__beforeBegin,k["on:begin"]];for(let Q of K)if(Q&&(Q(h,B),B.isMatchIgnored))return Qt(_);return k.skip?I+=_:(k.excludeBegin&&(I+=_),V(),!k.returnBegin&&!k.excludeBegin&&(I=_)),ze(k,h),k.returnBegin?0:_.length}function tn(h){let _=h[0],k=u.substring(h.index),B=Ge(x,h,k);if(!B)return Qe;let K=x;x.endScope&&x.endScope._wrap?(V(),X(_,x.endScope._wrap)):x.endScope&&x.endScope._multi?(V(),Ue(x.endScope,h)):K.skip?I+=_:(K.returnEnd||K.excludeEnd||(I+=_),V(),K.excludeEnd&&(I=_));do x.scope&&z.closeNode(),!x.skip&&!x.subLanguage&&(ge+=x.relevance),x=x.parent;while(x!==B.parent);return B.starts&&ze(B.starts,h),K.returnEnd?0:_.length}function nn(){let h=[];for(let _=x;_!==J;_=_.parent)_.scope&&h.unshift(_.scope);h.forEach(_=>z.openNode(_))}let de={};function qe(h,_){let k=_&&_[0];if(I+=h,k==null)return V(),0;if(de.type==="begin"&&_.type==="end"&&de.index===_.index&&k===""){if(I+=u.slice(_.index,_.index+1),!i){let B=new Error(`0 width match regex (${d})`);throw B.languageName=d,B.badRule=de.rule,B}return 1}if(de=_,_.type==="begin")return en(_);if(_.type==="illegal"&&!p){let B=new Error('Illegal lexeme "'+k+'" for mode "'+(x.scope||"<unnamed>")+'"');throw B.mode=x,B}else if(_.type==="end"){let B=tn(_);if(B!==Qe)return B}if(_.type==="illegal"&&k==="")return I+=`
`,1;if(Ce>1e5&&Ce>_.index*3)throw new Error("potential infinite loop, way more iterations than matches");return I+=k,k.length}let J=O(d);if(!J)throw ne(l.replace("{}",d)),new Error('Unknown language: "'+d+'"');let on=to(J),Ne="",x=N||on,Ke={},z=new r.__emitter(r);nn();let I="",ge=0,te=0,Ce=0,ke=!1;try{if(J.__emitTokens)J.__emitTokens(u,z);else{for(x.matcher.considerAll();;){Ce++,ke?ke=!1:x.matcher.considerAll(),x.matcher.lastIndex=te;let h=x.matcher.exec(u);if(!h)break;let _=u.substring(te,h.index),k=qe(_,h);te=h.index+k}qe(u.substring(te))}return z.finalize(),Ne=z.toHTML(),{language:d,value:Ne,relevance:ge,illegal:!1,_emitter:z,_top:x}}catch(h){if(h.message&&h.message.includes("Illegal"))return{language:d,value:Ae(u),illegal:!0,relevance:0,_illegalBy:{message:h.message,index:te,context:u.slice(te-100,te+100),mode:h.mode,resultSoFar:Ne},_emitter:z};if(i)return{language:d,value:Ae(u),illegal:!1,relevance:0,errorRaised:h,_emitter:z,_top:x};throw h}}function b(d){let u={value:Ae(d),illegal:!1,relevance:0,_top:a,_emitter:new r.__emitter(r)};return u._emitter.addText(d),u}function m(d,u){u=u||r.languages||Object.keys(n);let p=b(d),N=u.filter(O).filter($).map(V=>E(V,d,!1));N.unshift(p);let R=N.sort((V,X)=>{if(V.relevance!==X.relevance)return X.relevance-V.relevance;if(V.language&&X.language){if(O(V.language).supersetOf===X.language)return 1;if(O(X.language).supersetOf===V.language)return-1}return 0}),[H,q]=R,Y=H;return Y.secondBest=q,Y}function v(d,u,p){let N=u&&t[u]||p;d.classList.add("hljs"),d.classList.add(`language-${N}`)}function S(d){let u=null,p=c(d);if(s(p))return;if(F("before:highlightElement",{el:d,language:p}),d.dataset.highlighted){console.log("Element previously highlighted. To highlight again, first unset `dataset.highlighted`.",d);return}if(d.children.length>0&&(r.ignoreUnescapedHTML||(console.warn("One of your code blocks includes unescaped HTML. This is a potentially serious security risk."),console.warn("https://github.com/highlightjs/highlight.js/wiki/security"),console.warn("The element with unescaped HTML:"),console.warn(d)),r.throwUnescapedHTML))throw new Le("One of your code blocks includes unescaped HTML.",d.innerHTML);u=d;let N=u.textContent,R=p?g(N,{language:p,ignoreIllegals:!0}):m(N);d.innerHTML=R.value,d.dataset.highlighted="yes",v(d,p,R.language),d.result={language:R.language,re:R.relevance,relevance:R.relevance},R.secondBest&&(d.secondBest={language:R.secondBest.language,relevance:R.secondBest.relevance}),F("after:highlightElement",{el:d,result:R,text:N})}function T(d){r=Je(r,d)}let C=()=>{M(),ae("10.6.0","initHighlighting() deprecated.  Use highlightAll() now.")};function A(){M(),ae("10.6.0","initHighlightingOnLoad() deprecated.  Use highlightAll() now.")}let j=!1;function M(){function d(){M()}if(document.readyState==="loading"){j||window.addEventListener("DOMContentLoaded",d,!1),j=!0;return}document.querySelectorAll(r.cssSelector).forEach(S)}function w(d,u){let p=null;try{p=u(e)}catch(N){if(ne("Language definition for '{}' could not be registered.".replace("{}",d)),i)ne(N);else throw N;p=a}p.name||(p.name=d),n[d]=p,p.rawDefinition=u.bind(null,e),p.aliases&&L(p.aliases,{languageName:d})}function y(d){delete n[d];for(let u of Object.keys(t))t[u]===d&&delete t[u]}function D(){return Object.keys(n)}function O(d){return d=(d||"").toLowerCase(),n[d]||n[t[d]]}function L(d,{languageName:u}){typeof d=="string"&&(d=[d]),d.forEach(p=>{t[p.toLowerCase()]=u})}function $(d){let u=O(d);return u&&!u.disableAutodetect}function U(d){d["before:highlightBlock"]&&!d["before:highlightElement"]&&(d["before:highlightElement"]=u=>{d["before:highlightBlock"](Object.assign({block:u.el},u))}),d["after:highlightBlock"]&&!d["after:highlightElement"]&&(d["after:highlightElement"]=u=>{d["after:highlightBlock"](Object.assign({block:u.el},u))})}function G(d){U(d),o.push(d)}function W(d){let u=o.indexOf(d);u!==-1&&o.splice(u,1)}function F(d,u){let p=d;o.forEach(function(N){N[p]&&N[p](u)})}function Z(d){return ae("10.7.0","highlightBlock will be removed entirely in v12.0"),ae("10.7.0","Please use highlightElement now."),S(d)}Object.assign(e,{highlight:g,highlightAuto:m,highlightAll:M,highlightElement:S,highlightBlock:Z,configure:T,initHighlighting:C,initHighlightingOnLoad:A,registerLanguage:w,unregisterLanguage:y,listLanguages:D,getLanguage:O,registerAliases:L,autoDetection:$,inherit:Je,addPlugin:G,removePlugin:W}),e.debugMode=function(){i=!1},e.safeMode=function(){i=!0},e.versionString=oo,e.regex={concat:oe,lookahead:nt,either:Be,optional:_n,anyNumberOfTimes:En};for(let d in pe)typeof pe[d]=="object"&&et(pe[d]);return Object.assign(e,pe),e},ie=gt({});ie.newInstance=()=>gt({});ut.exports=ie;ie.HighlightJS=ie;ie.default=ie});var lr={};pn(lr,{default:()=>ve});module.exports=mn(lr);var f=require("obsidian");var ht=hn(pt(),1);var P=ht.default;var mt=`pre code.hljs {
  display: block;
  overflow-x: auto;
  padding: 1em
}
code.hljs {
  padding: 3px 5px
}
/*!
  Theme: GitHub
  Description: Light theme as seen on github.com
  Author: github.com
  Maintainer: @Hirse
  Updated: 2021-05-15

  Outdated base version: https://github.com/primer/github-syntax-light
  Current colors taken from GitHub's CSS
*/
.hljs {
  color: #24292e;
  background: #ffffff
}
.hljs-doctag,
.hljs-keyword,
.hljs-meta .hljs-keyword,
.hljs-template-tag,
.hljs-template-variable,
.hljs-type,
.hljs-variable.language_ {
  /* prettylights-syntax-keyword */
  color: #d73a49
}
.hljs-title,
.hljs-title.class_,
.hljs-title.class_.inherited__,
.hljs-title.function_ {
  /* prettylights-syntax-entity */
  color: #6f42c1
}
.hljs-attr,
.hljs-attribute,
.hljs-literal,
.hljs-meta,
.hljs-number,
.hljs-operator,
.hljs-variable,
.hljs-selector-attr,
.hljs-selector-class,
.hljs-selector-id {
  /* prettylights-syntax-constant */
  color: #005cc5
}
.hljs-regexp,
.hljs-string,
.hljs-meta .hljs-string {
  /* prettylights-syntax-string */
  color: #032f62
}
.hljs-built_in,
.hljs-symbol {
  /* prettylights-syntax-variable */
  color: #e36209
}
.hljs-comment,
.hljs-code,
.hljs-formula {
  /* prettylights-syntax-comment */
  color: #6a737d
}
.hljs-name,
.hljs-quote,
.hljs-selector-tag,
.hljs-selector-pseudo {
  /* prettylights-syntax-entity-tag */
  color: #22863a
}
.hljs-subst {
  /* prettylights-syntax-storage-modifier-import */
  color: #24292e
}
.hljs-section {
  /* prettylights-syntax-markup-heading */
  color: #005cc5;
  font-weight: bold
}
.hljs-bullet {
  /* prettylights-syntax-markup-list */
  color: #735c0f
}
.hljs-emphasis {
  /* prettylights-syntax-markup-italic */
  color: #24292e;
  font-style: italic
}
.hljs-strong {
  /* prettylights-syntax-markup-bold */
  color: #24292e;
  font-weight: bold
}
.hljs-addition {
  /* prettylights-syntax-markup-inserted */
  color: #22863a;
  background-color: #f0fff4
}
.hljs-deletion {
  /* prettylights-syntax-markup-deleted */
  color: #b31d28;
  background-color: #ffeef0
}
.hljs-char.escape_,
.hljs-link,
.hljs-params,
.hljs-property,
.hljs-punctuation,
.hljs-tag {
  /* purposely ignored */
  
}`;var ft=`pre code.hljs {
  display: block;
  overflow-x: auto;
  padding: 1em
}
code.hljs {
  padding: 3px 5px
}
/*!
  Theme: GitHub Dark
  Description: Dark theme as seen on github.com
  Author: github.com
  Maintainer: @Hirse
  Updated: 2021-05-15

  Outdated base version: https://github.com/primer/github-syntax-dark
  Current colors taken from GitHub's CSS
*/
.hljs {
  color: #c9d1d9;
  background: #0d1117
}
.hljs-doctag,
.hljs-keyword,
.hljs-meta .hljs-keyword,
.hljs-template-tag,
.hljs-template-variable,
.hljs-type,
.hljs-variable.language_ {
  /* prettylights-syntax-keyword */
  color: #ff7b72
}
.hljs-title,
.hljs-title.class_,
.hljs-title.class_.inherited__,
.hljs-title.function_ {
  /* prettylights-syntax-entity */
  color: #d2a8ff
}
.hljs-attr,
.hljs-attribute,
.hljs-literal,
.hljs-meta,
.hljs-number,
.hljs-operator,
.hljs-variable,
.hljs-selector-attr,
.hljs-selector-class,
.hljs-selector-id {
  /* prettylights-syntax-constant */
  color: #79c0ff
}
.hljs-regexp,
.hljs-string,
.hljs-meta .hljs-string {
  /* prettylights-syntax-string */
  color: #a5d6ff
}
.hljs-built_in,
.hljs-symbol {
  /* prettylights-syntax-variable */
  color: #ffa657
}
.hljs-comment,
.hljs-code,
.hljs-formula {
  /* prettylights-syntax-comment */
  color: #8b949e
}
.hljs-name,
.hljs-quote,
.hljs-selector-tag,
.hljs-selector-pseudo {
  /* prettylights-syntax-entity-tag */
  color: #7ee787
}
.hljs-subst {
  /* prettylights-syntax-storage-modifier-import */
  color: #c9d1d9
}
.hljs-section {
  /* prettylights-syntax-markup-heading */
  color: #1f6feb;
  font-weight: bold
}
.hljs-bullet {
  /* prettylights-syntax-markup-list */
  color: #f2cc60
}
.hljs-emphasis {
  /* prettylights-syntax-markup-italic */
  color: #c9d1d9;
  font-style: italic
}
.hljs-strong {
  /* prettylights-syntax-markup-bold */
  color: #c9d1d9;
  font-weight: bold
}
.hljs-addition {
  /* prettylights-syntax-markup-inserted */
  color: #aff5b4;
  background-color: #033a16
}
.hljs-deletion {
  /* prettylights-syntax-markup-deleted */
  color: #ffdcd7;
  background-color: #67060c
}
.hljs-char.escape_,
.hljs-link,
.hljs-params,
.hljs-property,
.hljs-punctuation,
.hljs-tag {
  /* purposely ignored */
  
}`;var bt=`pre code.hljs {
  display: block;
  overflow-x: auto;
  padding: 1em
}
code.hljs {
  padding: 3px 5px
}
/*

Atom One Dark by Daniel Gamage
Original One Dark Syntax theme from https://github.com/atom/one-dark-syntax

base:    #282c34
mono-1:  #abb2bf
mono-2:  #818896
mono-3:  #5c6370
hue-1:   #56b6c2
hue-2:   #61aeee
hue-3:   #c678dd
hue-4:   #98c379
hue-5:   #e06c75
hue-5-2: #be5046
hue-6:   #d19a66
hue-6-2: #e6c07b

*/
.hljs {
  color: #abb2bf;
  background: #282c34
}
.hljs-comment,
.hljs-quote {
  color: #5c6370;
  font-style: italic
}
.hljs-doctag,
.hljs-keyword,
.hljs-formula {
  color: #c678dd
}
.hljs-section,
.hljs-name,
.hljs-selector-tag,
.hljs-deletion,
.hljs-subst {
  color: #e06c75
}
.hljs-literal {
  color: #56b6c2
}
.hljs-string,
.hljs-regexp,
.hljs-addition,
.hljs-attribute,
.hljs-meta .hljs-string {
  color: #98c379
}
.hljs-attr,
.hljs-variable,
.hljs-template-variable,
.hljs-type,
.hljs-selector-class,
.hljs-selector-attr,
.hljs-selector-pseudo,
.hljs-number {
  color: #d19a66
}
.hljs-symbol,
.hljs-bullet,
.hljs-link,
.hljs-meta,
.hljs-selector-id,
.hljs-title {
  color: #61aeee
}
.hljs-built_in,
.hljs-title.class_,
.hljs-class .hljs-title {
  color: #e6c07b
}
.hljs-emphasis {
  font-style: italic
}
.hljs-strong {
  font-weight: bold
}
.hljs-link {
  text-decoration: underline
}`;var Et=`pre code.hljs {
  display: block;
  overflow-x: auto;
  padding: 1em
}
code.hljs {
  padding: 3px 5px
}
/*

Atom One Light by Daniel Gamage
Original One Light Syntax theme from https://github.com/atom/one-light-syntax

base:    #fafafa
mono-1:  #383a42
mono-2:  #686b77
mono-3:  #a0a1a7
hue-1:   #0184bb
hue-2:   #4078f2
hue-3:   #a626a4
hue-4:   #50a14f
hue-5:   #e45649
hue-5-2: #c91243
hue-6:   #986801
hue-6-2: #c18401

*/
.hljs {
  color: #383a42;
  background: #fafafa
}
.hljs-comment,
.hljs-quote {
  color: #a0a1a7;
  font-style: italic
}
.hljs-doctag,
.hljs-keyword,
.hljs-formula {
  color: #a626a4
}
.hljs-section,
.hljs-name,
.hljs-selector-tag,
.hljs-deletion,
.hljs-subst {
  color: #e45649
}
.hljs-literal {
  color: #0184bb
}
.hljs-string,
.hljs-regexp,
.hljs-addition,
.hljs-attribute,
.hljs-meta .hljs-string {
  color: #50a14f
}
.hljs-attr,
.hljs-variable,
.hljs-template-variable,
.hljs-type,
.hljs-selector-class,
.hljs-selector-attr,
.hljs-selector-pseudo,
.hljs-number {
  color: #986801
}
.hljs-symbol,
.hljs-bullet,
.hljs-link,
.hljs-meta,
.hljs-selector-id,
.hljs-title {
  color: #4078f2
}
.hljs-built_in,
.hljs-title.class_,
.hljs-class .hljs-title {
  color: #c18401
}
.hljs-emphasis {
  font-style: italic
}
.hljs-strong {
  font-weight: bold
}
.hljs-link {
  text-decoration: underline
}`;var _t=`pre code.hljs {
  display: block;
  overflow-x: auto;
  padding: 1em
}
code.hljs {
  padding: 3px 5px
}
/*!
  Theme: Tokyo-night-Dark
  origin: https://github.com/enkia/tokyo-night-vscode-theme
  Description: Original highlight.js style
  Author: (c) Henri Vandersleyen <hvandersleyen@gmail.com>
  License: see project LICENSE
  Touched: 2022
*/
/*  Comment */
.hljs-meta,
.hljs-comment {
  color: #565f89
}
/* Red */
/*INFO: This keyword, HTML elements, Regex group symbol, CSS units, Terminal Red */
.hljs-tag,
.hljs-doctag,
.hljs-selector-id,
.hljs-selector-class,
.hljs-regexp,
.hljs-template-tag,
.hljs-selector-pseudo,
.hljs-selector-attr,
.hljs-variable.language_,
.hljs-deletion {
  color: #f7768e
}
/*Orange */
/*INFO: Number and Boolean constants, Language support constants */
.hljs-variable,
.hljs-template-variable,
.hljs-number,
.hljs-literal,
.hljs-type,
.hljs-params,
.hljs-link {
  color: #ff9e64
}
/*  Yellow */
/* INFO:  	Function parameters, Regex character sets, Terminal Yellow */
.hljs-built_in,
.hljs-attribute {
  color: #e0af68
}
/* cyan */
/* INFO: Language support functions, CSS HTML elements */
.hljs-selector-tag {
  color: #2ac3de
}
/* light blue */
/* INFO: Object properties, Regex quantifiers and flags, Markdown headings, Terminal Cyan, Markdown code, Import/export keywords */
.hljs-keyword,
.hljs-title.function_,
.hljs-title,
.hljs-title.class_,
.hljs-title.class_.inherited__,
.hljs-subst,
.hljs-property {
  color: #7dcfff
}
/*Green*/
/* INFO: Object literal keys, Markdown links, Terminal Green */
.hljs-selector-tag {
  color: #73daca
}
/*Green(er) */
/* INFO: Strings, CSS class names */
.hljs-quote,
.hljs-string,
.hljs-symbol,
.hljs-bullet,
.hljs-addition {
  color: #9ece6a
}
/* Blue */
/* INFO:  	Function names, CSS property names, Terminal Blue */
.hljs-code,
.hljs-formula,
.hljs-section {
  color: #7aa2f7
}
/* Magenta */
/*INFO: Control Keywords, Storage Types, Regex symbols and operators, HTML Attributes, Terminal Magenta */
.hljs-name,
.hljs-keyword,
.hljs-operator,
.hljs-keyword,
.hljs-char.escape_,
.hljs-attr {
  color: #bb9af7
}
/* white*/
/* INFO: Variables, Class names, Terminal White */
.hljs-punctuation {
  color: #c0caf5
}
.hljs {
  background: #1a1b26;
  color: #9aa5ce
}
.hljs-emphasis {
  font-style: italic
}
.hljs-strong {
  font-weight: bold
}`;var yt=`pre code.hljs {
  display: block;
  overflow-x: auto;
  padding: 1em
}
code.hljs {
  padding: 3px 5px
}
/*!
  Theme: Tokyo-night-light
  origin: https://github.com/enkia/tokyo-night-vscode-theme
  Description: Original highlight.js style
  Author: (c) Henri Vandersleyen <hvandersleyen@gmail.com>
  License: see project LICENSE
  Touched: 2022
*/
/*  Comment */
.hljs-meta,
.hljs-comment {
  color: #9699a3
}
/* Red */
/*INFO: This keyword, HTML elements, Regex group symbol, CSS units, Terminal Red */
.hljs-tag,
.hljs-doctag,
.hljs-selector-id,
.hljs-selector-class,
.hljs-regexp,
.hljs-template-tag,
.hljs-selector-pseudo,
.hljs-selector-attr,
.hljs-variable.language_,
.hljs-deletion {
  color: #8c4351
}
/*Orange */
/*INFO: Number and Boolean constants, Language support constants */
.hljs-variable,
.hljs-template-variable,
.hljs-number,
.hljs-literal,
.hljs-type,
.hljs-params,
.hljs-link {
  color: #965027
}
/*  Yellow */
/* INFO:  	Function parameters, Regex character sets, Terminal Yellow */
.hljs-built_in,
.hljs-attribute {
  color: #8f5e15
}
/* cyan */
/* INFO: Language support functions, CSS HTML elements */
.hljs-selector-tag {
  color: #166775
}
/* light blue */
/* INFO: Object properties, Regex quantifiers and flags, Markdown headings, Terminal Cyan, Markdown code, Import/export keywords */
.hljs-keyword,
.hljs-title.function_,
.hljs-title,
.hljs-title.class_,
.hljs-title.class_.inherited__,
.hljs-subst,
.hljs-property {
  color: #0f4b6e
}
/*Green*/
/* INFO: Object literal keys, Markdown links, Terminal Green */
.hljs-selector-tag {
  color: #33635c
}
/*Green(er) */
/* INFO: Strings, CSS class names */
.hljs-quote,
.hljs-string,
.hljs-symbol,
.hljs-bullet,
.hljs-addition {
  color: #485e30
}
/* Blue */
/* INFO:  	Function names, CSS property names, Terminal Blue */
.hljs-code,
.hljs-formula,
.hljs-section {
  color: #34548a
}
/* Magenta */
/*INFO: Control Keywords, Storage Types, Regex symbols and operators, HTML Attributes, Terminal Magenta */
.hljs-name,
.hljs-keyword,
.hljs-operator,
.hljs-keyword,
.hljs-char.escape_,
.hljs-attr {
  color: #5a4a78
}
/* white*/
/* INFO: Variables, Class names, Terminal White */
.hljs-punctuation {
  color: #343b58
}
.hljs {
  background: #d5d6db;
  color: #565a6e
}
.hljs-emphasis {
  font-style: italic
}
.hljs-strong {
  font-weight: bold
}`;var wt=`pre code.hljs {
  display: block;
  overflow-x: auto;
  padding: 1em
}
code.hljs {
  padding: 3px 5px
}
/*
Monokai style - ported by Luigi Maselli - http://grigio.org
*/
.hljs {
  background: #272822;
  color: #ddd
}
.hljs-tag,
.hljs-keyword,
.hljs-selector-tag,
.hljs-literal,
.hljs-strong,
.hljs-number,
.hljs-name {
  color: #f92672
}
.hljs-code {
  color: #66d9ef
}
.hljs-attribute,
.hljs-attr,
.hljs-symbol,
.hljs-regexp,
.hljs-link {
  color: #bf79db
}
.hljs-string,
.hljs-bullet,
.hljs-subst,
.hljs-title,
.hljs-section,
.hljs-emphasis,
.hljs-type,
.hljs-built_in,
.hljs-selector-attr,
.hljs-selector-pseudo,
.hljs-addition,
.hljs-variable,
.hljs-template-tag,
.hljs-template-variable {
  color: #a6e22e
}
.hljs-title.class_,
.hljs-class .hljs-title {
  color: white
}
.hljs-comment,
.hljs-quote,
.hljs-deletion,
.hljs-meta {
  color: #75715e
}
.hljs-keyword,
.hljs-selector-tag,
.hljs-literal,
.hljs-doctag,
.hljs-title,
.hljs-section,
.hljs-type,
.hljs-selector-id {
  font-weight: bold
}`;var St=`pre code.hljs {
  display: block;
  overflow-x: auto;
  padding: 1em
}
code.hljs {
  padding: 3px 5px
}
/*
 * Copyright (c) 2017-present Arctic Ice Studio <development@arcticicestudio.com>
 * Copyright (c) 2017-present Sven Greb <development@svengreb.de>
 *
 * Project:    Nord highlight.js
 * Version:    0.1.0
 * Repository: https://github.com/arcticicestudio/nord-highlightjs
 * License:    MIT
 * References:
 *   https://github.com/arcticicestudio/nord
 */
/*

Polar Night

#2E3440
#3B4252
#434C5E
#4C566A

Snow Storm

#D8DEE9
#E5E9F0
#ECEFF4

Frost

#8FBCBB
#88C0D0
#81A1C1
#5E81AC

Aurora

#BF616A
#D08770
#EBCB8B
#A3BE8C
#B48EAD

*/
.hljs {
  background: #2E3440
}
.hljs,
.hljs-subst {
  color: #D8DEE9
}
.hljs-selector-tag {
  color: #81A1C1
}
.hljs-selector-id {
  color: #8FBCBB;
  font-weight: bold
}
.hljs-selector-class {
  color: #8FBCBB
}
.hljs-selector-attr {
  color: #8FBCBB
}
.hljs-property {
  color: #88C0D0
}
.hljs-selector-pseudo {
  color: #88C0D0
}
.hljs-addition {
  background-color: rgba(163, 190, 140, 0.5)
}
.hljs-deletion {
  background-color: rgba(191, 97, 106, 0.5)
}
.hljs-built_in,
.hljs-type {
  color: #8FBCBB
}
.hljs-class {
  color: #8FBCBB
}
.hljs-function {
  color: #88C0D0
}
.hljs-title.hljs-function,
.hljs-function > .hljs-title {
  color: #88C0D0
}
.hljs-keyword,
.hljs-literal,
.hljs-symbol {
  color: #81A1C1
}
.hljs-number {
  color: #B48EAD
}
.hljs-regexp {
  color: #EBCB8B
}
.hljs-string {
  color: #A3BE8C
}
.hljs-title {
  color: #8FBCBB
}
.hljs-params {
  color: #D8DEE9
}
.hljs-bullet {
  color: #81A1C1
}
.hljs-code {
  color: #8FBCBB
}
.hljs-emphasis {
  font-style: italic
}
.hljs-formula {
  color: #8FBCBB
}
.hljs-strong {
  font-weight: bold
}
.hljs-link:hover {
  text-decoration: underline
}
.hljs-quote {
  color: #4C566A
}
.hljs-comment {
  color: #4C566A
}
.hljs-doctag {
  color: #8FBCBB
}
.hljs-meta,
.hljs-meta .hljs-keyword {
  color: #5E81AC
}
.hljs-meta .hljs-string {
  color: #A3BE8C
}
.hljs-attr {
  color: #8FBCBB
}
.hljs-attribute {
  color: #D8DEE9
}
.hljs-name {
  color: #81A1C1
}
.hljs-section {
  color: #88C0D0
}
.hljs-tag {
  color: #81A1C1
}
.hljs-variable {
  color: #D8DEE9
}
.hljs-template-variable {
  color: #D8DEE9
}
.hljs-template-tag {
  color: #5E81AC
}
/* per language customizations */
.language-abnf .hljs-attribute {
  color: #88C0D0
}
.language-abnf .hljs-symbol {
  color: #EBCB8B
}
.language-apache .hljs-attribute {
  color: #88C0D0
}
.language-apache .hljs-section {
  color: #81A1C1
}
.language-arduino .hljs-built_in {
  color: #88C0D0
}
.language-aspectj .hljs-meta {
  color: #D08770
}
.language-aspectj > .hljs-title {
  color: #88C0D0
}
.language-bnf .hljs-attribute {
  color: #8FBCBB
}
.language-clojure .hljs-name {
  color: #88C0D0
}
.language-clojure .hljs-symbol {
  color: #EBCB8B
}
.language-coq .hljs-built_in {
  color: #88C0D0
}
.language-cpp .hljs-meta .hljs-string {
  color: #8FBCBB
}
.language-css .hljs-built_in {
  color: #88C0D0
}
.language-css .hljs-keyword {
  color: #D08770
}
.language-diff .hljs-meta {
  color: #8FBCBB
}
.language-ebnf .hljs-attribute {
  color: #8FBCBB
}
.language-glsl .hljs-built_in {
  color: #88C0D0
}
.language-groovy .hljs-meta:not(:first-child) {
  color: #D08770
}
.language-haxe .hljs-meta {
  color: #D08770
}
.language-java .hljs-meta {
  color: #D08770
}
.language-ldif .hljs-attribute {
  color: #8FBCBB
}
.language-lisp .hljs-name {
  color: #88C0D0
}
.language-lua .hljs-built_in {
  color: #88C0D0
}
.language-moonscript .hljs-built_in {
  color: #88C0D0
}
.language-nginx .hljs-attribute {
  color: #88C0D0
}
.language-nginx .hljs-section {
  color: #5E81AC
}
.language-pf .hljs-built_in {
  color: #88C0D0
}
.language-processing .hljs-built_in {
  color: #88C0D0
}
.language-scss .hljs-keyword {
  color: #81A1C1
}
.language-stylus .hljs-keyword {
  color: #81A1C1
}
.language-swift .hljs-meta {
  color: #D08770
}
.language-vim .hljs-built_in {
  color: #88C0D0;
  font-style: italic
}
.language-yaml .hljs-meta {
  color: #D08770
}`;var Tt=`/*
 * Catppuccin Macchiato \u2014 highlight.js theme
 * Vendored from @catppuccin/highlightjs (MIT), colours resolved to the
 * Macchiato palette. Not shipped with highlight.js core, so kept as a local
 * stylesheet imported via esbuild's text loader (see hljs-themes.ts).
 * Base background: #24273a
 */
code.hljs{color:#cad3f5;background:#24273a}
code .hljs-keyword{color:#c6a0f6}
code .hljs-built_in{color:#ed8796}
code .hljs-type{color:#eed49f}
code .hljs-literal{color:#f5a97f}
code .hljs-number{color:#f5a97f}
code .hljs-operator{color:#91d7e3}
code .hljs-punctuation{color:#b8c0e0}
code .hljs-property{color:#8bd5ca}
code .hljs-regexp{color:#f5bde6}
code .hljs-string{color:#a6da95}
code .hljs-char.escape_{color:#a6da95}
code .hljs-subst{color:#a5adcb}
code .hljs-symbol{color:#f0c6c6}
code .hljs-variable{color:#c6a0f6}
code .hljs-variable.language_{color:#c6a0f6}
code .hljs-variable.constant_{color:#f5a97f}
code .hljs-title{color:#8aadf4}
code .hljs-title.class_{color:#eed49f}
code .hljs-title.function_{color:#8aadf4}
code .hljs-params{color:#cad3f5}
code .hljs-comment{color:#939ab7}
code .hljs-doctag{color:#ed8796}
code .hljs-meta{color:#f5a97f}
code .hljs-section{color:#8aadf4}
code .hljs-tag{color:#8bd5ca}
code .hljs-name{color:#c6a0f6}
code .hljs-attr{color:#8aadf4}
code .hljs-attribute{color:#a6da95}
code .hljs-bullet{color:#8bd5ca}
code .hljs-code{color:#a6da95}
code .hljs-emphasis{color:#ed8796;font-style:italic}
code .hljs-strong{color:#ed8796;font-weight:bold}
code .hljs-formula{color:#8bd5ca}
code .hljs-link{color:#7dc4e4;font-style:italic}
code .hljs-quote{color:#a6da95;font-style:italic}
code .hljs-selector-tag{color:#eed49f}
code .hljs-selector-id{color:#8aadf4}
code .hljs-selector-class{color:#8bd5ca}
code .hljs-selector-attr{color:#c6a0f6}
code .hljs-selector-pseudo{color:#8bd5ca}
code .hljs-template-tag{color:#f0c6c6}
code .hljs-template-variable{color:#f0c6c6}
code .hljs-addition{color:#a6da95;background:rgba(166,218,149,.15)}
code .hljs-deletion{color:#ed8796;background:rgba(237,135,150,.15)}
`;var be={github:{label:"GitHub",css:mt,bg:"#f3f4f6"},"github-dark":{label:"GitHub Dark",css:ft,bg:"#0d1117"},"atom-one-light":{label:"Atom One Light",css:Et,bg:"#fafafa"},"atom-one-dark":{label:"Atom One Dark",css:bt,bg:"#282c34"},"tokyo-night-light":{label:"Tokyo Night Light",css:yt,bg:"#d5d6db"},"tokyo-night-dark":{label:"Tokyo Night",css:_t,bg:"#1a1b26"},monokai:{label:"Monokai",css:wt,bg:"#272822"},nord:{label:"Nord",css:St,bg:"#2e3440"},"catppuccin-macchiato":{label:"Catppuccin Macchiato",css:Tt,bg:"#24273a"}};function vt(e){let n=e.regex,t={},o={begin:/\$\{/,end:/\}/,contains:["self",{begin:/:-/,contains:[t]}]};Object.assign(t,{className:"variable",variants:[{begin:n.concat(/\$[\w\d#@][\w\d_]*/,"(?![\\w\\d])(?![$])")},o]});let i={className:"subst",begin:/\$\(/,end:/\)/,contains:[e.BACKSLASH_ESCAPE]},l=e.inherit(e.COMMENT(),{match:[/(^|\s)/,/#.*$/],scope:{2:"comment"}}),a={begin:/<<-?\s*(?=\w+)/,starts:{contains:[e.END_SAME_AS_BEGIN({begin:/(\w+)/,end:/(\w+)/,className:"string"})]}},r={className:"string",begin:/"/,end:/"/,contains:[e.BACKSLASH_ESCAPE,t,i]};i.contains.push(r);let s={match:/\\"/},c={className:"string",begin:/'/,end:/'/},g={match:/\\'/},E={begin:/\$?\(\(/,end:/\)\)/,contains:[{begin:/\d+#[0-9a-f]+/,className:"number"},e.NUMBER_MODE,t]},b=["fish","bash","zsh","sh","csh","ksh","tcsh","dash","scsh"],m=e.SHEBANG({binary:`(${b.join("|")})`,relevance:10}),v={className:"function",begin:/\w[\w\d_]*\s*\(\s*\)\s*\{/,returnBegin:!0,contains:[e.inherit(e.TITLE_MODE,{begin:/\w[\w\d_]*/})],relevance:0},S=["if","then","else","elif","fi","time","for","while","until","in","do","done","case","esac","coproc","function","select"],T=["true","false"],C={match:/(\/[a-z._-]+)+/},A=["break","cd","continue","eval","exec","exit","export","getopts","hash","pwd","readonly","return","shift","test","times","trap","umask","unset"],j=["alias","bind","builtin","caller","command","declare","echo","enable","help","let","local","logout","mapfile","printf","read","readarray","source","sudo","type","typeset","ulimit","unalias"],M=["autoload","bg","bindkey","bye","cap","chdir","clone","comparguments","compcall","compctl","compdescribe","compfiles","compgroups","compquote","comptags","comptry","compvalues","dirs","disable","disown","echotc","echoti","emulate","fc","fg","float","functions","getcap","getln","history","integer","jobs","kill","limit","log","noglob","popd","print","pushd","pushln","rehash","sched","setcap","setopt","stat","suspend","ttyctl","unfunction","unhash","unlimit","unsetopt","vared","wait","whence","where","which","zcompile","zformat","zftp","zle","zmodload","zparseopts","zprof","zpty","zregexparse","zsocket","zstyle","ztcp"],w=["chcon","chgrp","chown","chmod","cp","dd","df","dir","dircolors","ln","ls","mkdir","mkfifo","mknod","mktemp","mv","realpath","rm","rmdir","shred","sync","touch","truncate","vdir","b2sum","base32","base64","cat","cksum","comm","csplit","cut","expand","fmt","fold","head","join","md5sum","nl","numfmt","od","paste","ptx","pr","sha1sum","sha224sum","sha256sum","sha384sum","sha512sum","shuf","sort","split","sum","tac","tail","tr","tsort","unexpand","uniq","wc","arch","basename","chroot","date","dirname","du","echo","env","expr","factor","groups","hostid","id","link","logname","nice","nohup","nproc","pathchk","pinky","printenv","printf","pwd","readlink","runcon","seq","sleep","stat","stdbuf","stty","tee","test","timeout","tty","uname","unlink","uptime","users","who","whoami","yes"];return{name:"Bash",aliases:["sh","zsh"],keywords:{$pattern:/\b[a-z][a-z0-9._-]+\b/,keyword:S,literal:T,built_in:[...A,...j,"set","shopt",...M,...w]},contains:[m,e.SHEBANG(),v,E,l,a,C,r,s,c,g,t]}}function xt(e){let n=e.regex,t=e.COMMENT("//","$",{contains:[{begin:/\\\n/}]}),o="decltype\\(auto\\)",i="[a-zA-Z_]\\w*::",a="("+o+"|"+n.optional(i)+"[a-zA-Z_]\\w*"+n.optional("<[^<>]+>")+")",r={className:"type",variants:[{begin:"\\b[a-z\\d_]*_t\\b"},{match:/\batomic_[a-z]{3,6}\b/}]},c={className:"string",variants:[{begin:'(u8?|U|L)?"',end:'"',illegal:"\\n",contains:[e.BACKSLASH_ESCAPE]},{begin:"(u8?|U|L)?'("+"\\\\(x[0-9A-Fa-f]{2}|u[0-9A-Fa-f]{4,8}|[0-7]{3}|\\S)"+"|.)",end:"'",illegal:"."},e.END_SAME_AS_BEGIN({begin:/(?:u8?|U|L)?R"([^()\\ ]{0,16})\(/,end:/\)([^()\\ ]{0,16})"/})]},g={className:"number",variants:[{match:/\b(0b[01']+)/},{match:/(-?)\b([\d']+(\.[\d']*)?|\.[\d']+)((ll|LL|l|L)(u|U)?|(u|U)(ll|LL|l|L)?|f|F|b|B)/},{match:/(-?)\b(0[xX][a-fA-F0-9]+(?:'[a-fA-F0-9]+)*(?:\.[a-fA-F0-9]*(?:'[a-fA-F0-9]*)*)?(?:[pP][-+]?[0-9]+)?(l|L)?(u|U)?)/},{match:/(-?)\b\d+(?:'\d+)*(?:\.\d*(?:'\d*)*)?(?:[eE][-+]?\d+)?/}],relevance:0},E={className:"meta",begin:/#\s*[a-z]+\b/,end:/$/,keywords:{keyword:"if else elif endif define undef warning error line pragma _Pragma ifdef ifndef elifdef elifndef include"},contains:[{begin:/\\\n/,relevance:0},e.inherit(c,{className:"string"}),{className:"string",begin:/<.*?>/},t,e.C_BLOCK_COMMENT_MODE]},b={className:"title",begin:n.optional(i)+e.IDENT_RE,relevance:0},m=n.optional(i)+e.IDENT_RE+"\\s*\\(",T={keyword:["asm","auto","break","case","continue","default","do","else","enum","extern","for","fortran","goto","if","inline","register","restrict","return","sizeof","typeof","typeof_unqual","struct","switch","typedef","union","volatile","while","_Alignas","_Alignof","_Atomic","_Generic","_Noreturn","_Static_assert","_Thread_local","alignas","alignof","noreturn","static_assert","thread_local","_Pragma"],type:["float","double","signed","unsigned","int","short","long","char","void","_Bool","_BitInt","_Complex","_Imaginary","_Decimal32","_Decimal64","_Decimal96","_Decimal128","_Decimal64x","_Decimal128x","_Float16","_Float32","_Float64","_Float128","_Float32x","_Float64x","_Float128x","const","static","constexpr","complex","bool","imaginary"],literal:"true false NULL",built_in:"std string wstring cin cout cerr clog stdin stdout stderr stringstream istringstream ostringstream auto_ptr deque list queue stack vector map set pair bitset multiset multimap unordered_set unordered_map unordered_multiset unordered_multimap priority_queue make_pair array shared_ptr abort terminate abs acos asin atan2 atan calloc ceil cosh cos exit exp fabs floor fmod fprintf fputs free frexp fscanf future isalnum isalpha iscntrl isdigit isgraph islower isprint ispunct isspace isupper isxdigit tolower toupper labs ldexp log10 log malloc realloc memchr memcmp memcpy memset modf pow printf putchar puts scanf sinh sin snprintf sprintf sqrt sscanf strcat strchr strcmp strcpy strcspn strlen strncat strncmp strncpy strpbrk strrchr strspn strstr tanh tan vfprintf vprintf vsprintf endl initializer_list unique_ptr"},C=[E,r,t,e.C_BLOCK_COMMENT_MODE,g,c],A={variants:[{begin:/=/,end:/;/},{begin:/\(/,end:/\)/},{beginKeywords:"new throw return else",end:/;/}],keywords:T,contains:C.concat([{begin:/\(/,end:/\)/,keywords:T,contains:C.concat(["self"]),relevance:0}]),relevance:0},j={begin:"("+a+"[\\*&\\s]+)+"+m,returnBegin:!0,end:/[{;=]/,excludeEnd:!0,keywords:T,illegal:/[^\w\s\*&:<>.]/,contains:[{begin:o,keywords:T,relevance:0},{begin:m,returnBegin:!0,contains:[e.inherit(b,{className:"title.function"})],relevance:0},{relevance:0,match:/,/},{className:"params",begin:/\(/,end:/\)/,keywords:T,relevance:0,contains:[t,e.C_BLOCK_COMMENT_MODE,c,g,r,{begin:/\(/,end:/\)/,keywords:T,relevance:0,contains:["self",t,e.C_BLOCK_COMMENT_MODE,c,g,r]}]},r,t,e.C_BLOCK_COMMENT_MODE,E]};return{name:"C",aliases:["h"],keywords:T,disableAutodetect:!0,illegal:"</",contains:[].concat(A,j,C,[E,{begin:e.IDENT_RE+"::",keywords:T},{className:"class",beginKeywords:"enum class struct union",end:/[{;:<>=]/,contains:[{beginKeywords:"final class struct"},e.TITLE_MODE]}]),exports:{preprocessor:E,strings:c,keywords:T}}}function Nt(e){let n=e.regex,t=e.COMMENT("//","$",{contains:[{begin:/\\\n/}]}),o="decltype\\(auto\\)",i="[a-zA-Z_]\\w*::",a="(?!struct)("+o+"|"+n.optional(i)+"[a-zA-Z_]\\w*"+n.optional("<[^<>]+>")+")",r={className:"type",begin:"\\b[a-z\\d_]*_t\\b"},c={className:"string",variants:[{begin:'(u8?|U|L)?"',end:'"',illegal:"\\n",contains:[e.BACKSLASH_ESCAPE]},{begin:"(u8?|U|L)?'("+"\\\\(x[0-9A-Fa-f]{2}|u[0-9A-Fa-f]{4,8}|[0-7]{3}|\\S)"+"|.)",end:"'",illegal:"."},e.END_SAME_AS_BEGIN({begin:/(?:u8?|U|L)?R"([^()\\ ]{0,16})\(/,end:/\)([^()\\ ]{0,16})"/})]},g={className:"number",variants:[{begin:"[+-]?(?:(?:[0-9](?:'?[0-9])*\\.(?:[0-9](?:'?[0-9])*)?|\\.[0-9](?:'?[0-9])*)(?:[Ee][+-]?[0-9](?:'?[0-9])*)?|[0-9](?:'?[0-9])*[Ee][+-]?[0-9](?:'?[0-9])*|0[Xx](?:[0-9A-Fa-f](?:'?[0-9A-Fa-f])*(?:\\.(?:[0-9A-Fa-f](?:'?[0-9A-Fa-f])*)?)?|\\.[0-9A-Fa-f](?:'?[0-9A-Fa-f])*)[Pp][+-]?[0-9](?:'?[0-9])*)(?:[Ff](?:16|32|64|128)?|(BF|bf)16|[Ll]|)"},{begin:"[+-]?\\b(?:0[Bb][01](?:'?[01])*|0[Xx][0-9A-Fa-f](?:'?[0-9A-Fa-f])*|0(?:'?[0-7])*|[1-9](?:'?[0-9])*)(?:[Uu](?:LL?|ll?)|[Uu][Zz]?|(?:LL?|ll?)[Uu]?|[Zz][Uu]|)"}],relevance:0},E={className:"meta",begin:/#\s*[a-z]+\b/,end:/$/,keywords:{keyword:"if else elif endif define undef warning error line pragma _Pragma ifdef ifndef include"},contains:[{begin:/\\\n/,relevance:0},e.inherit(c,{className:"string"}),{className:"string",begin:/<.*?>/},t,e.C_BLOCK_COMMENT_MODE]},b={className:"title",begin:n.optional(i)+e.IDENT_RE,relevance:0},m=n.optional(i)+e.IDENT_RE+"\\s*\\(",v=["alignas","alignof","and","and_eq","asm","atomic_cancel","atomic_commit","atomic_noexcept","auto","bitand","bitor","break","case","catch","class","co_await","co_return","co_yield","compl","concept","const_cast|10","consteval","constexpr","constinit","continue","decltype","default","delete","do","dynamic_cast|10","else","enum","explicit","export","extern","false","final","for","friend","goto","if","import","inline","module","mutable","namespace","new","noexcept","not","not_eq","nullptr","operator","or","or_eq","override","private","protected","public","reflexpr","register","reinterpret_cast|10","requires","return","sizeof","static_assert","static_cast|10","struct","switch","synchronized","template","this","thread_local","throw","transaction_safe","transaction_safe_dynamic","true","try","typedef","typeid","typename","union","using","virtual","volatile","while","xor","xor_eq"],S=["bool","char","char16_t","char32_t","char8_t","double","float","int","long","short","void","wchar_t","unsigned","signed","const","static"],T=["any","auto_ptr","barrier","binary_semaphore","bitset","complex","condition_variable","condition_variable_any","counting_semaphore","deque","false_type","flat_map","flat_set","future","imaginary","initializer_list","istringstream","jthread","latch","lock_guard","multimap","multiset","mutex","optional","ostringstream","packaged_task","pair","promise","priority_queue","queue","recursive_mutex","recursive_timed_mutex","scoped_lock","set","shared_future","shared_lock","shared_mutex","shared_timed_mutex","shared_ptr","stack","string_view","stringstream","timed_mutex","thread","true_type","tuple","unique_lock","unique_ptr","unordered_map","unordered_multimap","unordered_multiset","unordered_set","variant","vector","weak_ptr","wstring","wstring_view"],C=["abort","abs","acos","apply","as_const","asin","atan","atan2","calloc","ceil","cerr","cin","clog","cos","cosh","cout","declval","endl","exchange","exit","exp","fabs","floor","fmod","forward","fprintf","fputs","free","frexp","fscanf","future","invoke","isalnum","isalpha","iscntrl","isdigit","isgraph","islower","isprint","ispunct","isspace","isupper","isxdigit","labs","launder","ldexp","log","log10","make_pair","make_shared","make_shared_for_overwrite","make_tuple","make_unique","malloc","memchr","memcmp","memcpy","memset","modf","move","pow","printf","putchar","puts","realloc","scanf","sin","sinh","snprintf","sprintf","sqrt","sscanf","std","stderr","stdin","stdout","strcat","strchr","strcmp","strcpy","strcspn","strlen","strncat","strncmp","strncpy","strpbrk","strrchr","strspn","strstr","swap","tan","tanh","terminate","to_underlying","tolower","toupper","vfprintf","visit","vprintf","vsprintf"],M={type:S,keyword:v,literal:["NULL","false","nullopt","nullptr","true"],built_in:["_Pragma"],_type_hints:T},w={className:"function.dispatch",relevance:0,keywords:{_hint:C},begin:n.concat(/\b/,/(?!decltype)/,/(?!if)/,/(?!for)/,/(?!switch)/,/(?!while)/,e.IDENT_RE,n.lookahead(/(<[^<>]+>|)\s*\(/))},y=[w,E,r,t,e.C_BLOCK_COMMENT_MODE,g,c],D={variants:[{begin:/=/,end:/;/},{begin:/\(/,end:/\)/},{beginKeywords:"new throw return else",end:/;/}],keywords:M,contains:y.concat([{begin:/\(/,end:/\)/,keywords:M,contains:y.concat(["self"]),relevance:0}]),relevance:0},O={className:"function",begin:"("+a+"[\\*&\\s]+)+"+m,returnBegin:!0,end:/[{;=]/,excludeEnd:!0,keywords:M,illegal:/[^\w\s\*&:<>.]/,contains:[{begin:o,keywords:M,relevance:0},{begin:m,returnBegin:!0,contains:[b],relevance:0},{begin:/::/,relevance:0},{begin:/:/,endsWithParent:!0,contains:[c,g]},{relevance:0,match:/,/},{className:"params",begin:/\(/,end:/\)/,keywords:M,relevance:0,contains:[t,e.C_BLOCK_COMMENT_MODE,c,g,r,{begin:/\(/,end:/\)/,keywords:M,relevance:0,contains:["self",t,e.C_BLOCK_COMMENT_MODE,c,g,r]}]},r,t,e.C_BLOCK_COMMENT_MODE,E]};return{name:"C++",aliases:["cc","c++","h++","hpp","hh","hxx","cxx"],keywords:M,illegal:"</",classNameAliases:{"function.dispatch":"built_in"},contains:[].concat(D,O,w,y,[E,{begin:"\\b(deque|list|queue|priority_queue|pair|stack|vector|map|set|bitset|multiset|multimap|unordered_map|unordered_set|unordered_multiset|unordered_multimap|array|tuple|optional|variant|function|flat_map|flat_set)\\s*<(?!<)",end:">",keywords:M,contains:["self",r]},{begin:e.IDENT_RE+"::",keywords:M},{match:[/\b(?:enum(?:\s+(?:class|struct))?|class|struct|union)/,/\s+/,/\w+/],className:{1:"keyword",3:"title.class"}}])}}var mo=e=>({IMPORTANT:{scope:"meta",begin:"!important"},BLOCK_COMMENT:e.C_BLOCK_COMMENT_MODE,HEXCOLOR:{scope:"number",begin:/#(([0-9a-fA-F]{3,4})|(([0-9a-fA-F]{2}){3,4}))\b/},FUNCTION_DISPATCH:{className:"built_in",begin:/[\w-]+(?=\()/},ATTRIBUTE_SELECTOR_MODE:{scope:"selector-attr",begin:/\[/,end:/\]/,illegal:"$",contains:[e.APOS_STRING_MODE,e.QUOTE_STRING_MODE]},CSS_NUMBER_MODE:{scope:"number",begin:e.NUMBER_RE+"(%|em|ex|ch|rem|vw|vh|vmin|vmax|cm|mm|in|pt|pc|px|deg|grad|rad|turn|s|ms|Hz|kHz|dpi|dpcm|dppx)?",relevance:0},CSS_VARIABLE:{className:"attr",begin:/--[A-Za-z_][A-Za-z0-9_-]*/}}),fo=["a","abbr","address","article","aside","audio","b","blockquote","body","button","canvas","caption","cite","code","dd","del","details","dfn","div","dl","dt","em","fieldset","figcaption","figure","footer","form","h1","h2","h3","h4","h5","h6","header","hgroup","html","i","iframe","img","input","ins","kbd","label","legend","li","main","mark","menu","nav","object","ol","optgroup","option","p","picture","q","quote","samp","section","select","source","span","strong","summary","sup","table","tbody","td","textarea","tfoot","th","thead","time","tr","ul","var","video"],bo=["defs","g","marker","mask","pattern","svg","switch","symbol","feBlend","feColorMatrix","feComponentTransfer","feComposite","feConvolveMatrix","feDiffuseLighting","feDisplacementMap","feFlood","feGaussianBlur","feImage","feMerge","feMorphology","feOffset","feSpecularLighting","feTile","feTurbulence","linearGradient","radialGradient","stop","circle","ellipse","image","line","path","polygon","polyline","rect","text","use","textPath","tspan","foreignObject","clipPath"],Eo=[...fo,...bo],_o=["any-hover","any-pointer","aspect-ratio","color","color-gamut","color-index","device-aspect-ratio","device-height","device-width","display-mode","forced-colors","grid","height","hover","inverted-colors","monochrome","orientation","overflow-block","overflow-inline","pointer","prefers-color-scheme","prefers-contrast","prefers-reduced-motion","prefers-reduced-transparency","resolution","scan","scripting","update","width","min-width","max-width","min-height","max-height"].sort().reverse(),yo=["active","any-link","blank","checked","current","default","defined","dir","disabled","drop","empty","enabled","first","first-child","first-of-type","fullscreen","future","focus","focus-visible","focus-within","has","host","host-context","hover","indeterminate","in-range","invalid","is","lang","last-child","last-of-type","left","link","local-link","not","nth-child","nth-col","nth-last-child","nth-last-col","nth-last-of-type","nth-of-type","only-child","only-of-type","optional","out-of-range","past","placeholder-shown","read-only","read-write","required","right","root","scope","target","target-within","user-invalid","valid","visited","where"].sort().reverse(),wo=["after","backdrop","before","cue","cue-region","first-letter","first-line","grammar-error","marker","part","placeholder","selection","slotted","spelling-error"].sort().reverse(),So=["accent-color","align-content","align-items","align-self","alignment-baseline","all","anchor-name","animation","animation-composition","animation-delay","animation-direction","animation-duration","animation-fill-mode","animation-iteration-count","animation-name","animation-play-state","animation-range","animation-range-end","animation-range-start","animation-timeline","animation-timing-function","appearance","aspect-ratio","backdrop-filter","backface-visibility","background","background-attachment","background-blend-mode","background-clip","background-color","background-image","background-origin","background-position","background-position-x","background-position-y","background-repeat","background-size","baseline-shift","block-size","border","border-block","border-block-color","border-block-end","border-block-end-color","border-block-end-style","border-block-end-width","border-block-start","border-block-start-color","border-block-start-style","border-block-start-width","border-block-style","border-block-width","border-bottom","border-bottom-color","border-bottom-left-radius","border-bottom-right-radius","border-bottom-style","border-bottom-width","border-collapse","border-color","border-end-end-radius","border-end-start-radius","border-image","border-image-outset","border-image-repeat","border-image-slice","border-image-source","border-image-width","border-inline","border-inline-color","border-inline-end","border-inline-end-color","border-inline-end-style","border-inline-end-width","border-inline-start","border-inline-start-color","border-inline-start-style","border-inline-start-width","border-inline-style","border-inline-width","border-left","border-left-color","border-left-style","border-left-width","border-radius","border-right","border-right-color","border-right-style","border-right-width","border-spacing","border-start-end-radius","border-start-start-radius","border-style","border-top","border-top-color","border-top-left-radius","border-top-right-radius","border-top-style","border-top-width","border-width","bottom","box-align","box-decoration-break","box-direction","box-flex","box-flex-group","box-lines","box-ordinal-group","box-orient","box-pack","box-shadow","box-sizing","break-after","break-before","break-inside","caption-side","caret-color","clear","clip","clip-path","clip-rule","color","color-interpolation","color-interpolation-filters","color-profile","color-rendering","color-scheme","column-count","column-fill","column-gap","column-rule","column-rule-color","column-rule-style","column-rule-width","column-span","column-width","columns","contain","contain-intrinsic-block-size","contain-intrinsic-height","contain-intrinsic-inline-size","contain-intrinsic-size","contain-intrinsic-width","container","container-name","container-type","content","content-visibility","counter-increment","counter-reset","counter-set","cue","cue-after","cue-before","cursor","cx","cy","direction","display","dominant-baseline","empty-cells","enable-background","field-sizing","fill","fill-opacity","fill-rule","filter","flex","flex-basis","flex-direction","flex-flow","flex-grow","flex-shrink","flex-wrap","float","flood-color","flood-opacity","flow","font","font-display","font-family","font-feature-settings","font-kerning","font-language-override","font-optical-sizing","font-palette","font-size","font-size-adjust","font-smooth","font-smoothing","font-stretch","font-style","font-synthesis","font-synthesis-position","font-synthesis-small-caps","font-synthesis-style","font-synthesis-weight","font-variant","font-variant-alternates","font-variant-caps","font-variant-east-asian","font-variant-emoji","font-variant-ligatures","font-variant-numeric","font-variant-position","font-variation-settings","font-weight","forced-color-adjust","gap","glyph-orientation-horizontal","glyph-orientation-vertical","grid","grid-area","grid-auto-columns","grid-auto-flow","grid-auto-rows","grid-column","grid-column-end","grid-column-start","grid-gap","grid-row","grid-row-end","grid-row-start","grid-template","grid-template-areas","grid-template-columns","grid-template-rows","hanging-punctuation","height","hyphenate-character","hyphenate-limit-chars","hyphens","icon","image-orientation","image-rendering","image-resolution","ime-mode","initial-letter","initial-letter-align","inline-size","inset","inset-area","inset-block","inset-block-end","inset-block-start","inset-inline","inset-inline-end","inset-inline-start","isolation","justify-content","justify-items","justify-self","kerning","left","letter-spacing","lighting-color","line-break","line-height","line-height-step","list-style","list-style-image","list-style-position","list-style-type","margin","margin-block","margin-block-end","margin-block-start","margin-bottom","margin-inline","margin-inline-end","margin-inline-start","margin-left","margin-right","margin-top","margin-trim","marker","marker-end","marker-mid","marker-start","marks","mask","mask-border","mask-border-mode","mask-border-outset","mask-border-repeat","mask-border-slice","mask-border-source","mask-border-width","mask-clip","mask-composite","mask-image","mask-mode","mask-origin","mask-position","mask-repeat","mask-size","mask-type","masonry-auto-flow","math-depth","math-shift","math-style","max-block-size","max-height","max-inline-size","max-width","min-block-size","min-height","min-inline-size","min-width","mix-blend-mode","nav-down","nav-index","nav-left","nav-right","nav-up","none","normal","object-fit","object-position","offset","offset-anchor","offset-distance","offset-path","offset-position","offset-rotate","opacity","order","orphans","outline","outline-color","outline-offset","outline-style","outline-width","overflow","overflow-anchor","overflow-block","overflow-clip-margin","overflow-inline","overflow-wrap","overflow-x","overflow-y","overlay","overscroll-behavior","overscroll-behavior-block","overscroll-behavior-inline","overscroll-behavior-x","overscroll-behavior-y","padding","padding-block","padding-block-end","padding-block-start","padding-bottom","padding-inline","padding-inline-end","padding-inline-start","padding-left","padding-right","padding-top","page","page-break-after","page-break-before","page-break-inside","paint-order","pause","pause-after","pause-before","perspective","perspective-origin","place-content","place-items","place-self","pointer-events","position","position-anchor","position-visibility","print-color-adjust","quotes","r","resize","rest","rest-after","rest-before","right","rotate","row-gap","ruby-align","ruby-position","scale","scroll-behavior","scroll-margin","scroll-margin-block","scroll-margin-block-end","scroll-margin-block-start","scroll-margin-bottom","scroll-margin-inline","scroll-margin-inline-end","scroll-margin-inline-start","scroll-margin-left","scroll-margin-right","scroll-margin-top","scroll-padding","scroll-padding-block","scroll-padding-block-end","scroll-padding-block-start","scroll-padding-bottom","scroll-padding-inline","scroll-padding-inline-end","scroll-padding-inline-start","scroll-padding-left","scroll-padding-right","scroll-padding-top","scroll-snap-align","scroll-snap-stop","scroll-snap-type","scroll-timeline","scroll-timeline-axis","scroll-timeline-name","scrollbar-color","scrollbar-gutter","scrollbar-width","shape-image-threshold","shape-margin","shape-outside","shape-rendering","speak","speak-as","src","stop-color","stop-opacity","stroke","stroke-dasharray","stroke-dashoffset","stroke-linecap","stroke-linejoin","stroke-miterlimit","stroke-opacity","stroke-width","tab-size","table-layout","text-align","text-align-all","text-align-last","text-anchor","text-combine-upright","text-decoration","text-decoration-color","text-decoration-line","text-decoration-skip","text-decoration-skip-ink","text-decoration-style","text-decoration-thickness","text-emphasis","text-emphasis-color","text-emphasis-position","text-emphasis-style","text-indent","text-justify","text-orientation","text-overflow","text-rendering","text-shadow","text-size-adjust","text-transform","text-underline-offset","text-underline-position","text-wrap","text-wrap-mode","text-wrap-style","timeline-scope","top","touch-action","transform","transform-box","transform-origin","transform-style","transition","transition-behavior","transition-delay","transition-duration","transition-property","transition-timing-function","translate","unicode-bidi","user-modify","user-select","vector-effect","vertical-align","view-timeline","view-timeline-axis","view-timeline-inset","view-timeline-name","view-transition-name","visibility","voice-balance","voice-duration","voice-family","voice-pitch","voice-range","voice-rate","voice-stress","voice-volume","white-space","white-space-collapse","widows","width","will-change","word-break","word-spacing","word-wrap","writing-mode","x","y","z-index","zoom"].sort().reverse();function Ct(e){let n=e.regex,t=mo(e),o={begin:/-(webkit|moz|ms|o)-(?=[a-z])/},i="and or not only",l=/@-?\w[\w]*(-\w+)*/,a="[a-zA-Z-][a-zA-Z0-9_-]*",r=[e.APOS_STRING_MODE,e.QUOTE_STRING_MODE];return{name:"CSS",case_insensitive:!0,illegal:/[=|'\$]/,keywords:{keyframePosition:"from to"},classNameAliases:{keyframePosition:"selector-tag"},contains:[t.BLOCK_COMMENT,o,t.CSS_NUMBER_MODE,{className:"selector-id",begin:/#[A-Za-z0-9_-]+/,relevance:0},{className:"selector-class",begin:"\\."+a,relevance:0},t.ATTRIBUTE_SELECTOR_MODE,{className:"selector-pseudo",variants:[{begin:":("+yo.join("|")+")"},{begin:":(:)?("+wo.join("|")+")"}]},t.CSS_VARIABLE,{className:"attribute",begin:"\\b("+So.join("|")+")\\b"},{begin:/:/,end:/[;}{]/,contains:[t.BLOCK_COMMENT,t.HEXCOLOR,t.IMPORTANT,t.CSS_NUMBER_MODE,...r,{begin:/(url|data-uri)\(/,end:/\)/,relevance:0,keywords:{built_in:"url data-uri"},contains:[...r,{className:"string",begin:/[^)]/,endsWithParent:!0,excludeEnd:!0}]},t.FUNCTION_DISPATCH]},{begin:n.lookahead(/@/),end:"[{;]",relevance:0,illegal:/:/,contains:[{className:"keyword",begin:l},{begin:/\s/,endsWithParent:!0,excludeEnd:!0,relevance:0,keywords:{$pattern:/[a-z-]+/,keyword:i,attribute:_o.join(" ")},contains:[{begin:/[a-z-]+(?=:)/,className:"attribute"},...r,t.CSS_NUMBER_MODE]}]},{className:"selector-tag",begin:"\\b("+Eo.join("|")+")\\b"}]}}function kt(e){let l={keyword:["break","case","chan","const","continue","default","defer","else","fallthrough","for","func","go","goto","if","import","interface","map","package","range","return","select","struct","switch","type","var"],type:["bool","byte","complex64","complex128","error","float32","float64","int8","int16","int32","int64","string","uint8","uint16","uint32","uint64","int","uint","uintptr","rune"],literal:["true","false","iota","nil"],built_in:["append","cap","close","complex","copy","imag","len","make","new","panic","print","println","real","recover","delete"]};return{name:"Go",aliases:["golang"],keywords:l,illegal:"</",contains:[e.C_LINE_COMMENT_MODE,e.C_BLOCK_COMMENT_MODE,{className:"string",variants:[e.QUOTE_STRING_MODE,e.APOS_STRING_MODE,{begin:"`",end:"`"}]},{className:"number",variants:[{match:/-?\b0[xX]\.[a-fA-F0-9](_?[a-fA-F0-9])*[pP][+-]?\d(_?\d)*i?/,relevance:0},{match:/-?\b0[xX](_?[a-fA-F0-9])+((\.([a-fA-F0-9](_?[a-fA-F0-9])*)?)?[pP][+-]?\d(_?\d)*)?i?/,relevance:0},{match:/-?\b0[oO](_?[0-7])*i?/,relevance:0},{match:/-?\.\d(_?\d)*([eE][+-]?\d(_?\d)*)?i?/,relevance:0},{match:/-?\b\d(_?\d)*(\.(\d(_?\d)*)?)?([eE][+-]?\d(_?\d)*)?i?/,relevance:0}]},{begin:/:=/},{className:"function",beginKeywords:"func",end:"\\s*(\\{|$)",excludeEnd:!0,contains:[e.TITLE_MODE,{className:"params",begin:/\(/,end:/\)/,endsParent:!0,keywords:l,illegal:/["']/}]}]}}var se="[0-9](_*[0-9])*",Ee=`\\.(${se})`,_e="[0-9a-fA-F](_*[0-9a-fA-F])*",At={className:"number",variants:[{begin:`(\\b(${se})((${Ee})|\\.)?|(${Ee}))[eE][+-]?(${se})[fFdD]?\\b`},{begin:`\\b(${se})((${Ee})[fFdD]?\\b|\\.([fFdD]\\b)?)`},{begin:`(${Ee})[fFdD]?\\b`},{begin:`\\b(${se})[fFdD]\\b`},{begin:`\\b0[xX]((${_e})\\.?|(${_e})?\\.(${_e}))[pP][+-]?(${se})[fFdD]?\\b`},{begin:"\\b(0|[1-9](_*[0-9])*)[lL]?\\b"},{begin:`\\b0[xX](${_e})[lL]?\\b`},{begin:"\\b0(_*[0-7])*[lL]?\\b"},{begin:"\\b0[bB][01](_*[01])*[lL]?\\b"}],relevance:0};function Mt(e,n,t){return t===-1?"":e.replace(n,o=>Mt(e,n,t-1))}function Ot(e){let n=e.regex,t="[\xC0-\u02B8a-zA-Z_$][\xC0-\u02B8a-zA-Z_$0-9]*",o=t+Mt("(?:<"+t+"~~~(?:\\s*,\\s*"+t+"~~~)*>)?",/~~~/g,2),s={keyword:["synchronized","abstract","private","var","static","if","const ","for","while","strictfp","finally","protected","import","native","final","void","enum","else","break","transient","catch","instanceof","volatile","case","assert","package","default","public","try","switch","continue","throws","protected","public","private","module","requires","exports","do","sealed","yield","permits","goto","when"],literal:["false","true","null"],type:["char","boolean","long","float","int","byte","short","double"],built_in:["super","this"]},c={className:"meta",begin:"@"+t,contains:[{begin:/\(/,end:/\)/,contains:["self"]}]},g={className:"params",begin:/\(/,end:/\)/,keywords:s,relevance:0,contains:[e.C_BLOCK_COMMENT_MODE],endsParent:!0};return{name:"Java",aliases:["jsp"],keywords:s,illegal:/<\/|#/,contains:[e.COMMENT("/\\*\\*","\\*/",{relevance:0,contains:[{begin:/\w+@/,relevance:0},{className:"doctag",begin:"@[A-Za-z]+"}]}),{begin:/import java\.[a-z]+\./,keywords:"import",relevance:2},e.C_LINE_COMMENT_MODE,e.C_BLOCK_COMMENT_MODE,{begin:/"""/,end:/"""/,className:"string",contains:[e.BACKSLASH_ESCAPE]},e.APOS_STRING_MODE,e.QUOTE_STRING_MODE,{match:[/\b(?:class|interface|enum|extends|implements|new)/,/\s+/,t],className:{1:"keyword",3:"title.class"}},{match:/non-sealed/,scope:"keyword"},{begin:[n.concat(/(?!else)/,t),/\s+/,t,/\s+/,/=(?!=)/],className:{1:"type",3:"variable",5:"operator"}},{begin:[/record/,/\s+/,t],className:{1:"keyword",3:"title.class"},contains:[g,e.C_LINE_COMMENT_MODE,e.C_BLOCK_COMMENT_MODE]},{beginKeywords:"new throw return else",relevance:0},{begin:["(?:"+o+"\\s+)",e.UNDERSCORE_IDENT_RE,/\s*(?=\()/],className:{2:"title.function"},keywords:s,contains:[{className:"params",begin:/\(/,end:/\)/,keywords:s,relevance:0,contains:[c,e.APOS_STRING_MODE,e.QUOTE_STRING_MODE,At,e.C_BLOCK_COMMENT_MODE]},e.C_LINE_COMMENT_MODE,e.C_BLOCK_COMMENT_MODE]},At,c]}}var Rt="[A-Za-z$_][0-9A-Za-z$_]*",To=["as","in","of","if","for","while","finally","var","new","function","do","return","void","else","break","catch","instanceof","with","throw","case","default","try","switch","continue","typeof","delete","let","yield","const","class","debugger","async","await","static","import","from","export","extends","using"],vo=["true","false","null","undefined","NaN","Infinity"],Lt=["Object","Function","Boolean","Symbol","Math","Date","Number","BigInt","String","RegExp","Array","Float32Array","Float64Array","Int8Array","Uint8Array","Uint8ClampedArray","Int16Array","Int32Array","Uint16Array","Uint32Array","BigInt64Array","BigUint64Array","Set","Map","WeakSet","WeakMap","ArrayBuffer","SharedArrayBuffer","Atomics","DataView","JSON","Promise","Generator","GeneratorFunction","AsyncFunction","Reflect","Proxy","Intl","WebAssembly"],Bt=["Error","EvalError","InternalError","RangeError","ReferenceError","SyntaxError","TypeError","URIError"],Dt=["setInterval","setTimeout","clearInterval","clearTimeout","require","exports","eval","isFinite","isNaN","parseFloat","parseInt","decodeURI","decodeURIComponent","encodeURI","encodeURIComponent","escape","unescape"],xo=["arguments","this","super","console","window","document","localStorage","sessionStorage","module","global"],No=[].concat(Dt,Lt,Bt);function jt(e){let n=e.regex,t=(p,{after:N})=>{let R="</"+p[0].slice(1);return p.input.indexOf(R,N)!==-1},o=Rt,i={begin:"<>",end:"</>"},l=/<[A-Za-z0-9\\._:-]+\s*\/>/,a={begin:/<[A-Za-z0-9\\._:-]+/,end:/\/[A-Za-z0-9\\._:-]+>|\/>/,isTrulyOpeningTag:(p,N)=>{let R=p[0].length+p.index,H=p.input[R];if(H==="<"||H===","){N.ignoreMatch();return}H===">"&&(t(p,{after:R})||N.ignoreMatch());let q,Y=p.input.substring(R);if(q=Y.match(/^\s*=/)){N.ignoreMatch();return}if((q=Y.match(/^\s+extends\s+/))&&q.index===0){N.ignoreMatch();return}}},r={$pattern:Rt,keyword:To,literal:vo,built_in:No,"variable.language":xo},s="[0-9](_?[0-9])*",c=`\\.(${s})`,g="0|[1-9](_?[0-9])*|0[0-7]*[89][0-9]*",E={className:"number",variants:[{begin:`(\\b(${g})((${c})|\\.)?|(${c}))[eE][+-]?(${s})\\b`},{begin:`\\b(${g})\\b((${c})\\b|\\.)?|(${c})\\b`},{begin:"\\b(0|[1-9](_?[0-9])*)n\\b"},{begin:"\\b0[xX][0-9a-fA-F](_?[0-9a-fA-F])*n?\\b"},{begin:"\\b0[bB][0-1](_?[0-1])*n?\\b"},{begin:"\\b0[oO][0-7](_?[0-7])*n?\\b"},{begin:"\\b0[0-7]+n?\\b"}],relevance:0},b={className:"subst",begin:"\\$\\{",end:"\\}",keywords:r,contains:[]},m={begin:".?html`",end:"",starts:{end:"`",returnEnd:!1,contains:[e.BACKSLASH_ESCAPE,b],subLanguage:"xml"}},v={begin:".?css`",end:"",starts:{end:"`",returnEnd:!1,contains:[e.BACKSLASH_ESCAPE,b],subLanguage:"css"}},S={begin:".?gql`",end:"",starts:{end:"`",returnEnd:!1,contains:[e.BACKSLASH_ESCAPE,b],subLanguage:"graphql"}},T={className:"string",begin:"`",end:"`",contains:[e.BACKSLASH_ESCAPE,b]},A={className:"comment",variants:[e.COMMENT(/\/\*\*(?!\/)/,"\\*/",{relevance:0,contains:[{begin:"(?=@[A-Za-z]+)",relevance:0,contains:[{className:"doctag",begin:"@[A-Za-z]+"},{className:"type",begin:"\\{",end:"\\}",excludeEnd:!0,excludeBegin:!0,relevance:0},{className:"variable",begin:o+"(?=\\s*(-)|$)",endsParent:!0,relevance:0},{begin:/(?=[^\n])\s/,relevance:0}]}]}),e.C_BLOCK_COMMENT_MODE,e.C_LINE_COMMENT_MODE]},j=[e.APOS_STRING_MODE,e.QUOTE_STRING_MODE,m,v,S,T,{match:/\$\d+/},E];b.contains=j.concat({begin:/\{/,end:/\}/,keywords:r,contains:["self"].concat(j)});let M=[].concat(A,b.contains),w=M.concat([{begin:/(\s*)\(/,end:/\)/,keywords:r,contains:["self"].concat(M)}]),y={className:"params",begin:/(\s*)\(/,end:/\)/,excludeBegin:!0,excludeEnd:!0,keywords:r,contains:w},D={variants:[{match:[/class/,/\s+/,o,/\s+/,/extends/,/\s+/,n.concat(o,"(",n.concat(/\./,o),")*")],scope:{1:"keyword",3:"title.class",5:"keyword",7:"title.class.inherited"}},{match:[/class/,/\s+/,o],scope:{1:"keyword",3:"title.class"}}]},O={relevance:0,match:n.either(/\bJSON/,/\b[A-Z][a-z]+([A-Z][a-z]*|\d)*/,/\b[A-Z]{2,}([A-Z][a-z]+|\d)+([A-Z][a-z]*)*/,/\b[A-Z]{2,}[a-z]+([A-Z][a-z]+|\d)*([A-Z][a-z]*)*/),className:"title.class",keywords:{_:[...Lt,...Bt]}},L={label:"use_strict",className:"meta",relevance:10,begin:/^\s*['"]use (strict|asm)['"]/},$={variants:[{match:[/function/,/\s+/,o,/(?=\s*\()/]},{match:[/function/,/\s*(?=\()/]}],className:{1:"keyword",3:"title.function"},label:"func.def",contains:[y],illegal:/%/},U={relevance:0,match:/\b[A-Z][A-Z_0-9]+\b/,className:"variable.constant"};function G(p){return n.concat("(?!",p.join("|"),")")}let W={match:n.concat(/\b/,G([...Dt,"super","import"].map(p=>`${p}\\s*\\(`)),o,n.lookahead(/\s*\(/)),className:"title.function",relevance:0},F={begin:n.concat(/\./,n.lookahead(n.concat(o,/(?![0-9A-Za-z$_(])/))),end:o,excludeBegin:!0,keywords:"prototype",className:"property",relevance:0},Z={match:[/get|set/,/\s+/,o,/(?=\()/],className:{1:"keyword",3:"title.function"},contains:[{begin:/\(\)/},y]},d="(\\([^()]*(\\([^()]*(\\([^()]*\\)[^()]*)*\\)[^()]*)*\\)|"+e.UNDERSCORE_IDENT_RE+")\\s*=>",u={match:[/const|var|let/,/\s+/,o,/\s*/,/=\s*/,/(async\s*)?/,n.lookahead(d)],keywords:"async",className:{1:"keyword",3:"title.function"},contains:[y]};return{name:"JavaScript",aliases:["js","jsx","mjs","cjs"],keywords:r,exports:{PARAMS_CONTAINS:w,CLASS_REFERENCE:O},illegal:/#(?![$_A-z])/,contains:[e.SHEBANG({label:"shebang",binary:"node",relevance:5}),L,e.APOS_STRING_MODE,e.QUOTE_STRING_MODE,m,v,S,T,A,{match:/\$\d+/},E,O,{scope:"attr",match:o+n.lookahead(":"),relevance:0},u,{begin:"("+e.RE_STARTERS_RE+"|\\b(case|return|throw)\\b)\\s*",keywords:"return throw case",relevance:0,contains:[A,e.REGEXP_MODE,{className:"function",begin:d,returnBegin:!0,end:"\\s*=>",contains:[{className:"params",variants:[{begin:e.UNDERSCORE_IDENT_RE,relevance:0},{className:null,begin:/\(\s*\)/,skip:!0},{begin:/(\s*)\(/,end:/\)/,excludeBegin:!0,excludeEnd:!0,keywords:r,contains:w}]}]},{begin:/,/,relevance:0},{match:/\s+/,relevance:0},{variants:[{begin:i.begin,end:i.end},{match:l},{begin:a.begin,"on:begin":a.isTrulyOpeningTag,end:a.end}],subLanguage:"xml",contains:[{begin:a.begin,end:a.end,skip:!0,contains:["self"]}]}]},$,{beginKeywords:"while if switch catch for"},{begin:"\\b(?!function)"+e.UNDERSCORE_IDENT_RE+"\\([^()]*(\\([^()]*(\\([^()]*\\)[^()]*)*\\)[^()]*)*\\)\\s*\\{",returnBegin:!0,label:"func.def",contains:[y,e.inherit(e.TITLE_MODE,{begin:o,className:"title.function"})]},{match:/\.\.\./,relevance:0},F,{match:"\\$"+o,relevance:0},{match:[/\bconstructor(?=\s*\()/],className:{1:"title.function"},contains:[y]},W,U,D,Z,{match:/\$[(.]/}]}}function It(e){let n={className:"attr",begin:/"(\\.|[^\\"\r\n])*"(?=\s*:)/,relevance:1.01},t={match:/[{}[\],:]/,className:"punctuation",relevance:0},o=["true","false","null"],i={scope:"literal",beginKeywords:o.join(" ")};return{name:"JSON",aliases:["jsonc"],keywords:{literal:o},contains:[n,t,e.QUOTE_STRING_MODE,i,e.C_NUMBER_MODE,e.C_LINE_COMMENT_MODE,e.C_BLOCK_COMMENT_MODE],illegal:"\\S"}}function Ft(e){let n=e.regex,t={begin:/<\/?[A-Za-z_]/,end:">",subLanguage:"xml",relevance:0},o={begin:"^[-\\*]{3,}",end:"$"},i={className:"code",variants:[{begin:"(`{3,})[^`](.|\\n)*?\\1`*[ ]*"},{begin:"(~{3,})[^~](.|\\n)*?\\1~*[ ]*"},{begin:"```",end:"```+[ ]*$"},{begin:"~~~",end:"~~~+[ ]*$"},{begin:"`.+?`"},{begin:"(?=^( {4}|\\t))",contains:[{begin:"^( {4}|\\t)",end:"(\\n)$"}],relevance:0}]},l={className:"bullet",begin:"^[ 	]*([*+-]|(\\d+\\.))(?=\\s+)",end:"\\s+",excludeEnd:!0},a={begin:/^\[[^\n]+\]:/,returnBegin:!0,contains:[{className:"symbol",begin:/\[/,end:/\]/,excludeBegin:!0,excludeEnd:!0},{className:"link",begin:/:\s*/,end:/$/,excludeBegin:!0}]},r=/[A-Za-z][A-Za-z0-9+.-]*/,s={variants:[{begin:/\[.+?\]\[.*?\]/,relevance:0},{begin:/\[.+?\]\(((data|javascript|mailto):|(?:http|ftp)s?:\/\/).*?\)/,relevance:2},{begin:n.concat(/\[.+?\]\(/,r,/:\/\/.*?\)/),relevance:2},{begin:/\[.+?\]\([./?&#].*?\)/,relevance:1},{begin:/\[.*?\]\(.*?\)/,relevance:0}],returnBegin:!0,contains:[{match:/\[(?=\])/},{className:"string",relevance:0,begin:"\\[",end:"\\]",excludeBegin:!0,returnEnd:!0},{className:"link",relevance:0,begin:"\\]\\(",end:"\\)",excludeBegin:!0,excludeEnd:!0},{className:"symbol",relevance:0,begin:"\\]\\[",end:"\\]",excludeBegin:!0,excludeEnd:!0}]},c={className:"strong",contains:[],variants:[{begin:/_{2}(?!\s)/,end:/_{2}/},{begin:/\*{2}(?!\s)/,end:/\*{2}/}]},g={className:"emphasis",contains:[],variants:[{begin:/\*(?![*\s])/,end:/\*/},{begin:/_(?![_\s])/,end:/_/,relevance:0}]},E=e.inherit(c,{contains:[]}),b=e.inherit(g,{contains:[]});c.contains.push(b),g.contains.push(E);let m=[t,s];return[c,g,E,b].forEach(C=>{C.contains=C.contains.concat(m)}),m=m.concat(c,g),{name:"Markdown",aliases:["md","mkdown","mkd"],contains:[{className:"section",variants:[{begin:"^#{1,6}",end:"$",contains:m},{begin:"(?=^.+?\\n[=-]{2,}$)",contains:[{begin:"^[=-]*$"},{begin:"^",end:"\\n",contains:m}]}]},t,l,c,g,{className:"quote",begin:"^>\\s+",contains:m,end:"$"},i,o,s,a,{scope:"literal",match:/&([a-zA-Z0-9]+|#[0-9]{1,7}|#[Xx][0-9a-fA-F]{1,6});/}]}}function Ht(e){let n=e.regex,t=/[\p{XID_Start}_]\p{XID_Continue}*/u,o=["and","as","assert","async","await","break","case","class","continue","def","del","elif","else","except","finally","for","from","global","if","import","in","is","lambda","match","nonlocal|10","not","or","pass","raise","return","try","while","with","yield"],r={$pattern:/[A-Za-z]\w+|__\w+__/,keyword:o,built_in:["__import__","abs","all","any","ascii","bin","bool","breakpoint","bytearray","bytes","callable","chr","classmethod","compile","complex","delattr","dict","dir","divmod","enumerate","eval","exec","filter","float","format","frozenset","getattr","globals","hasattr","hash","help","hex","id","input","int","isinstance","issubclass","iter","len","list","locals","map","max","memoryview","min","next","object","oct","open","ord","pow","print","property","range","repr","reversed","round","set","setattr","slice","sorted","staticmethod","str","sum","super","tuple","type","vars","zip"],literal:["__debug__","Ellipsis","False","None","NotImplemented","True"],type:["Any","Callable","Coroutine","Dict","List","Literal","Generic","Optional","Sequence","Set","Tuple","Type","Union"]},s={className:"meta",begin:/^(>>>|\.\.\.) /},c={className:"subst",begin:/\{/,end:/\}/,keywords:r,illegal:/#/},g={begin:/\{\{/,relevance:0},E={className:"string",contains:[e.BACKSLASH_ESCAPE],variants:[{begin:/([uU]|[bB]|[rR]|[bB][rR]|[rR][bB])?'''/,end:/'''/,contains:[e.BACKSLASH_ESCAPE,s],relevance:10},{begin:/([uU]|[bB]|[rR]|[bB][rR]|[rR][bB])?"""/,end:/"""/,contains:[e.BACKSLASH_ESCAPE,s],relevance:10},{begin:/([fF][rR]|[rR][fF]|[fF])'''/,end:/'''/,contains:[e.BACKSLASH_ESCAPE,s,g,c]},{begin:/([fF][rR]|[rR][fF]|[fF])"""/,end:/"""/,contains:[e.BACKSLASH_ESCAPE,s,g,c]},{begin:/([uU]|[rR])'/,end:/'/,relevance:10},{begin:/([uU]|[rR])"/,end:/"/,relevance:10},{begin:/([bB]|[bB][rR]|[rR][bB])'/,end:/'/},{begin:/([bB]|[bB][rR]|[rR][bB])"/,end:/"/},{begin:/([fF][rR]|[rR][fF]|[fF])'/,end:/'/,contains:[e.BACKSLASH_ESCAPE,g,c]},{begin:/([fF][rR]|[rR][fF]|[fF])"/,end:/"/,contains:[e.BACKSLASH_ESCAPE,g,c]},e.APOS_STRING_MODE,e.QUOTE_STRING_MODE]},b="[0-9](_?[0-9])*",m=`(\\b(${b}))?\\.(${b})|\\b(${b})\\.`,v=`\\b|${o.join("|")}`,S={className:"number",relevance:0,variants:[{begin:`(\\b(${b})|(${m}))[eE][+-]?(${b})[jJ]?(?=${v})`},{begin:`(${m})[jJ]?`},{begin:`\\b([1-9](_?[0-9])*|0+(_?0)*)[lLjJ]?(?=${v})`},{begin:`\\b0[bB](_?[01])+[lL]?(?=${v})`},{begin:`\\b0[oO](_?[0-7])+[lL]?(?=${v})`},{begin:`\\b0[xX](_?[0-9a-fA-F])+[lL]?(?=${v})`},{begin:`\\b(${b})[jJ](?=${v})`}]},T={className:"comment",begin:n.lookahead(/# type:/),end:/$/,keywords:r,contains:[{begin:/# type:/},{begin:/#/,end:/\b\B/,endsWithParent:!0}]},C={className:"params",variants:[{className:"",begin:/\(\s*\)/,skip:!0},{begin:/\(/,end:/\)/,excludeBegin:!0,excludeEnd:!0,keywords:r,contains:["self",s,S,E,e.HASH_COMMENT_MODE]}]};return c.contains=[E,S,s],{name:"Python",aliases:["py","gyp","ipython"],unicodeRegex:!0,keywords:r,illegal:/(<\/|\?)|=>/,contains:[s,S,{scope:"variable.language",match:/\bself\b/},{beginKeywords:"if",relevance:0},{match:/\bor\b/,scope:"keyword"},E,T,e.HASH_COMMENT_MODE,{match:[/\bdef/,/\s+/,t],scope:{1:"keyword",3:"title.function"},contains:[C]},{variants:[{match:[/\bclass/,/\s+/,t,/\s*/,/\(\s*/,t,/\s*\)/]},{match:[/\bclass/,/\s+/,t]}],scope:{1:"keyword",3:"title.class",6:"title.class.inherited"}},{className:"meta",begin:/^[\t ]*@/,end:/(?=#)|$/,contains:[S,C,E]}]}}function Pt(e){let n=e.regex,t=/(r#)?/,o=n.concat(t,e.UNDERSCORE_IDENT_RE),i=n.concat(t,e.IDENT_RE),l={className:"title.function.invoke",relevance:0,begin:n.concat(/\b/,/(?!let|for|while|if|else|match\b)/,i,n.lookahead(/\s*\(/))},a="([ui](8|16|32|64|128|size)|f(32|64))?",r=["abstract","as","async","await","become","box","break","const","continue","crate","do","dyn","else","enum","extern","false","final","fn","for","if","impl","in","let","loop","macro","match","mod","move","mut","override","priv","pub","ref","return","self","Self","static","struct","super","trait","true","try","type","typeof","union","unsafe","unsized","use","virtual","where","while","yield"],s=["true","false","Some","None","Ok","Err"],c=["drop ","Copy","Send","Sized","Sync","Drop","Fn","FnMut","FnOnce","ToOwned","Clone","Debug","PartialEq","PartialOrd","Eq","Ord","AsRef","AsMut","Into","From","Default","Iterator","Extend","IntoIterator","DoubleEndedIterator","ExactSizeIterator","SliceConcatExt","ToString","assert!","assert_eq!","bitflags!","bytes!","cfg!","col!","concat!","concat_idents!","debug_assert!","debug_assert_eq!","env!","eprintln!","panic!","file!","format!","format_args!","include_bytes!","include_str!","line!","local_data_key!","module_path!","option_env!","print!","println!","select!","stringify!","try!","unimplemented!","unreachable!","vec!","write!","writeln!","macro_rules!","assert_ne!","debug_assert_ne!"],g=["i8","i16","i32","i64","i128","isize","u8","u16","u32","u64","u128","usize","f32","f64","str","char","bool","Box","Option","Result","String","Vec"];return{name:"Rust",aliases:["rs"],keywords:{$pattern:e.IDENT_RE+"!?",type:g,keyword:r,literal:s,built_in:c},illegal:"</",contains:[e.C_LINE_COMMENT_MODE,e.COMMENT("/\\*","\\*/",{contains:["self"]}),e.inherit(e.QUOTE_STRING_MODE,{begin:/b?"/,illegal:null}),{className:"symbol",begin:/'[a-zA-Z_][a-zA-Z0-9_]*(?!')/},{scope:"string",variants:[{begin:/b?r(#*)"(.|\n)*?"\1(?!#)/},{begin:/b?'/,end:/'/,contains:[{scope:"char.escape",match:/\\('|\w|x\w{2}|u\w{4}|U\w{8})/}]}]},{className:"number",variants:[{begin:"\\b0b([01_]+)"+a},{begin:"\\b0o([0-7_]+)"+a},{begin:"\\b0x([A-Fa-f0-9_]+)"+a},{begin:"\\b(\\d[\\d_]*(\\.[0-9_]+)?([eE][+-]?[0-9_]+)?)"+a}],relevance:0},{begin:[/fn/,/\s+/,o],className:{1:"keyword",3:"title.function"}},{className:"meta",begin:"#!?\\[",end:"\\]",contains:[{className:"string",begin:/"/,end:/"/,contains:[e.BACKSLASH_ESCAPE]}]},{begin:[/let/,/\s+/,/(?:mut\s+)?/,o],className:{1:"keyword",3:"keyword",4:"variable"}},{begin:[/for/,/\s+/,o,/\s+/,/in/],className:{1:"keyword",3:"variable",5:"keyword"}},{begin:[/type/,/\s+/,o],className:{1:"keyword",3:"title.class"}},{begin:[/(?:trait|enum|struct|union|impl|for)/,/\s+/,o],className:{1:"keyword",3:"title.class"}},{begin:e.IDENT_RE+"::",keywords:{keyword:"Self",built_in:c,type:g}},{className:"punctuation",begin:"->"},l]}}function $t(e){let n=e.regex,t=e.COMMENT("--","$"),o={scope:"string",variants:[{begin:/'/,end:/'/,contains:[{match:/''/}]}]},i={begin:/"/,end:/"/,contains:[{match:/""/}]},l=["true","false","unknown"],a=["double precision","large object","with timezone","without timezone"],r=["bigint","binary","blob","boolean","char","character","clob","date","dec","decfloat","decimal","float","int","integer","interval","nchar","nclob","national","numeric","real","row","smallint","time","timestamp","varchar","varying","varbinary"],s=["add","asc","collation","desc","final","first","last","view"],c=["abs","acos","all","allocate","alter","and","any","are","array","array_agg","array_max_cardinality","as","asensitive","asin","asymmetric","at","atan","atomic","authorization","avg","begin","begin_frame","begin_partition","between","bigint","binary","blob","boolean","both","by","call","called","cardinality","cascaded","case","cast","ceil","ceiling","char","char_length","character","character_length","check","classifier","clob","close","coalesce","collate","collect","column","commit","condition","connect","constraint","contains","convert","copy","corr","corresponding","cos","cosh","count","covar_pop","covar_samp","create","cross","cube","cume_dist","current","current_catalog","current_date","current_default_transform_group","current_path","current_role","current_row","current_schema","current_time","current_timestamp","current_path","current_role","current_transform_group_for_type","current_user","cursor","cycle","date","day","deallocate","dec","decimal","decfloat","declare","default","define","delete","dense_rank","deref","describe","deterministic","disconnect","distinct","double","drop","dynamic","each","element","else","empty","end","end_frame","end_partition","end-exec","equals","escape","every","except","exec","execute","exists","exp","external","extract","false","fetch","filter","first_value","float","floor","for","foreign","frame_row","free","from","full","function","fusion","get","global","grant","group","grouping","groups","having","hold","hour","identity","in","indicator","initial","inner","inout","insensitive","insert","int","integer","intersect","intersection","interval","into","is","join","json_array","json_arrayagg","json_exists","json_object","json_objectagg","json_query","json_table","json_table_primitive","json_value","lag","language","large","last_value","lateral","lead","leading","left","like","like_regex","listagg","ln","local","localtime","localtimestamp","log","log10","lower","match","match_number","match_recognize","matches","max","member","merge","method","min","minute","mod","modifies","module","month","multiset","national","natural","nchar","nclob","new","no","none","normalize","not","nth_value","ntile","null","nullif","numeric","octet_length","occurrences_regex","of","offset","old","omit","on","one","only","open","or","order","out","outer","over","overlaps","overlay","parameter","partition","pattern","per","percent","percent_rank","percentile_cont","percentile_disc","period","portion","position","position_regex","power","precedes","precision","prepare","primary","procedure","ptf","range","rank","reads","real","recursive","ref","references","referencing","regr_avgx","regr_avgy","regr_count","regr_intercept","regr_r2","regr_slope","regr_sxx","regr_sxy","regr_syy","release","result","return","returns","revoke","right","rollback","rollup","row","row_number","rows","running","savepoint","scope","scroll","search","second","seek","select","sensitive","session_user","set","show","similar","sin","sinh","skip","smallint","some","specific","specifictype","sql","sqlexception","sqlstate","sqlwarning","sqrt","start","static","stddev_pop","stddev_samp","submultiset","subset","substring","substring_regex","succeeds","sum","symmetric","system","system_time","system_user","table","tablesample","tan","tanh","then","time","timestamp","timezone_hour","timezone_minute","to","trailing","translate","translate_regex","translation","treat","trigger","trim","trim_array","true","truncate","uescape","union","unique","unknown","unnest","update","upper","user","using","value","values","value_of","var_pop","var_samp","varbinary","varchar","varying","versioning","when","whenever","where","width_bucket","window","with","within","without","year"],g=["abs","acos","array_agg","asin","atan","avg","cast","ceil","ceiling","coalesce","corr","cos","cosh","count","covar_pop","covar_samp","cume_dist","dense_rank","deref","element","exp","extract","first_value","floor","json_array","json_arrayagg","json_exists","json_object","json_objectagg","json_query","json_table","json_table_primitive","json_value","lag","last_value","lead","listagg","ln","log","log10","lower","max","min","mod","nth_value","ntile","nullif","percent_rank","percentile_cont","percentile_disc","position","position_regex","power","rank","regr_avgx","regr_avgy","regr_count","regr_intercept","regr_r2","regr_slope","regr_sxx","regr_sxy","regr_syy","row_number","sin","sinh","sqrt","stddev_pop","stddev_samp","substring","substring_regex","sum","tan","tanh","translate","translate_regex","treat","trim","trim_array","unnest","upper","value_of","var_pop","var_samp","width_bucket"],E=["current_catalog","current_date","current_default_transform_group","current_path","current_role","current_schema","current_transform_group_for_type","current_user","session_user","system_time","system_user","current_time","localtime","current_timestamp","localtimestamp"],b=["create table","insert into","primary key","foreign key","not null","alter table","add constraint","grouping sets","on overflow","character set","respect nulls","ignore nulls","nulls first","nulls last","depth first","breadth first"],m=g,v=[...c,...s].filter(w=>!g.includes(w)),S={scope:"variable",match:/@[a-z0-9][a-z0-9_]*/},T={scope:"operator",match:/[-+*/=%^~]|&&?|\|\|?|!=?|<(?:=>?|<|>)?|>[>=]?/,relevance:0},C={match:n.concat(/\b/,n.either(...m),/\s*\(/),relevance:0,keywords:{built_in:m}};function A(w){return n.concat(/\b/,n.either(...w.map(y=>y.replace(/\s+/,"\\s+"))),/\b/)}let j={scope:"keyword",match:A(b),relevance:0};function M(w,{exceptions:y,when:D}={}){let O=D;return y=y||[],w.map(L=>L.match(/\|\d+$/)||y.includes(L)?L:O(L)?`${L}|0`:L)}return{name:"SQL",case_insensitive:!0,illegal:/[{}]|<\//,keywords:{$pattern:/\b[\w\.]+/,keyword:M(v,{when:w=>w.length<3}),literal:l,type:r,built_in:E},contains:[{scope:"type",match:A(a)},j,C,S,o,i,e.C_NUMBER_MODE,e.C_BLOCK_COMMENT_MODE,t,T]}}var ye="[A-Za-z$_][0-9A-Za-z$_]*",Ut=["as","in","of","if","for","while","finally","var","new","function","do","return","void","else","break","catch","instanceof","with","throw","case","default","try","switch","continue","typeof","delete","let","yield","const","class","debugger","async","await","static","import","from","export","extends","using"],zt=["true","false","null","undefined","NaN","Infinity"],Gt=["Object","Function","Boolean","Symbol","Math","Date","Number","BigInt","String","RegExp","Array","Float32Array","Float64Array","Int8Array","Uint8Array","Uint8ClampedArray","Int16Array","Int32Array","Uint16Array","Uint32Array","BigInt64Array","BigUint64Array","Set","Map","WeakSet","WeakMap","ArrayBuffer","SharedArrayBuffer","Atomics","DataView","JSON","Promise","Generator","GeneratorFunction","AsyncFunction","Reflect","Proxy","Intl","WebAssembly"],qt=["Error","EvalError","InternalError","RangeError","ReferenceError","SyntaxError","TypeError","URIError"],Kt=["setInterval","setTimeout","clearInterval","clearTimeout","require","exports","eval","isFinite","isNaN","parseFloat","parseInt","decodeURI","decodeURIComponent","encodeURI","encodeURIComponent","escape","unescape"],Wt=["arguments","this","super","console","window","document","localStorage","sessionStorage","module","global"],Vt=[].concat(Kt,Gt,qt);function Co(e){let n=e.regex,t=(p,{after:N})=>{let R="</"+p[0].slice(1);return p.input.indexOf(R,N)!==-1},o=ye,i={begin:"<>",end:"</>"},l=/<[A-Za-z0-9\\._:-]+\s*\/>/,a={begin:/<[A-Za-z0-9\\._:-]+/,end:/\/[A-Za-z0-9\\._:-]+>|\/>/,isTrulyOpeningTag:(p,N)=>{let R=p[0].length+p.index,H=p.input[R];if(H==="<"||H===","){N.ignoreMatch();return}H===">"&&(t(p,{after:R})||N.ignoreMatch());let q,Y=p.input.substring(R);if(q=Y.match(/^\s*=/)){N.ignoreMatch();return}if((q=Y.match(/^\s+extends\s+/))&&q.index===0){N.ignoreMatch();return}}},r={$pattern:ye,keyword:Ut,literal:zt,built_in:Vt,"variable.language":Wt},s="[0-9](_?[0-9])*",c=`\\.(${s})`,g="0|[1-9](_?[0-9])*|0[0-7]*[89][0-9]*",E={className:"number",variants:[{begin:`(\\b(${g})((${c})|\\.)?|(${c}))[eE][+-]?(${s})\\b`},{begin:`\\b(${g})\\b((${c})\\b|\\.)?|(${c})\\b`},{begin:"\\b(0|[1-9](_?[0-9])*)n\\b"},{begin:"\\b0[xX][0-9a-fA-F](_?[0-9a-fA-F])*n?\\b"},{begin:"\\b0[bB][0-1](_?[0-1])*n?\\b"},{begin:"\\b0[oO][0-7](_?[0-7])*n?\\b"},{begin:"\\b0[0-7]+n?\\b"}],relevance:0},b={className:"subst",begin:"\\$\\{",end:"\\}",keywords:r,contains:[]},m={begin:".?html`",end:"",starts:{end:"`",returnEnd:!1,contains:[e.BACKSLASH_ESCAPE,b],subLanguage:"xml"}},v={begin:".?css`",end:"",starts:{end:"`",returnEnd:!1,contains:[e.BACKSLASH_ESCAPE,b],subLanguage:"css"}},S={begin:".?gql`",end:"",starts:{end:"`",returnEnd:!1,contains:[e.BACKSLASH_ESCAPE,b],subLanguage:"graphql"}},T={className:"string",begin:"`",end:"`",contains:[e.BACKSLASH_ESCAPE,b]},A={className:"comment",variants:[e.COMMENT(/\/\*\*(?!\/)/,"\\*/",{relevance:0,contains:[{begin:"(?=@[A-Za-z]+)",relevance:0,contains:[{className:"doctag",begin:"@[A-Za-z]+"},{className:"type",begin:"\\{",end:"\\}",excludeEnd:!0,excludeBegin:!0,relevance:0},{className:"variable",begin:o+"(?=\\s*(-)|$)",endsParent:!0,relevance:0},{begin:/(?=[^\n])\s/,relevance:0}]}]}),e.C_BLOCK_COMMENT_MODE,e.C_LINE_COMMENT_MODE]},j=[e.APOS_STRING_MODE,e.QUOTE_STRING_MODE,m,v,S,T,{match:/\$\d+/},E];b.contains=j.concat({begin:/\{/,end:/\}/,keywords:r,contains:["self"].concat(j)});let M=[].concat(A,b.contains),w=M.concat([{begin:/(\s*)\(/,end:/\)/,keywords:r,contains:["self"].concat(M)}]),y={className:"params",begin:/(\s*)\(/,end:/\)/,excludeBegin:!0,excludeEnd:!0,keywords:r,contains:w},D={variants:[{match:[/class/,/\s+/,o,/\s+/,/extends/,/\s+/,n.concat(o,"(",n.concat(/\./,o),")*")],scope:{1:"keyword",3:"title.class",5:"keyword",7:"title.class.inherited"}},{match:[/class/,/\s+/,o],scope:{1:"keyword",3:"title.class"}}]},O={relevance:0,match:n.either(/\bJSON/,/\b[A-Z][a-z]+([A-Z][a-z]*|\d)*/,/\b[A-Z]{2,}([A-Z][a-z]+|\d)+([A-Z][a-z]*)*/,/\b[A-Z]{2,}[a-z]+([A-Z][a-z]+|\d)*([A-Z][a-z]*)*/),className:"title.class",keywords:{_:[...Gt,...qt]}},L={label:"use_strict",className:"meta",relevance:10,begin:/^\s*['"]use (strict|asm)['"]/},$={variants:[{match:[/function/,/\s+/,o,/(?=\s*\()/]},{match:[/function/,/\s*(?=\()/]}],className:{1:"keyword",3:"title.function"},label:"func.def",contains:[y],illegal:/%/},U={relevance:0,match:/\b[A-Z][A-Z_0-9]+\b/,className:"variable.constant"};function G(p){return n.concat("(?!",p.join("|"),")")}let W={match:n.concat(/\b/,G([...Kt,"super","import"].map(p=>`${p}\\s*\\(`)),o,n.lookahead(/\s*\(/)),className:"title.function",relevance:0},F={begin:n.concat(/\./,n.lookahead(n.concat(o,/(?![0-9A-Za-z$_(])/))),end:o,excludeBegin:!0,keywords:"prototype",className:"property",relevance:0},Z={match:[/get|set/,/\s+/,o,/(?=\()/],className:{1:"keyword",3:"title.function"},contains:[{begin:/\(\)/},y]},d="(\\([^()]*(\\([^()]*(\\([^()]*\\)[^()]*)*\\)[^()]*)*\\)|"+e.UNDERSCORE_IDENT_RE+")\\s*=>",u={match:[/const|var|let/,/\s+/,o,/\s*/,/=\s*/,/(async\s*)?/,n.lookahead(d)],keywords:"async",className:{1:"keyword",3:"title.function"},contains:[y]};return{name:"JavaScript",aliases:["js","jsx","mjs","cjs"],keywords:r,exports:{PARAMS_CONTAINS:w,CLASS_REFERENCE:O},illegal:/#(?![$_A-z])/,contains:[e.SHEBANG({label:"shebang",binary:"node",relevance:5}),L,e.APOS_STRING_MODE,e.QUOTE_STRING_MODE,m,v,S,T,A,{match:/\$\d+/},E,O,{scope:"attr",match:o+n.lookahead(":"),relevance:0},u,{begin:"("+e.RE_STARTERS_RE+"|\\b(case|return|throw)\\b)\\s*",keywords:"return throw case",relevance:0,contains:[A,e.REGEXP_MODE,{className:"function",begin:d,returnBegin:!0,end:"\\s*=>",contains:[{className:"params",variants:[{begin:e.UNDERSCORE_IDENT_RE,relevance:0},{className:null,begin:/\(\s*\)/,skip:!0},{begin:/(\s*)\(/,end:/\)/,excludeBegin:!0,excludeEnd:!0,keywords:r,contains:w}]}]},{begin:/,/,relevance:0},{match:/\s+/,relevance:0},{variants:[{begin:i.begin,end:i.end},{match:l},{begin:a.begin,"on:begin":a.isTrulyOpeningTag,end:a.end}],subLanguage:"xml",contains:[{begin:a.begin,end:a.end,skip:!0,contains:["self"]}]}]},$,{beginKeywords:"while if switch catch for"},{begin:"\\b(?!function)"+e.UNDERSCORE_IDENT_RE+"\\([^()]*(\\([^()]*(\\([^()]*\\)[^()]*)*\\)[^()]*)*\\)\\s*\\{",returnBegin:!0,label:"func.def",contains:[y,e.inherit(e.TITLE_MODE,{begin:o,className:"title.function"})]},{match:/\.\.\./,relevance:0},F,{match:"\\$"+o,relevance:0},{match:[/\bconstructor(?=\s*\()/],className:{1:"title.function"},contains:[y]},W,U,D,Z,{match:/\$[(.]/}]}}function Zt(e){let n=e.regex,t=Co(e),o=ye,i=["any","void","number","boolean","string","object","never","symbol","bigint","unknown"],l={begin:[/namespace/,/\s+/,e.IDENT_RE],beginScope:{1:"keyword",3:"title.class"}},a={beginKeywords:"interface",end:/\{/,excludeEnd:!0,keywords:{keyword:"interface extends",built_in:i},contains:[t.exports.CLASS_REFERENCE]},r={className:"meta",relevance:10,begin:/^\s*['"]use strict['"]/},s=["type","interface","public","private","protected","implements","declare","abstract","readonly","enum","override","satisfies"],c={$pattern:ye,keyword:Ut.concat(s),literal:zt,built_in:Vt.concat(i),"variable.language":Wt},g={className:"meta",begin:"@"+o},E=(S,T,C)=>{let A=S.contains.findIndex(j=>j.label===T);if(A===-1)throw new Error("can not find mode to replace");S.contains.splice(A,1,C)};Object.assign(t.keywords,c),t.exports.PARAMS_CONTAINS.push(g);let b=t.contains.find(S=>S.scope==="attr"),m=Object.assign({},b,{match:n.concat(o,n.lookahead(/\s*\?:/))});t.exports.PARAMS_CONTAINS.push([t.exports.CLASS_REFERENCE,b,m]),t.contains=t.contains.concat([g,l,a,m]),E(t,"shebang",e.SHEBANG()),E(t,"use_strict",r);let v=t.contains.find(S=>S.label==="func.def");return v.relevance=0,Object.assign(t,{name:"TypeScript",aliases:["ts","tsx","mts","cts"]}),t}function Yt(e){let n=e.regex,t=n.concat(/[\p{L}_]/u,n.optional(/[\p{L}0-9_.-]*:/u),/[\p{L}0-9_.-]*/u),o=/[\p{L}0-9._:-]+/u,i={className:"symbol",begin:/&[a-z]+;|&#[0-9]+;|&#x[a-f0-9]+;/},l={begin:/\s/,contains:[{className:"keyword",begin:/#?[a-z_][a-z1-9_-]+/,illegal:/\n/}]},a=e.inherit(l,{begin:/\(/,end:/\)/}),r=e.inherit(e.APOS_STRING_MODE,{className:"string"}),s=e.inherit(e.QUOTE_STRING_MODE,{className:"string"}),c={endsWithParent:!0,illegal:/</,relevance:0,contains:[{className:"attr",begin:o,relevance:0},{begin:/=\s*/,relevance:0,contains:[{className:"string",endsParent:!0,variants:[{begin:/"/,end:/"/,contains:[i]},{begin:/'/,end:/'/,contains:[i]},{begin:/[^\s"'=<>`]+/}]}]}]};return{name:"HTML, XML",aliases:["html","xhtml","rss","atom","xjb","xsd","xsl","plist","wsf","svg"],case_insensitive:!0,unicodeRegex:!0,contains:[{className:"meta",begin:/<![a-z]/,end:/>/,relevance:10,contains:[l,s,r,a,{begin:/\[/,end:/\]/,contains:[{className:"meta",begin:/<![a-z]/,end:/>/,contains:[l,a,s,r]}]}]},e.COMMENT(/<!--/,/-->/,{relevance:10}),{begin:/<!\[CDATA\[/,end:/\]\]>/,relevance:10},i,{className:"meta",end:/\?>/,variants:[{begin:/<\?xml/,relevance:10,contains:[s]},{begin:/<\?[a-z][a-z0-9]+/}]},{className:"tag",begin:/<style(?=\s|>)/,end:/>/,keywords:{name:"style"},contains:[c],starts:{end:/<\/style>/,returnEnd:!0,subLanguage:["css","xml"]}},{className:"tag",begin:/<script(?=\s|>)/,end:/>/,keywords:{name:"script"},contains:[c],starts:{end:/<\/script>/,returnEnd:!0,subLanguage:["javascript","handlebars","xml"]}},{className:"tag",begin:/<>|<\/>/},{className:"tag",begin:n.concat(/</,n.lookahead(n.concat(t,n.either(/\/>/,/>/,/\s/)))),end:/\/?>/,contains:[{className:"name",begin:t,relevance:0,starts:c}]},{className:"tag",begin:n.concat(/<\//,n.lookahead(n.concat(t,/>/))),contains:[{className:"name",begin:t,relevance:0},{begin:/>/,relevance:0,endsParent:!0}]}]}}function Xt(e){let n="true false yes no null",t="[\\w#;/?:@&=+$,.~*'()[\\]]+",o={className:"attr",variants:[{begin:/[\w*@][\w*@ :()\./-]*:(?=[ \t]|$)/},{begin:/"[\w*@][\w*@ :()\./-]*":(?=[ \t]|$)/},{begin:/'[\w*@][\w*@ :()\./-]*':(?=[ \t]|$)/}]},i={className:"template-variable",variants:[{begin:/\{\{/,end:/\}\}/},{begin:/%\{/,end:/\}/}]},l={className:"string",relevance:0,begin:/'/,end:/'/,contains:[{match:/''/,scope:"char.escape",relevance:0}]},a={className:"string",relevance:0,variants:[{begin:/"/,end:/"/},{begin:/\S+/}],contains:[e.BACKSLASH_ESCAPE,i]},r=e.inherit(a,{variants:[{begin:/'/,end:/'/,contains:[{begin:/''/,relevance:0}]},{begin:/"/,end:/"/},{begin:/[^\s,{}[\]]+/}]}),b={className:"number",begin:"\\b"+"[0-9]{4}(-[0-9][0-9]){0,2}"+"([Tt \\t][0-9][0-9]?(:[0-9][0-9]){2})?"+"(\\.[0-9]*)?"+"([ \\t])*(Z|[-+][0-9][0-9]?(:[0-9][0-9])?)?"+"\\b"},m={end:",",endsWithParent:!0,excludeEnd:!0,keywords:n,relevance:0},v={begin:/\{/,end:/\}/,contains:[m],illegal:"\\n",relevance:0},S={begin:"\\[",end:"\\]",contains:[m],illegal:"\\n",relevance:0},T=[o,{className:"meta",begin:"^---\\s*$",relevance:10},{className:"string",begin:"[\\|>]([1-9]?[+-])?[ ]*\\n( +)[^ ][^\\n]*\\n(\\2[^\\n]+\\n?)*"},{begin:"<%[%=-]?",end:"[%-]?%>",subLanguage:"ruby",excludeBegin:!0,excludeEnd:!0,relevance:0},{className:"type",begin:"!\\w+!"+t},{className:"type",begin:"!<"+t+">"},{className:"type",begin:"!"+t},{className:"type",begin:"!!"+t},{className:"meta",begin:"&"+e.UNDERSCORE_IDENT_RE+"$"},{className:"meta",begin:"\\*"+e.UNDERSCORE_IDENT_RE+"$"},{className:"bullet",begin:"-(?=[ ]|$)",relevance:0},e.HASH_COMMENT_MODE,{beginKeywords:n,keywords:{literal:n}},b,{className:"number",begin:e.C_NUMBER_RE+"\\b",relevance:0},v,S,l,a],C=[...T];return C.pop(),C.push(r),m.contains=C,{name:"YAML",case_insensitive:!0,aliases:["yml"],contains:T}}P.registerLanguage("bash",vt);P.registerLanguage("c",xt);P.registerLanguage("cpp",Nt);P.registerLanguage("css",Ct);P.registerLanguage("go",kt);P.registerLanguage("java",Ot);P.registerLanguage("javascript",jt);P.registerLanguage("json",It);P.registerLanguage("markdown",Ft);P.registerLanguage("python",Ht);P.registerLanguage("rust",Pt);P.registerLanguage("sql",$t);P.registerLanguage("typescript",Zt);P.registerLanguage("xml",Yt);P.registerLanguage("yaml",Xt);var Te={A4:{w:794,h:1123},A3:{w:1123,h:1587},Letter:{w:816,h:1056},Legal:{w:816,h:1344},A5:{w:559,h:794}},xe={default:{name:"Default",fontFamily:"Georgia, serif",fontSize:13,lineHeight:1.85,paragraphSpacing:.65,headingScale:1,accentColor:"#7c6af7",bodyColor:"#1a1a2e",headingColor:"#0d0d1a",h1BorderBottom:!1,h2BorderBottom:!0,centerH1:!1,blockquoteBg:"transparent",blockquoteBorderColor:"#7c6af7",codeBackground:"#f0f0f8",codeFontSize:.85,codeTheme:"github",tableHeaderBg:"#f0f0f8",tableStriped:!0,pageBackground:"#ffffff",marginTop:20,marginBottom:20,marginLeft:25,marginRight:25},minimal:{name:"Minimal",fontFamily:"'Helvetica Neue', Helvetica, sans-serif",fontSize:12,lineHeight:1.6,paragraphSpacing:.45,headingScale:.88,accentColor:"#333",bodyColor:"#222",headingColor:"#111",h1BorderBottom:!1,h2BorderBottom:!1,centerH1:!1,blockquoteBg:"#f8f8f8",blockquoteBorderColor:"#ccc",codeBackground:"#f4f4f4",codeFontSize:.82,codeTheme:"github",tableHeaderBg:"#efefef",tableStriped:!1,pageBackground:"#ffffff",marginTop:16,marginBottom:16,marginLeft:20,marginRight:20},academic:{name:"Academic",fontFamily:"'Times New Roman', Times, serif",fontSize:12,lineHeight:2,paragraphSpacing:0,headingScale:.95,accentColor:"#1a3a6b",bodyColor:"#000",headingColor:"#000",h1BorderBottom:!0,h2BorderBottom:!0,centerH1:!0,blockquoteBg:"transparent",blockquoteBorderColor:"#999",codeBackground:"#f9f9f9",codeFontSize:.88,codeTheme:"github",tableHeaderBg:"#e8e8e8",tableStriped:!1,pageBackground:"#ffffff",marginTop:25,marginBottom:25,marginLeft:30,marginRight:30},colorful:{name:"Colorful",fontFamily:"Georgia, serif",fontSize:13,lineHeight:1.85,paragraphSpacing:.65,headingScale:1.05,accentColor:"#e84393",bodyColor:"#1a1a2e",headingColor:"#2d0a4e",h1BorderBottom:!1,h2BorderBottom:!1,centerH1:!1,blockquoteBg:"#fdf0f8",blockquoteBorderColor:"#e84393",codeBackground:"#f0eaff",codeFontSize:.85,codeTheme:"tokyo-night-light",tableHeaderBg:"#2d0a4e",tableStriped:!0,pageBackground:"#ffffff",marginTop:20,marginBottom:20,marginLeft:25,marginRight:25},modern:{name:"Modern",fontFamily:"Arial, sans-serif",fontSize:13,lineHeight:1.75,paragraphSpacing:.6,headingScale:1,accentColor:"#0070f3",bodyColor:"#111",headingColor:"#000",h1BorderBottom:!1,h2BorderBottom:!1,centerH1:!1,blockquoteBg:"#f0f7ff",blockquoteBorderColor:"#0070f3",codeBackground:"#f1f5f9",codeFontSize:.85,codeTheme:"atom-one-light",tableHeaderBg:"#0070f3",tableStriped:!0,pageBackground:"#ffffff",marginTop:20,marginBottom:20,marginLeft:25,marginRight:25},newspaper:{name:"Newspaper",fontFamily:"Georgia, serif",fontSize:12,lineHeight:1.7,paragraphSpacing:.4,headingScale:1.1,accentColor:"#111",bodyColor:"#111",headingColor:"#000",h1BorderBottom:!0,h2BorderBottom:!0,centerH1:!0,blockquoteBg:"transparent",blockquoteBorderColor:"#111",codeBackground:"#f4f4f4",codeFontSize:.82,codeTheme:"github",tableHeaderBg:"#111",tableStriped:!1,pageBackground:"#ffffff",marginTop:18,marginBottom:18,marginLeft:20,marginRight:20},dark:{name:"Dark",fontFamily:"Georgia, serif",fontSize:13,lineHeight:1.85,paragraphSpacing:.65,headingScale:1,accentColor:"#818cf8",bodyColor:"#d1d5db",headingColor:"#f1f5f9",h1BorderBottom:!1,h2BorderBottom:!0,centerH1:!1,blockquoteBg:"#1e293b",blockquoteBorderColor:"#818cf8",codeBackground:"#0f172a",codeFontSize:.85,codeTheme:"atom-one-dark",tableHeaderBg:"#1e293b",tableStriped:!0,pageBackground:"#111827",marginTop:20,marginBottom:20,marginLeft:25,marginRight:25}},ko={pageSize:"A4",orientation:"portrait",preset:"default",...xe.default,headerText:"",footerText:"",showHeader:!0,showFooter:!0,showFooterBorder:!1,showPageNumbers:!0,pageNumberPosition:"right",pageNumberStart:1,showHeaderFooterOnFirstPage:!0,headerAlignment:"right",hideFrontmatter:!1,customFontName:"",autoBreakH1:!1,autoBreakH2:!1,includeFilenameAsTitle:!1,previewScale:.9},we=e=>e/25.4*96;function re(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function Ao(e){return e.replace(/<\/style/gi,"<\\/style")}var Mo=/[\u0590-\u08FF\uFB1D-\uFDFD\uFE70-\uFEFC]/g,Oo=/[A-Za-z\u0590-\u08FF\uFB1D-\uFDFD\uFE70-\uFEFC]/g;function Ro(e){let n=(e.match(Mo)??[]).length,t=(e.match(Oo)??[]).length;return t>0&&n/t>.1}function Lo(e){return e.replace(/\r\n/g,`
`)}function Bo(e){return e.replace(/^---[ \t]*\r?\n[\s\S]*?\r?\n---[ \t]*(\r?\n|$)/,"")}function Do(e){return e.split(/^\/\/\/\s*$/m).map(n=>n.trim()).filter(Boolean)}async function jo(e,n,t,o){let i=activeDocument.createElement("div");i.setCssStyles({position:"fixed",top:"0",left:"-99999px",visibility:"hidden",pointerEvents:"none"}),activeDocument.body.appendChild(i);try{await f.MarkdownRenderer.render(e,n,i,t,o),await Po(i)}finally{activeDocument.body.removeChild(i)}return Fo(i),i}function Io(e){return e.toLowerCase().replace(/[^\p{L}\p{N}\s-]/gu,"").trim().replace(/\s+/g,"-").replace(/-+/g,"-")}function Fo(e){let n=new Map;e.querySelectorAll("h1,h2,h3,h4,h5,h6").forEach(t=>{let o=t.textContent||"",i=Io(o);if(!i)return;let l=n.get(i)??0;n.set(i,l+1),t.id=l===0?i:`${i}-${l}`}),e.querySelectorAll("a").forEach(t=>{t.classList.remove("external-link")}),e.querySelectorAll(".copy-code-button").forEach(t=>t.remove()),e.querySelectorAll(".callout").forEach(t=>{t.removeAttribute("data-callout-fold"),t.classList.remove("is-collapsed"),t.querySelectorAll(".callout-fold").forEach(o=>o.remove())}),e.querySelectorAll("style, script").forEach(t=>{t.closest("svg")||t.remove()}),e.querySelectorAll("pre code").forEach(Jt)}function Jt(e){let n=Array.from(e.classList).find(i=>i.startsWith("language-"))?.replace("language-",""),t=e.textContent??"",o=n&&P.getLanguage(n)?P.highlight(t,{language:n}):P.highlightAuto(t);e.innerHTML=o.value,e.classList.add("hljs")}function Ho(e,n){return e.replace(/\/\*[\s\S]*?\*\//g,"").replace(/([^{}]+)\{/g,(t,o)=>o.split(",").map(i=>i.trim()?`${n} ${i.trim()}`:i).join(", ")+" {")}async function Po(e){let n=Array.from(e.querySelectorAll(".mermaid"));if(n.length===0)return;let t=5e3;await Promise.all(n.map(o=>new Promise(i=>{if(o.querySelector("svg")){i();return}let l=window.setTimeout(()=>{a.disconnect(),i()},t),a=new MutationObserver(()=>{o.querySelector("svg")&&(window.clearTimeout(l),a.disconnect(),i())});a.observe(o,{childList:!0,subtree:!0})})))}function $o(e){let n=e.replace(/^#([\da-f])([\da-f])([\da-f])$/i,(a,r,s,c)=>`#${r}${r}${s}${s}${c}${c}`);if(!/^#[\da-f]{6}$/i.test(n))return 1;let t=a=>a<=.04045?a/12.92:((a+.055)/1.055)**2.4,o=t(parseInt(n.slice(1,3),16)/255),i=t(parseInt(n.slice(3,5),16)/255),l=t(parseInt(n.slice(5,7),16)/255);return .2126*o+.7152*i+.0722*l}function Uo(e,n=!1){let t=e.headingScale,o=e.fontFamily==="__custom__"?e.customFontName.trim()||"inherit":e.fontFamily,i=$o(e.tableHeaderBg)<.35?"#fff":e.headingColor,l=Ho(be[e.codeTheme]?.css??"",".mpdf-doc");return`
  .mpdf-doc {
    font-family: ${o};
    font-size: ${e.fontSize}px;
    line-height: ${e.lineHeight};
    color: ${e.bodyColor};
    box-sizing: border-box;
    ${n?"direction: rtl;":""}
  }
  .mpdf-doc *, .mpdf-doc *::before, .mpdf-doc *::after { box-sizing: border-box; }
  .mpdf-doc strong, .mpdf-doc b { font-weight: 700; font-style: normal; }
  .mpdf-doc em, .mpdf-doc i { font-style: italic; font-weight: inherit; }
  .mpdf-doc mark { background: #ffe066; color: inherit; padding: 0 2px; border-radius: 2px; }
  .mpdf-doc del, .mpdf-doc s { text-decoration: line-through; }
  .mpdf-doc h1 {
    font-size: ${Math.round(22*t)}px;
    font-weight: 700;
    color: ${e.headingColor};
    margin: 0 0 ${Math.round(12*t)}px;
    line-height: 1.2;
    ${e.h1BorderBottom?`border-bottom: 2px solid ${e.accentColor}; padding-bottom: 6px;`:""}
    ${e.centerH1?"text-align: center;":""}
  }
  .mpdf-doc h2 {
    font-size: ${Math.round(17*t)}px;
    font-weight: 600;
    color: ${e.headingColor};
    margin: ${Math.round(20*t)}px 0 ${Math.round(10*t)}px;
    ${e.h2BorderBottom?`border-bottom: 0.5px solid ${e.accentColor}55; padding-bottom: 5px;`:""}
  }
  .mpdf-doc h3 {
    font-size: ${Math.round(15*t)}px;
    font-weight: 700;
    color: ${e.headingColor};
    margin: ${Math.round(16*t)}px 0 ${Math.round(8*t)}px;
    letter-spacing: 0.01em;
  }
  .mpdf-doc h4 { font-size: ${Math.round(13*t)}px; font-weight: 700; color: ${e.headingColor}; margin: 12px 0 6px; text-transform: uppercase; letter-spacing: 0.04em; }
  .mpdf-doc h5 { font-size: ${Math.round(12*t)}px; font-weight: 600; color: ${e.headingColor}; margin: 10px 0 4px; font-style: italic; }
  .mpdf-doc h6 { font-size: ${Math.round(11*t)}px; font-weight: 600; color: ${e.bodyColor}; margin: 8px 0 4px; font-style: italic; opacity: 0.75; }
  .mpdf-doc p { margin: 0 0 ${e.paragraphSpacing}em; }
  .mpdf-doc ul, .mpdf-doc ol { padding-inline-start: 1.4em; margin: 0 0 ${e.paragraphSpacing}em; }
  .mpdf-doc li { margin-bottom: 0.2em; line-height: ${e.lineHeight}; }
  .mpdf-doc blockquote {
    border-inline-start: 3px solid ${e.blockquoteBorderColor};
    background: ${e.blockquoteBg};
    padding-block: 4px;
    padding-inline: 1em 0;
    margin: ${e.paragraphSpacing}em 0;
    font-style: italic;
    color: ${e.bodyColor}cc;
  }
  .mpdf-doc code {
    font-family: 'Courier New', monospace;
    font-size: ${e.codeFontSize}em;
    background: ${e.codeBackground};
    padding: 1px 4px;
    border-radius: 3px;
    color: ${e.accentColor};
  }
  .mpdf-doc pre {
    background: ${e.codeBackground};
    border-radius: 4px;
    padding: 10px 12px;
    margin: 0 0 ${e.paragraphSpacing}em;
    overflow: hidden;
    print-color-adjust: exact;
    -webkit-print-color-adjust: exact;
  }
  .mpdf-doc pre code {
    font-family: 'Courier New', monospace;
    font-size: ${e.codeFontSize}em;
    color: inherit;
    white-space: pre-wrap;
    word-break: break-all;
    background: none;
    padding: 0;
  }
  ${l}
  /* Neutralize the theme's own .hljs background/padding (specificity 0,2,0)
     so the block background stays under codeBackground (on the <pre>). The
     theme still governs token + default text colours. */
  .mpdf-doc pre code.hljs {
    background: none;
    padding: 0;
  }
  .mpdf-doc hr {
    border: none;
    border-top: 0.5px solid ${e.accentColor}44;
    margin: ${e.paragraphSpacing*1.5}em 0;
  }
  .mpdf-doc img { max-width: 100%; height: auto; display: block; margin: ${e.paragraphSpacing}em auto; }
  .mpdf-doc a { color: ${e.accentColor}; }
  .mpdf-doc a.external-link::after { display: none !important; content: none !important; }
  /* Hide copy-code buttons that survive postProcessRenderedHTML (e.g. re-injected by themes). */
  .mpdf-doc .copy-code-button { display: none !important; }
  .mpdf-doc table { width: 100%; border-collapse: collapse; margin: 0 0 ${e.paragraphSpacing}em; font-size: 0.92em; }
  .mpdf-doc th {
    background: ${e.tableHeaderBg};
    color: ${i};
    padding: 6px 10px;
    text-align: start;
    font-weight: 600;
    border: 0.5px solid ${e.accentColor}33;
    font-size: 0.9em;
  }
  .mpdf-doc td { padding: 5px 10px; border: 0.5px solid ${e.bodyColor}22; vertical-align: top; }
  ${e.tableStriped?`.mpdf-doc tbody tr:nth-child(even) { background: ${e.tableHeaderBg}55; }`:""}

  /* Callouts \u2014 override theme styles with !important so preview and export are
   * identical regardless of the active Obsidian theme. */
  .mpdf-doc .callout {
    border-inline-start: 4px solid ${e.accentColor} !important;
    border-start-start-radius: 0 !important;
    border-start-end-radius: 5px !important;
    border-end-end-radius: 5px !important;
    border-end-start-radius: 0 !important;
    background: ${e.accentColor}12 !important;
    margin: ${e.paragraphSpacing*1.2}em 0 !important;
    padding: 0 !important;
    overflow: hidden !important;
    box-shadow: inset 0 0 0 1px ${e.accentColor}22 !important;
    font-style: normal !important;
  }
  .mpdf-doc .callout-title {
    display: flex !important;
    align-items: center !important;
    gap: 7px !important;
    padding: 7px 12px !important;
    background: ${e.accentColor}28 !important;
    border-bottom: 1px solid ${e.accentColor}33 !important;
    font-family: ${o} !important;
    font-size: 0.8em !important;
    font-weight: 800 !important;
    font-style: normal !important;
    letter-spacing: 0.08em !important;
    text-transform: uppercase !important;
    color: ${e.accentColor} !important;
    line-height: 1.3 !important;
  }
  .mpdf-doc .callout-icon {
    display: inline-flex !important;
    align-items: center !important;
    flex-shrink: 0 !important;
    width: 15px !important;
    height: 15px !important;
    color: ${e.accentColor} !important;
  }
  .mpdf-doc .callout-icon svg {
    width: 15px !important;
    height: 15px !important;
    stroke: ${e.accentColor} !important;
    fill: none !important;
    stroke-width: 2 !important;
  }
  .mpdf-doc .callout-title-inner {
    flex: 1 !important;
    min-width: 0 !important;
  }
  .mpdf-doc .callout-fold { display: none !important; }
  .mpdf-doc .callout-content {
    padding: 9px 14px !important;
    color: ${e.bodyColor} !important;
    font-style: normal !important;
    background: transparent !important;
  }
  .mpdf-doc .callout-content > p:first-child { margin-top: 0 !important; }
  .mpdf-doc .callout-content > p:last-child  { margin-bottom: 0 !important; }
  /* Nested blockquotes inside callout content keep a subtler indent */
  .mpdf-doc .callout-content blockquote {
    border-inline-start-color: ${e.accentColor}66 !important;
    background: transparent !important;
  }

  /* Mermaid diagrams \u2014 centre the SVG and prevent it overflowing the content
   * column.  The <style> block inside the SVG is intentionally left untouched;
   * mermaid embeds its own theme CSS there. */
  .mpdf-doc .mermaid {
    display: flex;
    justify-content: center;
    margin: ${e.paragraphSpacing}em 0;
    overflow: hidden;
  }
  .mpdf-doc .mermaid svg {
    max-width: 100%;
    height: auto;
    display: block;
  }
  `.trim()}function zo(e){return{name:e.name,fontFamily:e.fontFamily,fontSize:e.fontSize,lineHeight:e.lineHeight,paragraphSpacing:e.paragraphSpacing,headingScale:e.headingScale,accentColor:e.accentColor,bodyColor:e.bodyColor,headingColor:e.headingColor,h1BorderBottom:e.h1BorderBottom,h2BorderBottom:e.h2BorderBottom,centerH1:e.centerH1,blockquoteBg:e.blockquoteBg,blockquoteBorderColor:e.blockquoteBorderColor,codeBackground:e.codeBackground,codeFontSize:e.codeFontSize,codeTheme:e.codeTheme,tableHeaderBg:e.tableHeaderBg,tableStriped:e.tableStriped,pageBackground:e.pageBackground,marginTop:e.marginTop,marginBottom:e.marginBottom,marginLeft:e.marginLeft,marginRight:e.marginRight}}function Go(){return Array.from(activeDocument.head.querySelectorAll("style[id^='MJX-']")).map(e=>e.textContent??"").join(`
`)}var qo=new Set(["P","LI","BLOCKQUOTE","TD","TH"]),Ko=new Set(["P","DIV","SECTION","ARTICLE","ASIDE","NAV","HEADER","FOOTER","UL","OL","LI","TABLE","THEAD","TBODY","TFOOT","TR","TD","TH","PRE","BLOCKQUOTE","HR","IMG","H1","H2","H3","H4","H5","H6"]),Wo=new Set(["CODE","IMG","HR","H1","H2","H3","H4","H5","H6"]),Vo=2;function Zo(e,n){n.empty();for(let t of e)n.appendChild(t.cloneNode(!0));return n.getBoundingClientRect().height}function Yo(e,n,t){return o=>Zo([...e,o],n)<=t-Vo}function Xo(e){let n=activeDocument.createTreeWalker(e,NodeFilter.SHOW_TEXT);for(;n.nextNode();){let t=n.currentNode,o=(t.textContent??"").replace(/^\s+/,"");if(o!==t.textContent&&(t.textContent=o),o.length>0)break}}function Se(e,n){let t=activeDocument.createTreeWalker(e,NodeFilter.SHOW_TEXT),o=0,i=null,l=0;for(;t.nextNode();){let g=t.currentNode,E=g.textContent?.length??0;if(o+E>=n){i=g,l=n-o;break}o+=E}if(!i)return null;let a=activeDocument.createRange();a.selectNodeContents(e),a.setEnd(i,l);let r=activeDocument.createRange();r.selectNodeContents(e),r.setStart(i,l);let s=e.cloneNode(!1);s.appendChild(a.cloneContents());let c=e.cloneNode(!1);return c.appendChild(r.cloneContents()),Xo(c),[s,c]}function Jo(e){let n=[],t=/\s+/g,o;for(;o=t.exec(e);)o.index>0&&o.index<e.length&&n.push(o.index);return n}function Qo(e,n,t){let o=e.textContent??"";if(o.length<2)return null;let i=Jo(o);if(i.length>0){let s=0,c=i.length-1,g=-1;for(;s<=c;){let E=Math.floor((s+c)/2),b=Se(e,i[E]);if(!b){c=E-1;continue}n(b[0])?(g=E,s=E+1):c=E-1}if(g>=0)return Se(e,i[g]);if(!t)return null}let l=1,a=o.length-1,r=0;for(;l<=a;){let s=Math.floor((l+a)/2),c=Se(e,s);if(!c){a=s-1;continue}n(c[0])?(r=s,l=s+1):a=s-1}return r>0?Se(e,r):null}function Ie(e,n,t){let o=e.cloneNode(!1);e.tagName==="OL"&&t!==void 0&&t>1&&(o.start=t);for(let i of n)o.appendChild(i.cloneNode(!0));return o}function er(e,n,t){let o=Array.from(e.children).filter(a=>a.tagName==="LI");if(o.length===0)return null;let i=e.tagName==="OL"?e.start??1:1,l=0;for(let a=0;a<o.length&&n(Ie(e,o.slice(0,a+1),i));a++)l=a+1;if(l<=0){if(!t||o.length<2)return null;l=1}return l>=o.length?null:[Ie(e,o.slice(0,l),i),Ie(e,o.slice(l),i+l)]}function Fe(e,n){let t=e.cloneNode(!1),o=e.querySelector("caption");o&&t.appendChild(o.cloneNode(!0));let i=e.querySelector("colgroup");i&&t.appendChild(i.cloneNode(!0)),e.tHead&&t.appendChild(e.tHead.cloneNode(!0));let l=activeDocument.createElement("tbody");for(let a of n)l.appendChild(a.cloneNode(!0));return t.appendChild(l),t}function tr(e,n,t){let o=e.tBodies[0],i=o?Array.from(o.rows):Array.from(e.rows).filter(a=>a.parentElement?.tagName!=="THEAD");if(i.length===0)return null;let l=0;for(let a=0;a<i.length&&n(Fe(e,i.slice(0,a+1)));a++)l=a+1;if(l<=0){if(!t||i.length<2)return null;l=1}return l>=i.length?null:[Fe(e,i.slice(0,l)),Fe(e,i.slice(l))]}function He(e,n){let t=e.cloneNode(!1),o=e.querySelector("code");if(o){let i=o.cloneNode(!1);i.textContent=n.join(`
`),t.appendChild(i)}else t.textContent=n.join(`
`);return t}function nr(e,n,t){let o=(e.textContent??"").split(`
`);if(o.length>1&&o[o.length-1]===""&&o.pop(),o.length<2)return null;let i=0;for(let r=0;r<o.length&&n(He(e,o.slice(0,r+1)));r++)i=r+1;if(i<=0){if(!t||o.length<2)return null;i=1}if(i>=o.length)return null;let l=He(e,o.slice(0,i)),a=He(e,o.slice(i));for(let r of[l,a]){let s=r.querySelector("code");s&&Jt(s)}return[l,a]}function or(e){if(!qo.has(e.tagName))return!1;for(let n of Array.from(e.childNodes))if(n.nodeType===Node.ELEMENT_NODE&&Ko.has(n.tagName))return!1;return!0}function rr(e,n,t){return Wo.has(e.tagName)?null:e.tagName==="PRE"?nr(e,n,t):e.tagName==="TABLE"?tr(e,n,t):e.tagName==="UL"||e.tagName==="OL"?er(e,n,t):or(e)?Qo(e,n,t):null}function ar(e,n,t,o){let i=activeDocument.createElement("div");i.setCssStyles({position:"fixed",top:"0",left:"-99999px",width:`${n}px`,visibility:"hidden",pointerEvents:"none",zIndex:"-1"});let l=i.attachShadow({mode:"open"}),a=new CSSStyleSheet;a.replaceSync(o),l.adoptedStyleSheets=[a];let r=activeDocument.createElement("div");r.className="mpdf-doc";for(let g of Array.from(e.children))r.appendChild(g.cloneNode(!0));l.appendChild(r);let s=activeDocument.createElement("div");s.className="mpdf-doc",s.setCssStyles({position:"absolute",top:"0",left:"0",width:`${n}px`,visibility:"hidden"}),l.appendChild(s),activeDocument.body.appendChild(i);let c=[];try{let g=[],E=Array.from(r.children),b=0;for(;b<E.length;){let m=E[b],v=Yo(g,s,t);if(v(m)){g.push(m.cloneNode(!0)),b++;continue}let S=g.length===0,T=rr(m,v,S);if(T){g.push(T[0]),c.push(g),g=[];let C=T[1];C.textContent?.trim()||C.children.length>0?E[b]=C:b++;continue}if(g.length>0){c.push(g),g=[];continue}g.push(m.cloneNode(!0)),c.push(g),g=[],b++}g.length>0&&c.push(g)}finally{activeDocument.body.removeChild(i)}return c.length>0?c:[[]]}function ir(e,n){let t=e.length;return e.map((o,i)=>{let l=i+1,a=n.showHeaderFooterOnFirstPage||i>0,r=n.showHeaderFooterOnFirstPage?n.pageNumberStart+i:n.pageNumberStart+(i-1),s=n.showHeaderFooterOnFirstPage?n.pageNumberStart+t-1:n.pageNumberStart+t-2,c=`${r} / ${s}`,g="",E="",b="",m="",v="",S="";return a&&(n.showPageNumbers?n.pageNumberPosition==="center"?b=(n.footerText?n.footerText+" \u2014 ":"")+c:n.pageNumberPosition==="left"?(g=c,E=n.footerText??""):(g=n.footerText??"",E=c):g=n.footerText??"",n.headerText&&(n.headerAlignment==="center"?v=n.headerText:n.headerAlignment==="left"?m=n.headerText:S=n.headerText)),{pageNodes:o,pageNum:l,totalPages:t,headerLeft:m,headerCenter:v,headerRight:S,footerLeft:g,footerRight:E,footerCenter:b}})}var ve=class extends f.Plugin{activeModal=null;presetSnapshots={};async onload(){await this.loadSettings(),this.addCommand({id:"open-panel",name:"Open Panel",callback:()=>this.openModal()}),this.registerEvent(this.app.workspace.on("file-menu",(n,t)=>{!(t instanceof f.TFile)||t.extension!=="md"||n.addItem(o=>o.setTitle("Advanced PDF Export: Open Panel").setIcon("file-output").onClick(()=>this.openModal(t)))})),this.addSettingTab(new $e(this.app,this))}onunload(){this.activeModal?.close()}openModal(n){this.activeModal&&this.activeModal.close(),new Pe(this.app,this,n).open()}async loadSettings(){let n=await this.loadData()??{};this.settings=Object.assign({},ko,n),this.presetSnapshots=n.presetSnapshots??{}}async saveSettings(){await this.saveData({...this.settings,presetSnapshots:this.presetSnapshots})}async saveSettingsAndRender(){await this.saveSettings(),this.activeModal?.render()}applyPreset(n,t=!1){let o=xe[n];o&&(t?delete this.presetSnapshots[n]:this.presetSnapshots[this.settings.preset]=zo(this.settings),this.settings.preset=n,Object.assign(this.settings,o,t?{}:this.presetSnapshots[n]??{}))}};function sr(e,n){if(n)return n;let t=e.workspace.getActiveViewOfType(f.MarkdownView)?.file;if(t)return t;let o=e.workspace.getActiveFile();if(o?.extension==="md")return o;let i=e.workspace.getMostRecentLeaf();return i?.view instanceof f.MarkdownView?i.view.file??null:null}var Pe=class e extends f.Modal{plugin;editorEl;previewEl;pageCountEl;noteTitleEl;renderBtn;exportBtn;loadingOverlayEl;renderComponent=new f.Component;initialFile;currentFile=null;renderToken=0;layoutCache=null;renderDebounceTimer=null;constructor(n,t,o){super(n),this.plugin=t,this.initialFile=o??null}async onOpen(){this.plugin.activeModal=this,this.renderComponent.load(),this.modalEl.addClass("mpdf-modal"),this.buildUI(this.contentEl);let n=sr(this.app,this.initialFile);if(n){this.currentFile=n;let t=await this.app.vault.read(n);this.editorEl.value=t,this.noteTitleEl.textContent=n.basename,this.noteTitleEl.title=n.path,this.showLoading(),await new Promise(o=>window.requestAnimationFrame(()=>window.requestAnimationFrame(()=>o()))),this.render(!0)}}onClose(){this.renderDebounceTimer!==null&&(window.clearTimeout(this.renderDebounceTimer),this.renderDebounceTimer=null),this.renderComponent.unload(),this.plugin.activeModal=null,this.currentFile=null,this.layoutCache=null}buildUI(n){let t=this.plugin.settings;this.buildTopbar(n.createEl("div",{cls:"mpdf-topbar"}),t);let o=n.createEl("div",{cls:"mpdf-main"}),i=o.createEl("div",{cls:"mpdf-editor-panel"});this.editorEl=i.createEl("textarea",{cls:"mpdf-editor"}),this.editorEl.placeholder=`Type or paste markdown here to preview and export as PDF.

Tip: open this panel from a note's right-click menu, command palette,
or keyboard shortcut to auto-load the active note.

Use /// on its own line for a manual page break.
Use --- for a horizontal rule.

Mermaid diagrams are supported:
\`\`\`mermaid
flowchart LR
  A --> B --> C
\`\`\`

Markdown tables:
| Col A | Col B |
|-------|-------|
| Cell  | Cell  |`;let l=o.createEl("div",{cls:"mpdf-preview-container"});this.previewEl=l.createEl("div",{cls:"mpdf-preview"}),this.loadingOverlayEl=l.createEl("div",{cls:"mpdf-loading-overlay"}),this.loadingOverlayEl.createEl("div",{cls:"mpdf-spinner"}),this.loadingOverlayEl.createEl("span",{cls:"mpdf-loading-text",text:"Rendering\u2026"}),this.editorEl.addEventListener("keydown",a=>{a.key==="Enter"&&(a.ctrlKey||a.metaKey)&&(a.preventDefault(),this.render(!0))})}buildTopbar(n,t){let o=n.createEl("div",{cls:"mpdf-topbar-left"});this.noteTitleEl=n.createEl("div",{cls:"mpdf-topbar-title",text:"\u2014"});let i=n.createEl("div",{cls:"mpdf-topbar-right"}),l=(m,v,S,T)=>{let C=o.createEl("div",{cls:"mpdf-ctrl"});C.createEl("span",{cls:"mpdf-ctrl-label",text:m});let A=C.createEl("select",{cls:"mpdf-select"});for(let[j,M]of Object.entries(v)){let w=A.createEl("option",{text:M,value:j});j===S&&(w.selected=!0)}A.addEventListener("change",()=>void T(A.value))},a={};Object.entries(xe).forEach(([m,v])=>a[m]=v.name),l("Style",a,t.preset,async m=>{this.plugin.applyPreset(m),await this.plugin.saveSettingsAndRender()});let r={};Object.keys(Te).forEach(m=>r[m]=m),l("Size",r,t.pageSize,async m=>{this.plugin.settings.pageSize=m,await this.plugin.saveSettingsAndRender()}),l("Orient",{portrait:"Portrait",landscape:"Landscape"},t.orientation,async m=>{this.plugin.settings.orientation=m,await this.plugin.saveSettingsAndRender()});let s=o.createEl("div",{cls:"mpdf-ctrl"});s.createEl("span",{cls:"mpdf-ctrl-label",text:"Zoom"});let c=s.createEl("span",{cls:"mpdf-ctrl-label",text:Math.round(t.previewScale*100)+"%"}),g=s.createEl("input");g.type="range",g.min="0.35",g.max="1.0",g.step="0.05",g.value=String(t.previewScale),g.addClass("mpdf-zoom-slider"),g.addEventListener("input",()=>{let m=parseFloat(g.value);this.plugin.settings.previewScale=m,c.textContent=Math.round(m*100)+"%",this.plugin.saveSettings().then(()=>{this.renderPreviewOnly()})});let E=o.createEl("button",{cls:"mpdf-btn",text:"Insert Page Break"});E.title="Insert page break (///)",E.addEventListener("click",()=>this.insertAtCursor(`
///
`)),this.pageCountEl=i.createEl("span",{cls:"mpdf-page-count",text:"\u2014 pages"});let b=i.createEl("button",{cls:"mpdf-btn mpdf-btn-icon"});b.setAttr("aria-label","Open Advanced PDF Export settings"),(0,f.setIcon)(b,"settings"),b.addEventListener("click",()=>{let m=this.app.setting;m?.open?.(),m?.openTabById?.("advanced-pdf-export")}),this.renderBtn=i.createEl("button",{cls:"mpdf-btn",text:"\u27F3 Render PDF"}),this.renderBtn.title="Render preview (Ctrl+Enter)",this.renderBtn.addEventListener("click",()=>this.render(!0)),this.exportBtn=i.createEl("button",{cls:"mpdf-btn mpdf-btn-primary",text:"\u2B07 Export PDF"}),this.exportBtn.addEventListener("click",()=>void this.exportPDF())}insertAtCursor(n){let t=this.editorEl,o=t.selectionStart,i=t.selectionEnd;t.value=t.value.slice(0,o)+n+t.value.slice(i),t.selectionStart=t.selectionEnd=o+n.length,t.focus()}render(n=!1){let t=++this.renderToken;this.renderDebounceTimer!==null&&(window.clearTimeout(this.renderDebounceTimer),this.renderDebounceTimer=null),this.showLoading();let o=()=>this.doRender(t).catch(i=>{let l=i instanceof Error?i.message:String(i);console.error("[advanced-pdf-export] render error:",i),this.hideLoading(),new f.Notice("Render error: "+l)});n?window.requestAnimationFrame(()=>window.requestAnimationFrame(()=>void o())):this.renderDebounceTimer=window.setTimeout(()=>{this.renderDebounceTimer=null,window.requestAnimationFrame(()=>window.requestAnimationFrame(()=>void o()))},150)}static insertAutoBreaks(n,t,o){if(!t&&!o)return n;let i=n.split(`
`),l=[],a=!1,r="";for(let s of i){if(a){let c=s.match(/^(`{3,}|~{3,})\s*$/);c&&c[1][0]===r[0]&&c[1].length>=r.length&&(a=!1,r="")}else{let c=s.match(/^(`{3,}|~{3,})/);c?(a=!0,r=c[1]):l.length>0&&(t&&/^# /.test(s)||o&&/^## /.test(s))&&l.push("///")}l.push(s)}return l.join(`
`)}async doRender(n){let t=this.plugin.settings,o=Lo(this.editorEl.value);t.hideFrontmatter&&(o=Bo(o)),t.includeFilenameAsTitle&&this.currentFile&&(o=`# ${this.currentFile.basename}

${o}`),o=e.insertAutoBreaks(o,t.autoBreakH1,t.autoBreakH2);let i=Do(o),l=Te[t.pageSize]??Te.A4,a=t.orientation==="landscape"?l.h:l.w,r=t.orientation==="landscape"?l.w:l.h,s=we(t.marginTop),c=we(t.marginBottom),g=we(t.marginLeft),E=we(t.marginRight),b=t.showFooter?28:0,m=t.showHeader&&t.headerText?20:0,v=Math.max(1,a-g-E),S=Math.max(1,r-s-c-b-m),T=Ro(this.editorEl.value),C=Uo(t,T),A=this.currentFile?.path??"pdf-export",j=await Promise.all(i.map(L=>jo(this.app,L,A,this.renderComponent)));if(n!==this.renderToken)return;let M=Go(),w=M?`${M}
${C}`:C,y=[];for(let L of j)y.push(...ar(L,v,S,w));let D=ir(y,t),O=t.fontFamily==="__custom__"?t.customFontName.trim()||"inherit":t.fontFamily;this.layoutCache={layouts:D,pw:a,ph:r,mTop:s,mLeft:g,mRight:E,footerH:b,headerH:m,contentW:v,contentH:S,docCSS:w,fontFamily:O,accentColor:t.accentColor,pageBackground:t.pageBackground,isRTL:T},this.drawPreview(this.layoutCache,t.previewScale),this.pageCountEl.textContent=`${D.length} page${D.length!==1?"s":""}`,this.hideLoading()}renderPreviewOnly(){this.layoutCache&&this.drawPreview(this.layoutCache,this.plugin.settings.previewScale)}showLoading(){this.loadingOverlayEl.addClass("is-active"),this.renderBtn.disabled=!0,this.renderBtn.textContent="Rendering\u2026"}hideLoading(){this.loadingOverlayEl.removeClass("is-active"),this.renderBtn.disabled=!1,this.renderBtn.textContent="\u27F3 Render PDF"}drawPreview(n,t){let{layouts:o,pw:i,ph:l,mTop:a,mLeft:r,mRight:s,footerH:c,headerH:g,contentW:E,docCSS:b,fontFamily:m,accentColor:v,pageBackground:S,isRTL:T}=n,C=this.plugin.settings;this.previewEl.empty();let A=new Map;o.forEach((y,D)=>{for(let O of y.pageNodes)O.querySelectorAll("[id]").forEach(L=>{A.has(L.id)||A.set(L.id,D)}),O.id&&!A.has(O.id)&&A.set(O.id,D)});let j=[],M=`
      :host {
        display: block;
        width: ${i}px;
        height: ${l}px;
        background: ${S};
        box-shadow: 0 2px 8px rgba(0,0,0,.30), 0 8px 32px rgba(0,0,0,.25);
        overflow: hidden;
        position: relative;
        box-sizing: border-box;
      }
      *, *::before, *::after { box-sizing: border-box; }
      .mpdf-hf-center { flex: 1; text-align: center; }
      .mpdf-hf-right { margin-left: auto; }
      ${b}
    `,w=new CSSStyleSheet;w.replaceSync(M);for(let y of o){let D=Math.round(i*t),O=Math.round(l*t),L=this.previewEl.createEl("div",{cls:"mpdf-page-wrap"});L.setCssStyles({width:`${D}px`,height:`${O}px`}),L.createEl("div",{cls:"mpdf-page-label",text:`Page ${y.pageNum} of ${y.totalPages}`}),j.push(L);let $=L.createEl("div",{cls:"mpdf-page-scale"});$.setCssStyles({width:`${D}px`,height:`${O}px`});let U=activeDocument.createElement("div");U.addClass("mpdf-shadow-host"),U.setCssStyles({width:`${i}px`,height:`${l}px`,transform:`scale(${t})`}),$.appendChild(U);let G=U.attachShadow({mode:"open"});if(G.adoptedStyleSheets=[w],C.showHeader&&(y.headerLeft||y.headerCenter||y.headerRight)){let d=activeDocument.createElement("div");if(d.setCssStyles({position:"absolute",top:`${a*.4}px`,left:`${r}px`,right:`${s}px`,display:"flex",alignItems:"center",fontSize:"9px",color:"#999",fontFamily:m,whiteSpace:"nowrap"}),y.headerCenter){let u=activeDocument.createElement("span");u.className="mpdf-hf-center",u.textContent=y.headerCenter,d.appendChild(u)}else{let u=activeDocument.createElement("span");u.textContent=y.headerLeft,d.appendChild(u);let p=activeDocument.createElement("span");p.className="mpdf-hf-right",p.textContent=y.headerRight,d.appendChild(p)}G.appendChild(d)}let F=activeDocument.createElement("div");F.className="mpdf-doc",T&&F.setAttribute("dir","rtl"),F.setCssStyles({position:"absolute",top:`${a+g}px`,left:`${r}px`,width:`${E}px`});for(let d of y.pageNodes)F.appendChild(d.cloneNode(!0));if(G.appendChild(F),F.querySelectorAll("a[href^='#']").forEach(d=>{let u=decodeURIComponent(d.getAttribute("href").slice(1)),p=A.get(u);p!==void 0&&(d.title=`Go to page ${p+1}`,d.addEventListener("click",N=>{N.preventDefault(),j[p]?.scrollIntoView({behavior:"smooth",block:"start"})}))}),C.showFooter&&(y.footerLeft||y.footerRight||y.footerCenter)){let d=activeDocument.createElement("div");if(d.setCssStyles({position:"absolute",bottom:"0",left:"0",right:"0",height:`${c}px`,display:"flex",alignItems:"center",...C.showFooterBorder?{borderTop:`0.5px solid ${v}33`}:{},padding:`0 ${s}px 0 ${r}px`,fontSize:"9px",color:"#aaa",fontFamily:m}),y.footerCenter){let u=activeDocument.createElement("span");u.className="mpdf-hf-center",u.textContent=y.footerCenter,d.appendChild(u)}else{let u=activeDocument.createElement("span");u.textContent=y.footerLeft,d.appendChild(u);let p=activeDocument.createElement("span");p.className="mpdf-hf-right",p.textContent=y.footerRight,d.appendChild(p)}G.appendChild(d)}}}async exportPDF(){let n=this.plugin.settings;this.exportBtn.disabled=!0,this.exportBtn.textContent="\u2B07 Exporting\u2026";let t=()=>{this.exportBtn.disabled=!1,this.exportBtn.textContent="\u2B07 Export PDF"};if(!this.layoutCache){this.renderDebounceTimer!==null&&(window.clearTimeout(this.renderDebounceTimer),this.renderDebounceTimer=null);let w=++this.renderToken;this.showLoading();try{await this.doRender(w)}catch(y){let D=y instanceof Error?y.message:String(y);new f.Notice("Render error: "+D),this.hideLoading(),t();return}}let o=this.layoutCache;if(!o||o.layouts.length===0){new f.Notice("Nothing to export."),t();return}let{layouts:i,pw:l,ph:a,mTop:r,mLeft:s,mRight:c,footerH:g,headerH:E,contentW:b,docCSS:m,fontFamily:v,accentColor:S,pageBackground:T,isRTL:C}=o,A=i.map(w=>{let y=w.pageNodes.map(Z=>{let d=Z.cloneNode(!0);return d.querySelectorAll("style, script").forEach(u=>{u.closest("svg")||u.remove()}),d.outerHTML}).join(`
`),D=n.showHeader&&(w.headerLeft||w.headerCenter||w.headerRight),O=w.headerCenter?`<span style="flex:1;text-align:center;">${re(w.headerCenter)}</span>`:`<span>${re(w.headerLeft)}</span><span style="margin-left:auto;">${re(w.headerRight)}</span>`,L=D?`<div style="position:absolute;top:${r*.4}px;left:${s}px;right:${c}px;display:flex;align-items:center;font-size:9px;color:#999;font-family:${v};white-space:nowrap;">${O}</div>`:"",$=w.footerCenter?`<span style="flex:1;text-align:center;">${re(w.footerCenter)}</span>`:`<span>${re(w.footerLeft)}</span><span style="margin-left:auto;">${re(w.footerRight)}</span>`,U=n.showFooter&&(w.footerLeft||w.footerRight||w.footerCenter),G=n.showFooterBorder?`border-top:0.5px solid ${S}33;`:"",W=U?`<div style="position:absolute;bottom:0;left:0;right:0;height:${g}px;display:flex;align-items:center;${G}padding:0 ${c}px 0 ${s}px;font-size:9px;color:#aaa;font-family:${v};">${$}</div>`:"",F=`<div class="mpdf-doc"${C?' dir="rtl"':""} style="position:absolute;top:${r+E}px;left:${s}px;width:${b}px;">${y}</div>`;return`<div class="mpdf-export-page">${L}${F}${W}</div>`}),j=`
      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      @page { size: ${l}px ${a}px; margin: 0; }
      html, body { margin: 0; padding: 0; background: ${T}; }
      .mpdf-export-page {
        position: relative;
        width: ${l}px; height: ${a}px;
        overflow: hidden;
        background: ${T};
        page-break-after: always; break-after: page;
      }
      .mpdf-export-page:last-child { page-break-after: avoid; break-after: avoid; }
      ${m}
    `,M=`<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>${re(this.currentFile?.basename??"Export")}</title>
<style>${Ao(j)}</style>
</head>
<body>
${A.join(`
`)}
</body>
</html>`;try{let w=window,y=w.require("@electron/remote");if(!y?.dialog)throw new Error("no remote");let D=await y.dialog.showSaveDialog({title:"Save PDF",defaultPath:(this.currentFile?.basename??"export")+".pdf",filters:[{name:"PDF",extensions:["pdf"]}]});if(D.canceled||!D.filePath){t();return}new f.Notice("Generating PDF\u2026");let O=new Blob([M],{type:"text/html"}),L=URL.createObjectURL(O),$=new y.BrowserWindow({show:!1,webPreferences:{nodeIntegration:!1}});$.loadURL(L);let U=!1,G=()=>{URL.revokeObjectURL(L),$.close(),t()};$.webContents.once("did-fail-load",(W,F,Z)=>{U||(U=!0,new f.Notice("PDF load error: "+Z),G())}),$.webContents.once("did-finish-load",()=>{U||(U=!0,$.webContents.printToPDF({pageSize:n.pageSize,landscape:n.orientation==="landscape",printBackground:!0,margins:{marginType:"none"}}).then(W=>{w.require("fs").writeFile(D.filePath,W,F=>{F?new f.Notice("Error saving PDF: "+F.message):new f.Notice("\u2713 PDF saved: "+D.filePath),G()})}).catch(W=>{new f.Notice("PDF render error: "+W.message),G()}))})}catch{new f.Notice("Advanced PDF export requires the Obsidian desktop app."),t()}}},$e=class extends f.PluginSettingTab{plugin;dirty=!1;constructor(n,t){super(n,t),this.plugin=t}display(){this.dirty=!1,this.buildSettings()}hide(){this.dirty&&(this.dirty=!1,this.plugin.activeModal?.render(!0))}async markDirty(){this.dirty=!0,await this.plugin.saveSettings()}buildSettings(){let{containerEl:n}=this;n.empty();let t=this.plugin.settings;new f.Setting(n).setName("Style Preset").setHeading(),new f.Setting(n).setName("Preset").setDesc("Pick a preset to configure the overall document style. Fine-tune any setting below.").addDropdown(a=>{Object.entries(xe).forEach(([r,s])=>{a.addOption(r,s.name)}),a.setValue(t.preset).onChange(r=>{this.plugin.applyPreset(r),this.markDirty().then(()=>{this.buildSettings()})})}).addButton(a=>a.setButtonText("Reset Preset").setTooltip("Reset current preset to its default values").onClick(()=>{this.plugin.applyPreset(t.preset,!0),this.markDirty().then(()=>{this.buildSettings()})})),new f.Setting(n).setName("Page").setHeading(),new f.Setting(n).setName("Page size").addDropdown(a=>{Object.keys(Te).forEach(r=>{a.addOption(r,r)}),a.setValue(t.pageSize).onChange(r=>{t.pageSize=r,this.markDirty()})}),new f.Setting(n).setName("Orientation").addDropdown(a=>a.addOptions({portrait:"Portrait",landscape:"Landscape"}).setValue(t.orientation).onChange(r=>{t.orientation=r,this.markDirty()})),new f.Setting(n).setName("Margins (mm)").setHeading();let o=(a,r)=>new f.Setting(n).setName(a).addText(s=>s.setValue(String(t[r])).onChange(c=>{t[r]=parseInt(c)||0,this.markDirty()}));o("Top","marginTop"),o("Bottom","marginBottom"),o("Left","marginLeft"),o("Right","marginRight"),new f.Setting(n).setName("Typography").setHeading();let i;new f.Setting(n).setName("Font family").addDropdown(a=>a.addOptions({"Georgia, serif":"Georgia (Serif)","'Times New Roman', Times, serif":"Times New Roman","'Palatino Linotype', Palatino, serif":"Palatino","Arial, sans-serif":"Arial","'Helvetica Neue', Helvetica, sans-serif":"Helvetica","'Trebuchet MS', sans-serif":"Trebuchet","'Courier New', monospace":"Courier New",__custom__:"Custom\u2026"}).setValue(t.fontFamily).onChange(r=>{t.fontFamily=r,i.settingEl.toggleClass("is-hidden",r!=="__custom__"),this.markDirty()})),i=new f.Setting(n).setName("Custom font name").setDesc('CSS font-family value \u2014 e.g. "Inter, sans-serif". The font must be installed on your system.').addText(a=>a.setPlaceholder("e.g. Inter, sans-serif").setValue(t.customFontName).onChange(r=>{t.customFontName=r,this.markDirty()})),i.settingEl.toggleClass("is-hidden",t.fontFamily!=="__custom__"),new f.Setting(n).setName("Font size (px)").addDropdown(a=>{["10","11","12","13","14","15","16"].forEach(r=>{a.addOption(r,r+"px")}),a.setValue(String(t.fontSize)).onChange(r=>{t.fontSize=parseInt(r),this.markDirty()})}),new f.Setting(n).setName("Code font size").addDropdown(a=>a.addOptions({"0.75":"0.75em","0.80":"0.80em","0.82":"0.82em","0.85":"0.85em","0.88":"0.88em","0.90":"0.90em","1.0":"1.00em"}).setValue(String(t.codeFontSize)).onChange(r=>{t.codeFontSize=parseFloat(r),this.markDirty()})),new f.Setting(n).setName("Code theme").setDesc("Syntax highlighting theme for code blocks.").addDropdown(a=>{Object.entries(be).forEach(([r,{label:s}])=>a.addOption(r,s)),a.setValue(t.codeTheme).onChange(r=>{t.codeTheme=r;let s=be[r];s&&(t.codeBackground=s.bg),this.markDirty().then(()=>{this.buildSettings()})})}),new f.Setting(n).setName("Line height").addDropdown(a=>a.addOptions({"1.4":"Tight (1.4)","1.6":"Compact (1.6)","1.75":"Normal (1.75)","1.85":"Relaxed (1.85)","2.0":"Double (2.0)"}).setValue(String(t.lineHeight)).onChange(r=>{t.lineHeight=parseFloat(r),this.markDirty()})),new f.Setting(n).setName("Paragraph spacing").addDropdown(a=>a.addOptions({0:"None","0.3":"Tight (0.3em)","0.5":"Normal (0.5em)","0.65":"Relaxed (0.65em)","1.0":"Wide (1em)"}).setValue(String(t.paragraphSpacing)).onChange(r=>{t.paragraphSpacing=parseFloat(r),this.markDirty()})),new f.Setting(n).setName("Heading scale").setDesc("Multiplier applied to all heading sizes.").addDropdown(a=>a.addOptions({"0.8":"Small (0.8\xD7)","0.88":"0.88\xD7","0.9":"Compact (0.9\xD7)","0.95":"0.95\xD7","1.0":"Normal (1.0\xD7)","1.05":"1.05\xD7","1.1":"Large (1.1\xD7)","1.2":"XLarge (1.2\xD7)"}).setValue(String(t.headingScale)).onChange(r=>{t.headingScale=parseFloat(r),this.markDirty()})),new f.Setting(n).setName("Colors").setHeading();let l=(a,r)=>new f.Setting(n).setName(a).addColorPicker(s=>s.setValue(t[r]).onChange(c=>{t[r]=c,this.markDirty()}));l("Accent color","accentColor"),l("Body text color","bodyColor"),l("Heading color","headingColor"),l("Page background","pageBackground"),l("Blockquote background","blockquoteBg"),l("Blockquote border","blockquoteBorderColor"),l("Table header background","tableHeaderBg"),l("Code background","codeBackground"),new f.Setting(n).setName("Heading Style").setHeading(),new f.Setting(n).setName("H1 bottom border").addToggle(a=>a.setValue(t.h1BorderBottom).onChange(r=>{t.h1BorderBottom=r,this.markDirty()})),new f.Setting(n).setName("H2 bottom border").addToggle(a=>a.setValue(t.h2BorderBottom).onChange(r=>{t.h2BorderBottom=r,this.markDirty()})),new f.Setting(n).setName("Center H1").addToggle(a=>a.setValue(t.centerH1).onChange(r=>{t.centerH1=r,this.markDirty()})),new f.Setting(n).setName("Tables").setHeading(),new f.Setting(n).setName("Striped rows").addToggle(a=>a.setValue(t.tableStriped).onChange(r=>{t.tableStriped=r,this.markDirty()})),new f.Setting(n).setName("Header & Footer").setHeading(),new f.Setting(n).setName("Show header").addToggle(a=>a.setValue(t.showHeader).onChange(r=>{t.showHeader=r,this.markDirty()})),new f.Setting(n).setName("Header text").setDesc("Appears on every page according to the chosen alignment.").addText(a=>a.setValue(t.headerText).onChange(r=>{t.headerText=r,this.markDirty()})),new f.Setting(n).setName("Header alignment").addDropdown(a=>a.addOptions({left:"Left",center:"Center",right:"Right"}).setValue(t.headerAlignment).onChange(r=>{t.headerAlignment=r,this.markDirty()})),new f.Setting(n).setName("Show footer").addToggle(a=>a.setValue(t.showFooter).onChange(r=>{t.showFooter=r,this.markDirty()})),new f.Setting(n).setName("Footer border").setDesc("Show the separator line above the footer.").addToggle(a=>a.setValue(t.showFooterBorder).onChange(r=>{t.showFooterBorder=r,this.markDirty()})),new f.Setting(n).setName("Footer text").addText(a=>a.setValue(t.footerText).onChange(r=>{t.footerText=r,this.markDirty()})),new f.Setting(n).setName("Show page numbers").addToggle(a=>a.setValue(t.showPageNumbers).onChange(r=>{t.showPageNumbers=r,this.markDirty()})),new f.Setting(n).setName("Page number position").addDropdown(a=>a.addOptions({left:"Left",center:"Center",right:"Right"}).setValue(t.pageNumberPosition).onChange(r=>{t.pageNumberPosition=r,this.markDirty()})),new f.Setting(n).setName("Page number start").setDesc("Number assigned to the first visible page number. Accepts any integer.").addText(a=>a.setValue(String(t.pageNumberStart)).onChange(r=>{let s=parseInt(r,10);t.pageNumberStart=isNaN(s)?1:s,this.markDirty()})),new f.Setting(n).setName("Header/footer on first page").setDesc("When off, page 1 has no header, footer, or page number. Numbering begins on page 2 using the start value.").addToggle(a=>a.setValue(t.showHeaderFooterOnFirstPage).onChange(r=>{t.showHeaderFooterOnFirstPage=r,this.markDirty()})),new f.Setting(n).setName("Behaviour").setHeading(),new f.Setting(n).setName("Hide frontmatter").setDesc("Strip the YAML frontmatter block (--- \u2026 ---) from the preview and exported PDF.").addToggle(a=>a.setValue(t.hideFrontmatter).onChange(r=>{t.hideFrontmatter=r,this.markDirty()})),new f.Setting(n).setName("Include file name as title").setDesc("Prepend the note's file name as an H1 heading at the top of the PDF. Mirrors Obsidian's built-in 'Include file name as title' export option.").addToggle(a=>a.setValue(t.includeFilenameAsTitle).onChange(r=>{t.includeFilenameAsTitle=r,this.markDirty()})),new f.Setting(n).setName("Auto page break before H1").addToggle(a=>a.setValue(t.autoBreakH1).onChange(r=>{t.autoBreakH1=r,this.markDirty()})),new f.Setting(n).setName("Auto page break before H2").addToggle(a=>a.setValue(t.autoBreakH2).onChange(r=>{t.autoBreakH2=r,this.markDirty()}))}};
