"use strict";(self.webpackChunkmy_strapi_project=self.webpackChunkmy_strapi_project||[]).push([[8477],{8477:(b,O,e)=>{e.r(O),e.d(O,{default:()=>K});var a=e(92132),c=e(21272),m=e(33544),s=e.n(m),h=e(52993),v=e(7153),C=e(83997),f=e(8361),A=e(16918),y=e(10229),R=e(68802),T=e(37565),B=e(54894),I=e(63891);const L=n=>{const{selectProps:d}=n,i=p=>o=>{o.preventDefault(),d.onChange(d.value.filter(_=>_!==p))};return(0,a.jsx)(h.v,{type:"button",tabIndex:-1,icon:(0,a.jsx)(R.A,{}),onClick:i(n.data),children:n.data.label})},j=(0,I.default)(T._8)`
  .select-control {
    height: auto;

    & > div:first-child {
      padding: 4px;
      gap: 4px;

      & > div {
        padding-left: 8px;
      }
    }

    .select-multi-value-container {
      margin-right: -8px;
    }
  }
`,M=({value:n,onChange:d,name:i,intlLabel:p,required:o,attribute:_,description:P,placeholder:U,disabled:W,error:D})=>{const{formatMessage:u}=(0,B.A)(),r=(0,c.useMemo)(()=>(_.options||[]).map(t=>{const[l,E]=[...t.split(/:(.*)/s),t];return!l||!E?null:{label:l,value:E}}).filter(Boolean),[_]),x=(0,c.useMemo)(()=>{let t;try{t=JSON.parse(n||"[]")}catch{t=[]}return Array.isArray(t)?r.filter(l=>t.some(E=>l.value===E)):[]},[n,r]),g=(0,c.useMemo)(()=>D||(o&&!r.length?"No options":null),[o,D,r]);return(0,a.jsx)(v.D,{hint:P&&u(P),error:g,name:i,required:o,children:(0,a.jsxs)(C.s,{direction:"column",alignItems:"stretch",gap:1,children:[(0,a.jsx)(f.d,{children:u(p)}),(0,a.jsx)(j,{isSearchable:!0,isMulti:!0,error:g,name:i,id:i,disabled:W||r.length===0,placeholder:U,defaultValue:x.map(t=>({label:u({id:t.label,defaultMessage:t.label}),value:t.value})),components:{MultiValueContainer:L},options:r.map(t=>({...t,label:u({id:t.label,defaultMessage:t.label})})),onChange:t=>{d({target:{name:i,value:t?.length&&t.filter(l=>!!l)?JSON.stringify(t.filter(l=>!!l).map(l=>l.value)):null,type:_.type}})},classNames:{control:t=>"select-control",multiValue:t=>"select-multi-value",placeholder:t=>"select-placeholder"}}),(0,a.jsx)(A.o,{}),(0,a.jsx)(y.b,{})]})})};M.defaultProps={description:null,disabled:!1,error:null,labelAction:null,required:!1,value:""},M.propTypes={intlLabel:s().object.isRequired,onChange:s().func.isRequired,attribute:s().object.isRequired,name:s().string.isRequired,description:s().object,disabled:s().bool,error:s().string,labelAction:s().object,required:s().bool,value:s().string};const K=M}}]);
