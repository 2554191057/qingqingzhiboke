with open('admin.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. 聊天信息底部加输入框+拉黑按钮（在 </div> 前）
old_chat_end = """      h += '</div>';
    }
  }
  h += '</div>';

  h += '<div class="panel" id="panel-users\""""
new_chat_end = """      h += '</div>';
    }
  }
  h += '<div class="mgmt-add"><input type="text" id="chatBlkInput" placeholder="输入邮箱、昵称或 IP（自动识别）"><button data-act="chat-add-blk">拉黑</button></div></div>';

  h += '<div class="panel" id="panel-users\""""
content = content.replace(old_chat_end, new_chat_end)

# 2. 账号管理底部加输入框+拉黑按钮
old_user_end = """    }
  }
  h += '</div>';

  h += '<div class="panel" id="panel-block\""""
new_user_end = """    }
  }
  h += '<div class="mgmt-add"><input type="text" id="userBlkInput" placeholder="输入邮箱、昵称或 IP（自动识别）"><button data-act="user-add-blk">拉黑</button></div></div>';

  h += '<div class="panel" id="panel-block\""""
content = content.replace(old_user_end, new_user_end)

with open('admin.html', 'w', encoding='utf-8') as f:
    f.write(content)
print("OK: 聊天信息和账号管理底部加拉黑输入框")
