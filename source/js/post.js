$(document).ready(() => {
  $('.markdown-content img').fancyImg()

  let $pageNav = $('#post-nav')
  const $postContent = $('#post-content')

  if($pageNav[0]) generateTOC($pageNav, $postContent)
})

function getTOC($content) {
  const getChildTOC = (list) => {
    const level = list.node.level + 1

    for (let index = 0; index < list.children.length; index++) {
      const item = list.children[index];

      if (item.children.length !== 0) getChildTOC(item)
      else {
          if (item.node.level !== level) {
          const child = list.children.splice(index, 1)

          list.children[index - 1].children.push(child)
        }
      }
    }
  }

  const list = []
  let preLevel = null

  $content.find('h1, h2, h3, h4, h5, h6').each((index, ele) => {
    const level = +ele.nodeName.split('').pop()
    if (!preLevel) preLevel = level
    const text = $(ele).text()

    const node = {
      level,
      text,
      href: text.split(/[\s.*+?^=!:${}()|[\]/\\]+/).filter(item => item !== '').join('-'),
    }

    if(preLevel === level) {
      list.push({
        node,
        children: []
      })
    } else {
      list[list.length - 1].children.push({
        node,
        children: []
      })
    }
  })

  list.forEach(child => {
    getChildTOC(child)
  });

  return list
}

function generateTOC($pageNav, $content) {

  const generate = (list) => {
    const $ul = $('<ul> </ul>')

    list.forEach(child => {
      const $li = $('<li> </li>')

      $li.append($(`<a href='#${child.node.href}'>${child.node.text}</a>`))

      if (child.children.length !== 0) {
        $li.append(generate(child.children))
      }

      $ul.append($li)
    })

    return $ul
  }

  const TOC = getTOC($content)

  const $ul = generate(TOC)

  $pageNav.append($ul).addClass('active')
}
