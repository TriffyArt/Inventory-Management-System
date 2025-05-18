const Features = () => {
    return (
        <div className="mx-20 h-auto w-auto flex flex-col border-2 black rounded-xl bg-gray-400
                bg-gradient-to-b from-white via-gray-300 to-gray-400 pb-12">

                <h1 className="text-6xl font-bold mt-12 ml-16">FEATURES</h1>

                <div className="flex flex-col gap-4 bg-white w-auto h-auto font-sans rounded-xl border-2 black m-10 p-8">

                    <h1 className="text-2xl">Barcode Scanning</h1>

                    <p className="text-xl">For Checking Inventory of Products</p>

                    <li className="text-lg">Stocks, Name of Product, Barcode Number, Price</li>


                    <h1 className="text-2xl">Smart Alert Low Stocks</h1>

                    <p className="text-xl" >Allow you to be informed if a Specific Product is Low in Stocks </p>
                    <li className="text-lg">You can set the amount of stocks to be considered low</li>
                    <h1 className="text-2xl">Product Management</h1>
                    <p className="text-xl">Add, Edit, Delete Products</p>
                    <li className="text-lg">Add Product, Edit Product, Delete Product</li>
                    <h1 className="text-2xl">Product List</h1>
                    <p className="text-xl">List of Products</p>
                    <li className="text-lg">Name of Product, Category, Barcode Number, Price</li>
            
                </div>

            </div>
    )
}

export default Features;