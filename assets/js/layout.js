(() => {
  const base = '/debarshi-salesforce-portfolio/';
  const email = 'debarshi.ghosh009@gmail.com';
  const mobile = '+91 7076652995';
  const mobileHref = '+917076652995';
  const linkedin = 'https://www.linkedin.com/in/debarshi-ghosh1995';
  const links = [
    ['Home',''],['Projects','projects/'],['Services','services/'],['Architecture','architecture/'],
    ['Expertise','expertise/'],['Learning Hub','blog/'],['About','about/'],['Hire Me','hire-me/'],['Contact','contact/']
  ];
  const current = location.pathname.replace(base,'').replace(/index\\.html$/,'');
  const nav = links.map(([label,path]) => {
    const active = current === path || (path && current.startsWith(path));
    return '<a href="'+base+path+'" class="'+(active?'active ':'')+(label==='Hire Me'?'hire-link':'')+'">'+label+'</a>';
  }).join('');
  const header = '<header class="site-header"><div class="wrap nav"><a class="brand" href="'+base+'">DEBARSHI GHOSH<span>.</span></a><nav class="navlinks" aria-label="Main navigation">'+nav+'</nav></div></header>';
  const footer = '<footer class="site-footer"><div class="wrap footer-layout">'+
    '<div class="footer-brand"><a class="footer-logo" href="'+base+'">DEBARSHI GHOSH<span>.</span></a><p>Salesforce Technical Lead · Remote from India</p></div>'+
    '<div class="footer-section"><strong>Connect</strong>'+
    '<a class="footer-contact-link" href="mailto:'+email+'"><span class="footer-icon" aria-hidden="true">✉</span><span>'+email+'</span></a>'+
    '<a class="footer-contact-link" href="tel:'+mobileHref+'"><span class="footer-icon" aria-hidden="true">☎</span><span>'+mobile+'</span></a>'+
    '<a class="footer-contact-link" href="'+linkedin+'" target="_blank" rel="noopener noreferrer"><span class="footer-icon footer-social-icon" aria-hidden="true">in</span><span>LinkedIn</span><span class="footer-external">↗</span></a>'+
    '<a class="footer-contact-link" href="https://github.com/debarshi-ghosh" target="_blank" rel="noopener noreferrer"><span class="footer-icon footer-social-icon" aria-hidden="true">⌘</span><span>GitHub</span><span class="footer-external">↗</span></a>'+
    '</div></div><div class="wrap footer-bottom"><span>© '+new Date().getFullYear()+' Debarshi Ghosh. All rights reserved.</span><a href="'+base+'contact/">Contact ↗</a></div></footer>'
  document.querySelector('#shared-header')?.replaceWith(document.createRange().createContextualFragment(header));
  document.querySelector('#shared-footer')?.replaceWith(document.createRange().createContextualFragment(footer));
})();