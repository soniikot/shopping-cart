"use strict";(self.webpackChunkmy_strapi_project=self.webpackChunkmy_strapi_project||[]).push([[6987],{46987:(V,T,t)=>{t.d(T,{ProtectedListPage:()=>ct});var s=t(92132),c=t(21272),x=t(11273),M=t(42455),C=t(38413),b=t(55356),W=t(74773),g=t(30893),i=t(85963),o=t(4198),h=t(94061),d=t(35513),f=t(40216),$=t(26127),D=t(90361),l=t(33363),L=t(50215),O=t(98765),R=t(25641),k=t(83997),Q=t(63891);const I=Q.Ay.div`
  background: ${({theme:n})=>n.colors.danger500};
  border: none;
  border-radius: 16px;
  position: relative;
  height: ${24/16}rem;
  width: ${40/16}rem;

  & span {
    font-size: ${({visibleLabels:n})=>n?"1rem":0};
  }

  &:before {
    content: '';
    background: ${({theme:n})=>n.colors.neutral0};
    width: 1rem;
    height: 1rem;
    border-radius: 50%;
    position: absolute;
    transition: all 0.5s;
    left: ${({theme:n})=>n.spaces[1]};
    top: ${({theme:n})=>n.spaces[1]};
  }

  @media (prefers-reduced-motion: reduce) {
    &:before {
      transition: none;
    }
  }
`,st=Q.Ay.button`
  background: transparent;
  padding: 0;
  border: none;

  &[aria-checked='true'] ${I} {
    background: ${({theme:n})=>n.colors.success500};
  }

  &[aria-checked='true'] ${I}:before {
    transform: translateX(1rem);
  }
`,ot=c.forwardRef(({label:n,onChange:u,onLabel:P="On",offLabel:S="Off",selected:j,visibleLabels:v=!1,...F},a)=>(0,s.jsx)(st,{ref:a,role:"switch","aria-checked":j,"aria-label":n,onClick:u,visibleLabels:v,type:"button",...F,children:(0,s.jsxs)(k.s,{children:[(0,s.jsxs)(I,{children:[(0,s.jsx)("span",{children:P}),(0,s.jsx)("span",{children:S})]}),v&&(0,s.jsx)(h.a,{as:"span","aria-hidden":!0,paddingLeft:2,color:j?"success600":"danger600",children:j?P:S})]})}));var X=t(88353),et=t(53563),at=t(49654),m=t(55506),U=t(5194),Y=t(50612),nt=t(41909),rt=t(36481),dt=t(54894),Z=t(17703),it=t(71389),w=t(21217),lt=t(40835),Ct=t(15126),bt=t(63299),Wt=t(67014),St=t(59080),Et=t(79275),At=t(14718),Dt=t(82437),Lt=t(61535),Pt=t(5790),pt=t(12083),Bt=t(35223),$t=t(5409),Ot=t(74930),Rt=t(2600),kt=t(48940),It=t(41286),Ut=t(56336),Ft=t(13426),Kt=t(84624),Nt=t(77965),zt=t(54257),Jt=t(71210),Gt=t(51187),Ht=t(39404),Vt=t(58692),Qt=t(501),Xt=t(57646),Yt=t(23120),Zt=t(44414),wt=t(25962),qt=t(14664),_t=t(42588),ts=t(90325),ss=t(62785),os=t(87443),es=t(41032),as=t(22957),ns=t(93179),rs=t(73055),ds=t(15747),is=t(85306),ls=t(26509),hs=t(32058),cs=t(81185),gs=t(82261);const ht=()=>{const[n,u]=c.useState(!1),[P,S]=c.useState(!1),[j,v]=c.useState([]),F=(0,w.j)(e=>e.admin_app.permissions.settings?.webhooks),{formatMessage:a}=(0,dt.A)(),{_unstableFormatAPIError:p}=(0,m.wq)(),y=(0,m.hN)();(0,m.L4)();const{push:gt}=(0,Z.W6)(),{pathname:q}=(0,Z.zy)(),{isLoading:vt,allowedActions:{canCreate:K,canUpdate:N,canDelete:_}}=(0,m.ec)(F),{notifyStatus:tt}=(0,x.W)(),{isLoading:mt,webhooks:E,error:z,updateWebhook:ut,deleteManyWebhooks:xt}=(0,lt.u)();c.useEffect(()=>{if(z){y({type:"warning",message:p(z)});return}E&&tt(a({id:"Settings.webhooks.list.loading.success",defaultMessage:"Webhooks have been loaded"}))},[E,z,y,a,tt,p]);const ft=async e=>{try{const r=await ut(e);"error"in r&&y({type:"warning",message:p(r.error)})}catch{y({type:"warning",message:{id:"notification.error",defaultMessage:"An error occurred"}})}},jt=async()=>{try{S(!0);const e=await xt({ids:j});if("error"in e){y({type:"warning",message:p(e.error)});return}v([])}catch{y({type:"warning",message:{id:"notification.error",defaultMessage:"An error occurred"}})}finally{S(!1),u(!1)}},yt=e=>v(e?E?.map(r=>r.id)??[]:[]),Tt=(e,r)=>v(e?H=>[...H,r]:H=>H.filter(Mt=>Mt!==r)),J=e=>()=>gt(`${q}/${e}`),G=vt||mt,B=E?.length??0,A=j.length;return(0,s.jsxs)(M.P,{children:[(0,s.jsx)(m.x7,{name:"Webhooks"}),(0,s.jsxs)(C.g,{"aria-busy":G,children:[(0,s.jsx)(b.Q,{title:a({id:"Settings.webhooks.title",defaultMessage:"Webhooks"}),subtitle:a({id:"Settings.webhooks.list.description",defaultMessage:"Get POST changes notifications"}),primaryAction:K&&!G&&(0,s.jsx)(at.z,{as:it.k2,startIcon:(0,s.jsx)(U.A,{}),variant:"default",to:`${q}/create`,size:"S",children:a({id:"Settings.webhooks.list.button.add",defaultMessage:"Create new webhook"})})}),A>0&&_&&(0,s.jsx)(W.B,{startActions:(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(g.o,{variant:"epsilon",textColor:"neutral600",children:a({id:"Settings.webhooks.to.delete",defaultMessage:"{webhooksToDeleteLength, plural, one {# webhook} other {# webhooks}} selected"},{webhooksToDeleteLength:A})}),(0,s.jsx)(i.$,{onClick:()=>u(!0),startIcon:(0,s.jsx)(Y.A,{}),size:"L",variant:"danger-light",children:a({id:"global.delete",defaultMessage:"Delete"})})]})}),(0,s.jsx)(o.s,{children:G?(0,s.jsx)(h.a,{background:"neutral0",padding:6,shadow:"filterShadow",hasRadius:!0,children:(0,s.jsx)(m.Bl,{})}):B>0?(0,s.jsxs)(d.X,{colCount:5,rowCount:B+1,footer:(0,s.jsx)(f.S,{onClick:J("create"),icon:(0,s.jsx)(U.A,{}),children:a({id:"Settings.webhooks.list.button.add",defaultMessage:"Create new webhook"})}),children:[(0,s.jsx)($.d,{children:(0,s.jsxs)(D.Tr,{children:[(0,s.jsx)(l.Th,{children:(0,s.jsx)(L.J,{"aria-label":a({id:"global.select-all-entries",defaultMessage:"Select all entries"}),indeterminate:A>0&&A<B,value:A===B,onValueChange:yt})}),(0,s.jsx)(l.Th,{width:"20%",children:(0,s.jsx)(g.o,{variant:"sigma",textColor:"neutral600",children:a({id:"global.name",defaultMessage:"Name"})})}),(0,s.jsx)(l.Th,{width:"60%",children:(0,s.jsx)(g.o,{variant:"sigma",textColor:"neutral600",children:a({id:"Settings.webhooks.form.url",defaultMessage:"URL"})})}),(0,s.jsx)(l.Th,{width:"20%",children:(0,s.jsx)(g.o,{variant:"sigma",textColor:"neutral600",children:a({id:"Settings.webhooks.list.th.status",defaultMessage:"Status"})})}),(0,s.jsx)(l.Th,{children:(0,s.jsx)(O.s,{children:a({id:"Settings.webhooks.list.th.actions",defaultMessage:"Actions"})})})]})}),(0,s.jsx)(R.N,{children:E?.map(e=>(0,s.jsxs)(D.Tr,{onClick:N?J(e.id):void 0,style:{cursor:N?"pointer":"default"},children:[(0,s.jsx)(l.Td,{onClick:r=>r.stopPropagation(),children:(0,s.jsx)(L.J,{"aria-label":`${a({id:"global.select",defaultMessage:"Select"})} ${e.name}`,value:j?.includes(e.id),onValueChange:r=>Tt(r,e.id),name:"select"})}),(0,s.jsx)(l.Td,{children:(0,s.jsx)(g.o,{fontWeight:"semiBold",textColor:"neutral800",children:e.name})}),(0,s.jsx)(l.Td,{children:(0,s.jsx)(g.o,{textColor:"neutral800",children:e.url})}),(0,s.jsx)(l.Td,{children:(0,s.jsx)(k.s,{children:(0,s.jsx)(ot,{onLabel:a({id:"global.enabled",defaultMessage:"Enabled"}),offLabel:a({id:"global.disabled",defaultMessage:"Disabled"}),label:`${e.name} ${a({id:"Settings.webhooks.list.th.status",defaultMessage:"Status"})}`,selected:e.isEnabled,onChange:r=>{r.stopPropagation(),ft({...e,isEnabled:!e.isEnabled})},visibleLabels:!0})})}),(0,s.jsx)(l.Td,{children:(0,s.jsxs)(k.s,{gap:1,children:[N&&(0,s.jsx)(X.K,{label:a({id:"Settings.webhooks.events.update",defaultMessage:"Update"}),icon:(0,s.jsx)(nt.A,{}),noBorder:!0}),_&&(0,s.jsx)(X.K,{onClick:r=>{r.stopPropagation(),v([e.id]),u(!0)},label:a({id:"Settings.webhooks.events.delete",defaultMessage:"Delete webhook"}),icon:(0,s.jsx)(Y.A,{}),noBorder:!0})]})})]},e.id))})]}):(0,s.jsx)(et.p,{icon:(0,s.jsx)(rt.A,{width:"160px"}),content:a({id:"Settings.webhooks.list.empty.description",defaultMessage:"No webhooks found"}),action:(0,s.jsx)(i.$,{variant:"secondary",startIcon:(0,s.jsx)(U.A,{}),disabled:!K,onClick:K?J("create"):void 0,children:a({id:"Settings.webhooks.list.button.add",defaultMessage:"Create new webhook"})})})})]}),(0,s.jsx)(m.TM,{isOpen:n,onToggleDialog:()=>u(e=>!e),onConfirm:jt,isConfirmButtonLoading:P})]})},ct=()=>{const n=(0,w.j)(u=>u.admin_app.permissions.settings?.webhooks.main);return(0,s.jsx)(m.kz,{permissions:n,children:(0,s.jsx)(ht,{})})}},40835:(V,T,t)=>{t.d(T,{u:()=>g});var s=t(21217);const c=s.n.injectEndpoints({endpoints:i=>({getWebhooks:i.query({query:o=>({url:`/admin/webhooks/${o?.id??""}`,method:"GET"}),transformResponse:o=>Array.isArray(o.data)?o.data:[o.data],providesTags:(o,h,d)=>typeof d=="object"&&"id"in d?[{type:"Webhook",id:d.id}]:[...o?.map(({id:f})=>({type:"Webhook",id:f}))??[],{type:"Webhook",id:"LIST"}]}),createWebhook:i.mutation({query:o=>({url:"/admin/webhooks",method:"POST",data:o}),transformResponse:o=>o.data,invalidatesTags:[{type:"Webhook",id:"LIST"}]}),updateWebhook:i.mutation({query:({id:o,...h})=>({url:`/admin/webhooks/${o}`,method:"PUT",data:h}),transformResponse:o=>o.data,invalidatesTags:(o,h,{id:d})=>[{type:"Webhook",id:d}]}),triggerWebhook:i.mutation({query:o=>({url:`/admin/webhooks/${o}/trigger`,method:"POST"}),transformResponse:o=>o.data}),deleteManyWebhooks:i.mutation({query:o=>({url:"/admin/webhooks/batch-delete",method:"POST",data:o}),transformResponse:o=>o.data,invalidatesTags:(o,h,{ids:d})=>d.map(f=>({type:"Webhook",id:f}))})}),overrideExisting:!1}),{useGetWebhooksQuery:x,useCreateWebhookMutation:M,useUpdateWebhookMutation:C,useTriggerWebhookMutation:b,useDeleteManyWebhooksMutation:W}=c,g=(i=void 0,o)=>{const{data:h,isLoading:d,error:f}=x(i,o),[$,{error:D}]=M(),[l,{error:L}]=C(),[O]=b(),[R]=W();return{webhooks:h,isLoading:d,error:f||D||L,createWebhook:$,updateWebhook:l,triggerWebhook:O,deleteManyWebhooks:R}}},40216:(V,T,t)=>{t.d(T,{S:()=>i});var s=t(92132),c=t(63891),x=t(94061),M=t(48653),C=t(83997),b=t(30893);const W=(0,c.Ay)(x.a)`
  height: ${24/16}rem;
  width: ${24/16}rem;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;

  svg {
    height: ${10/16}rem;
    width: ${10/16}rem;
  }

  svg path {
    fill: ${({theme:o})=>o.colors.primary600};
  }
`,g=(0,c.Ay)(x.a)`
  border-radius: 0 0 ${({theme:o})=>o.borderRadius} ${({theme:o})=>o.borderRadius};
  display: block;
  width: 100%;
  border: none;
`,i=({children:o,icon:h,...d})=>(0,s.jsxs)("div",{children:[(0,s.jsx)(M.c,{}),(0,s.jsx)(g,{as:"button",background:"primary100",padding:5,...d,children:(0,s.jsxs)(C.s,{children:[(0,s.jsx)(W,{"aria-hidden":!0,background:"primary200",children:h}),(0,s.jsx)(x.a,{paddingLeft:3,children:(0,s.jsx)(b.o,{variant:"pi",fontWeight:"bold",textColor:"primary600",children:o})})]})})]})}}]);
