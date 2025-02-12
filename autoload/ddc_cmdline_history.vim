function! ddc_cmdline_history#get(max) abort
  const type = getcmdtype()
  const max = [a:max, type->histnr()]->min()
  if max < 1
    return []
  endif

  let histories = range(1, max)->map({ _, val -> type->histget(-val) })

  " Filter
  const compltype = getcmdcompltype()
  if compltype ==# 'dir'
    let histories = histories
          \ ->filter({ _, val -> val->isdirectory() })
  elseif compltype ==# 'file'
    let histories = histories
          \ ->filter({ _, val -> val->isdirectory() || val->filereadable() })
  endif

  return histories
endfunction
