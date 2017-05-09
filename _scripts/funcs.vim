function! OpenPost()
    python3 << EOF
import vim
import os.path
import webbrowser
# _posts/2012-08-24-show-or-hide-hidden-files-on-your-mac-with-applescript.md
fn = vim.current.buffer.name.split('/')[-1]
base = fn.rsplit('.')[0]
year, month, day, name = base.split('-', maxsplit=3)

local_url_base = "http://localhost:4000"
post_path = os.path.join(local_url_base, year, month, name)
webbrowser.open(post_path)

EOF
endfunction

command! OpenPost call OpenPost()
