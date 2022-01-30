/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  useFileSystemPublicRoutes: false,
  images: {
    domains: ['localhost', 'chatmenow.ru'],
  },
  // async headers() {
  //   return [
  //     {
  //       source: '/:all*(svg|jpg|png|js)',
  //       locale: false,
  //       headers: [
  //         {
  //           key: 'Cache-Control',
  //           value: 'public, max-age=9999999999, must-revalidate',
  //         },
  //         {
  //           key: 'Strict-Transport-Security',
  //           value: 'max-age=63072000; includeSubDomains; preload'
  //         }
  //       ],
  //     },
  //   ]
  // } ,
  
  
}

 
