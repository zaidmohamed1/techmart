import React from 'react'
import apiService from '../../../../services/api'
import ProductDetail from '@/components/e-commerce-product-detail'

export default  async function ProducrDetails({params}: { params: Promise<{ productID: string }> }) {
    const prodcutID = await params.then((res)=>res.productID )
    console.log(prodcutID)
    const product = await apiService.getProductDetails(prodcutID)
    console.log(product);
    
        
  return <ProductDetail product={product} />
}
