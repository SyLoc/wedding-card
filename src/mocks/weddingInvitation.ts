import type { WeddingInvitation } from "@/types/wedding"

const heroImage = "/wedding/green-floral/hero.jpg"

export const GREEN_FLORAL_INVITATION: WeddingInvitation = {
  id: "green-floral-demo",
  slug: "minh-khoi-thao-nhi",
  templateId: "boho_floral_green",
  status: "published",
  couple: {
    eyebrow: "Hai chúng mình",
    first: {
      name: "Minh Khôi",
      role: "Chú rể",
      description:
        "Một người điềm đạm, yêu những chuyến đi dài và luôn tin rằng nhà là nơi có người mình thương.",
    },
    second: {
      name: "Thảo Nhi",
      role: "Cô dâu",
      description:
        "Một cô gái yêu hoa, thích những buổi sáng bình yên và mong cùng anh vun đắp một mái nhà đầy tiếng cười.",
    },
  },
  families: [
    {
      side: "Nhà trai",
      father: "Ông Nguyễn Văn Thành",
      mother: "Bà Trần Thu Hà",
      address: "Thành phố Hồ Chí Minh",
    },
    {
      side: "Nhà gái",
      father: "Ông Lê Hoàng Nam",
      mother: "Bà Phạm Ngọc Lan",
      address: "Thành phố Đà Lạt",
    },
  ],
  events: [
    {
      id: "ceremony",
      title: "Lễ thành hôn",
      dateTime: "2027-03-20T09:00:00+07:00",
      lunarDate: "Nhằm ngày 13 tháng 02 năm Đinh Mùi",
      venue: "Tư gia nhà gái",
      address: "24 Trần Hưng Đạo, Phường 10, Đà Lạt",
      mapUrl: "https://maps.google.com/?q=Da+Lat+Vietnam",
    },
    {
      id: "reception",
      title: "Tiệc chung vui",
      dateTime: "2027-03-20T11:00:00+07:00",
      lunarDate: "Đón khách lúc 10 giờ 30",
      venue: "The Garden Palace",
      address: "12 Hồ Tùng Mậu, Phường 3, Đà Lạt",
      mapUrl: "https://maps.google.com/?q=Da+Lat+Vietnam",
    },
  ],
  gallery: [
    {
      id: "gallery-1",
      src: heroImage,
      alt: "Cô dâu và chú rể trong khu vườn xanh",
      position: "center 66%",
    },
    {
      id: "gallery-2",
      src: heroImage,
      alt: "Khoảnh khắc bình yên của đôi uyên ương",
      position: "center 88%",
    },
    {
      id: "gallery-3",
      src: heroImage,
      alt: "Hoa trắng và lá bạch đàn trong ngày cưới",
      position: "left 58%",
    },
    {
      id: "gallery-4",
      src: heroImage,
      alt: "Chân dung cô dâu chú rể",
      position: "right 72%",
    },
  ],
  giftAccounts: [
    {
      id: "gift-bride",
      label: "Mừng cưới cô dâu",
      bankName: "Ngân hàng Demo",
      accountName: "LE THAO NHI",
      accountNumber: "0123 456 789",
    },
    {
      id: "gift-groom",
      label: "Mừng cưới chú rể",
      bankName: "Ngân hàng Demo",
      accountName: "NGUYEN MINH KHOI",
      accountNumber: "9876 543 210",
    },
  ],
  guest: {
    name: "",
    group: "",
    salutation: "bạn",
    couplePronoun: "chúng mình",
  },
  music: {
    src: "",
    title: "Bản nhạc của chúng mình",
    autoplay: true,
  },
  heroImage,
  eyebrow: "Save our date",
  invitationTitle: "Trân trọng kính mời",
  quote:
    "Giữa muôn vạn người, chúng mình đã tìm thấy nhau và chọn cùng nhau đi hết hành trình này.",
  story:
    "Từ một cuộc gặp tình cờ trong ngày mưa Đà Lạt, chúng mình đã có bốn năm cùng trưởng thành, sẻ chia và đi qua thật nhiều miền đất. Giờ đây, một chương mới sắp bắt đầu — và sẽ trọn vẹn hơn khi có bạn ở bên chung vui.",
  closingMessage:
    "Sự hiện diện của bạn là món quà quý giá nhất trong ngày vui của chúng mình.",
}
