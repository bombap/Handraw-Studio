import type { Lang, StyleGroupId } from "./types";

const SPARKS: Record<StyleGroupId, { vi: string[]; en: string[] }> = {
  A: {
    vi: [
      "Một con mèo đeo kính đọc báo trên ghế công viên lúc tan tầm",
      "Ông cụ mặc vest đạp xe máy chở một chậu mai giữa Sài Gòn giờ cao điểm",
      "Cuộc họp Zoom mà tất cả đều là vịt mặc áo sơ mi",
      "Cô gái cầm ô giữa nắng tháng tư, nhìn đồng hồ rồi lại nhìn trời",
    ],
    en: [
      "A cat in spectacles reading a newspaper on a park bench at rush hour",
      "An old man in a suit scooter-ing a pot of apricot blossoms through traffic",
      "A Zoom call in which every participant is a duck in a dress shirt",
      "A woman holding an umbrella in April sun, checking her watch, then the sky",
    ],
  },
  B: {
    vi: [
      "Đứa trẻ đội chảo làm mũ, đi tìm mặt trăng rơi sau hàng rào",
      "Cáo nhỏ pha trà cho thỏ trong bếp gỗ có cửa sổ nhìn ra tuyết",
      "Hai anh em thả thuyền giấy trên vũng nước sau mưa",
      "Bà kể chuyện dưới ánh đèn dầu, đứa cháu ôm gối nghe đến khuya",
    ],
    en: [
      "A child wearing a saucepan as a hat, hunting a fallen moon behind a fence",
      "A little fox pouring tea for a rabbit in a wood kitchen with snow at the window",
      "Two siblings launching a paper boat into a puddle after rain",
      "A grandmother telling stories by an oil lamp, a grandchild hugging a pillow",
    ],
  },
  C: {
    vi: [
      "Cô gái tóc húi cua, áo khoác rộng, đứng trên sân thượng lúc magic hour",
      "Anh chàng tai nghe to, balo một quai, ngồi bậc cầu thang ăn bánh mì",
      "Nhân vật tóc hồng cầm ly cà phê, gió thổi tóc và khói sữa",
      "Người đi đêm với áo mưa trong suốt, thành phố neon sau lưng",
    ],
    en: [
      "A buzz-cut girl in an oversized jacket on a rooftop at magic hour",
      "A guy with huge headphones, one-strap backpack, eating a baguette on stair steps",
      "A pink-haired figure holding coffee, wind lifting hair and milk steam",
      "A night walker in a clear raincoat, neon city stacked behind them",
    ],
  },
  D: {
    vi: [
      "Nữ sinh tan học, đứng trú mưa dưới mái hiên cửa hàng tạp hóa",
      "Quầy ramune hè, ánh nắng xuyên qua rèm noren, một ly đầy đá",
      "Mèo nằm cạnh cửa sổ tatami, nhìn mưa xuân trên mái ngói",
      "Ga tàu nhỏ lúc 6 giờ chiều, một chiếc cặp để quên trên ghế",
    ],
    en: [
      "A schoolgirl sheltering from rain under a corner-shop awning after class",
      "A summer ramune stall, sun through a noren curtain, one glass packed with ice",
      "A cat on tatami by the window watching spring rain on tile roofs",
      "A tiny station at 6 p.m., a forgotten school bag on the bench",
    ],
  },
  E: {
    vi: [
      "Dạ yến dưới đèn lồng, khói trà và một chiếc bình men rạn",
      "Cầu đá cong sau mưa, người áo dài cầm dù dầu đi một mình",
      "Phòng thư pháp buổi sớm, ánh nắng trên giấy xuyến chỉ và nghiên mực",
      "Hồ mùa thu, hai chiếc thuyền giấy, núi xa mờ sương",
    ],
    en: [
      "A night banquet under lanterns, tea steam, and a crackle-glaze vase",
      "An arched stone bridge after rain, one figure in áo dài with an oil-paper umbrella",
      "A calligraphy room at dawn, sun on xuan paper and an ink stone",
      "An autumn lake, two paper boats, distant mountains lost in mist",
    ],
  },
  F: {
    vi: [
      "Bàn làm việc đêm, màn hình code, ly trà sữa đổ một ít lên phím",
      "Tiệm photocopy cũ, ánh đèn huỳnh quang, một con tem dán lệch",
      "Ban công chung cư giờ 5 chiều, quần áo phơi và chậu xương rồng",
      "Cửa hàng tiện lợi 2 giờ sáng, nhân viên gật gù, mưa ngoài kính",
    ],
    en: [
      "A night desk, a code editor glow, milk tea spilled on the keyboard",
      "An old copy shop under fluorescent light, one stamp stuck slightly crooked",
      "A 5 p.m. apartment balcony, laundry and a cactus in a tin",
      "A 2 a.m. convenience store, a nodding clerk, rain on the glass",
    ],
  },
  G: {
    vi: [
      "Hai người ngồi trên nóc xe bus hai tầng, thành phố loang màu hoàng hôn",
      "Cô gái vẽ mural trên tường gạch, sơn vẩy lên giày và gò má",
      "Khu chợ đêm, khói than, một đĩa mực nướng còn nghi ngút",
      "Phòng ngủ tuổi teen, poster cũ, nắng sọc qua rèm, một con robot đồ chơi",
    ],
    en: [
      "Two people on the roof of a double-decker, the city melting into dusk",
      "A girl painting a brick mural, paint freckled on her shoes and cheek",
      "A night market, charcoal smoke, a plate of grilled squid still steaming",
      "A teen bedroom, old posters, striped sun through curtains, one toy robot",
    ],
  },
  H: {
    vi: [
      "Nhân vật que diêm đội nón lá, đứng giữa ruộng lúa chín",
      "Cô bé trong rừng thông, áo khoác rêu, cầm lồng đèn giấy",
      "Tàu điện đêm mưa, một người ôm guitar nhìn cửa sổ mờ hơi nước",
      "Lão nông ngồi bậc thềm gạch, rổ ớt đỏ và một con gà giấy",
    ],
    en: [
      "A stick-figure farmer in a leaf hat standing in ripe rice fields",
      "A child in a moss-green coat holding a paper lantern in a pine forest",
      "A night tram in the rain, someone hugging a guitar at a fogged window",
      "An old farmer on a brick stoop, a basket of red chilies and a paper hen",
    ],
  },
};

export function pickSpark(lang: Lang, groups: StyleGroupId[], exclude?: string): string {
  const pool = (groups.length ? groups : (Object.keys(SPARKS) as StyleGroupId[])).flatMap(
    (g) => SPARKS[g][lang],
  );
  const filtered = pool.filter((item) => item !== exclude);
  const source = filtered.length ? filtered : pool;
  return source[Math.floor(Math.random() * source.length)] ?? pool[0];
}
