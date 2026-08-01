export default function Hero() {
    return (
        <section className="relative w-full h-[530px] min-h-[400px]">
            <div
                className="absolute inset-0 bg-cover bg-center w-full h-full"
                style={{ backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuAS2qwUV1T7ctkONlx5xRK_5fZ3XHvH8QqgboeL9PaelGWAfXQxuyjebyg78j6NGRVei3jm2Hf0bdooDZQyS76t3x08eywSmSXo9vkzRd0cdDvfjiCn_9d35uIWnC1_xQt73EATtvMTk6RQgq4zPkUeFUIi5XGm3Gha5wxB2OmBVjKAwJW339E-rvwft4i0X6K-nHFlpraAehaZxVPxZ8tGU8DEeybPihcK4N_TZVtDIRR7aRd6NEGgGP8XJv-VsMa1mAGyqJV4ec4S')` }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#fbf9f4] to-transparent/20"></div>
            <div className="absolute inset-0 flex items-end pb-12 px-6 md:px-16 container mx-auto max-w-[1200px]">
                <h2 className="font-headline-display text-[#33251d]">Hair Masters</h2>
            </div>
        </section>
    )
}