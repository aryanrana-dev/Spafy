const CartDrawer = ({ isOpen, onClose, subtotal = "$0", services }) => {
    console.log(services);
    return (
        <>
            {/* Cart Overlay */}
            <div
                className={`fixed inset-0 bg-white/40 z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
                    }`}
                onClick={onClose}
                id="cart-overlay"
            ></div>

            {/* Cart Drawer */}
            <div
                className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-surface z-50 transform transition-transform duration-300 flex flex-col shadow-2xl ${isOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
                id="cart-drawer"
            >
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b border-outline-variant/40">
                    <h2 className="font-headline-md text-headline-md text-primary">Your Cart</h2>
                    <button
                        className="text-on-surface-variant hover:opacity-70 transition-opacity"
                        onClick={onClose}
                        id="close-cart-btn"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                {/* Items Container */}
                <div className="flex-grow overflow-y-auto p-4 space-y-4" id="cart-items-container">
                    {services?.length > 0 ? (
                        services.map((service) => (
                            <div key={service.name} className="cart-item flex items-center gap-4 p-3 rounded-md bg-surface-container-low border border-outline-variant/40">
                                <img src={service.img} alt="salon image" className="w-16 h-16 object-cover rounded-md flex-shrink-0" />
                                <div className="flex-grow">
                                    <h4 className="font-body-md font-medium text-primary line-clamp-1">{service.title}</h4>
                                    <p className="text-on-surface-variant font-body-md">1000</p>
                                </div>
                                <button className="text-on-surface-variant hover:text-error transition-colors p-2" >
                                    <span className="material-symbols-outlined text-sm">delete</span>
                                </button>
                            </div>
                        ))) : (
                        <div className="text-center text-on-surface-variant mt-10" id="empty-cart-msg">
                            Your cart is empty.
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-outline-variant/40 bg-surface-container-low">
                    <div className="flex justify-between mb-4 font-body-lg text-primary">
                        <span>Subtotal</span>
                        <span id="cart-subtotal">{subtotal}</span>
                    </div>
                    <button className="w-full py-3 bg-primary-container text-on-primary font-label-md uppercase tracking-widest rounded-md hover:opacity-90 transition-opacity">
                        Checkout
                    </button>
                </div>
            </div>
        </>
    );
};

export default CartDrawer;