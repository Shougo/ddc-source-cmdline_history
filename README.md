# ddc-source-cmdline_history

Command history completion for ddc.vim

This source collects items from `histget()`. It is useful for command line
completion.

## Required

### denops.vim

https://github.com/vim-denops/denops.vim

### ddc.vim

https://github.com/Shougo/ddc.vim

## Configuration

```vim
call ddc#custom#patch_global('sources', ['cmdline_history'])

call ddc#custom#patch_global('sourceOptions', #{
      \   cmdline_history: #{ mark: 'history' },
      \ })
```
